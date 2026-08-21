// app.js — UI logic for Declutter Quest (Roadmap M1.2, M1.3, M1.4)
// Single-page, no router: a handful of <section> "screens" in index.html are
// shown/hidden by id. All data access goes through data.js.

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
  archived: 'Archived',
};

// Item status cycle (M2.2, FR-004): tapping an item advances it through this order.
const ITEM_STATUS_CYCLE = ['pending', 'dealt_with', 'na'];
const ITEM_STATUS_LABELS = { pending: 'Pending', dealt_with: 'Dealt With', na: 'None Found' };
const ITEM_STATUS_ICONS = { pending: '○', dealt_with: '✓', na: '–' };

function nextItemStatus(status) {
  const i = ITEM_STATUS_CYCLE.indexOf(status);
  return ITEM_STATUS_CYCLE[(i + 1) % ITEM_STATUS_CYCLE.length];
}

let zoneTypes = [];
let pendingZoneCreation = null; // { typeId, defaultItems } while naming a library zone, or null for custom
let currentZoneId = null; // zone shown in view-zone-detail, so add-item knows where to attach

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.hidden = el.id !== id;
  });
}

// ----- Zone list (M1.2, FR-011) -----

function renderZoneList() {
  const zones = getZones();
  const listEl = document.getElementById('zone-list');
  const emptyEl = document.getElementById('zone-list-empty');

  listEl.innerHTML = '';

  if (zones.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  zones.forEach((zone) => {
    const percent = getZonePercentResolved(zone.id);
    const card = document.createElement('button');
    card.className = 'zone-card';
    card.type = 'button';
    card.innerHTML = `
      <span class="zone-card-name">${escapeHtml(zone.name)}</span>
      <span class="zone-card-meta">
        <span class="zone-status zone-status--${zone.status}">${STATUS_LABELS[zone.status]}</span>
        <span class="zone-percent">${percent}% resolved</span>
      </span>
    `;
    card.addEventListener('click', () => openZoneDetail(zone.id));
    listEl.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ----- Zone detail (read-only checklist view; full item interaction is M2) -----

function openZoneDetail(zoneId) {
  const zone = getZone(zoneId);
  if (!zone) return;

  currentZoneId = zoneId;
  document.getElementById('zone-detail-name').textContent = zone.name;
  const items = getItemsForZone(zoneId);
  const itemsEl = document.getElementById('zone-detail-items');
  itemsEl.innerHTML = '';

  if (items.length === 0) {
    itemsEl.innerHTML = '<li class="zone-detail-empty">No items yet.</li>';
  } else {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = `zone-item zone-item--${item.status}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zone-item-btn';
      btn.innerHTML = `
        <span class="zone-item-icon" aria-hidden="true">${ITEM_STATUS_ICONS[item.status]}</span>
        <span class="zone-item-name">${escapeHtml(item.name)}</span>
        <span class="zone-item-status">${ITEM_STATUS_LABELS[item.status]}</span>
      `;
      btn.addEventListener('click', () => cycleItemStatus(item.id, zoneId));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'zone-item-delete-btn';
      deleteBtn.setAttribute('aria-label', `Delete ${item.name}`);
      deleteBtn.textContent = '✕';
      deleteBtn.addEventListener('click', () => removeItem(item.id, zoneId));

      li.appendChild(btn);
      li.appendChild(deleteBtn);
      itemsEl.appendChild(li);
    });
  }

  showScreen('view-zone-detail');
}

// Advances one item to its next status (Pending -> Dealt With -> None Found -> Pending) and
// re-renders. Also bumps a not-started zone to in_progress on its first interaction,
// since FR-011's zone-list status now has something to reflect. XP awarding (FR-007)
// is M3.3 scope, not this slice.
function cycleItemStatus(itemId, zoneId) {
  const item = getItemsForZone(zoneId).find((i) => i.id === itemId);
  if (!item) return;

  updateItem(itemId, { status: nextItemStatus(item.status) });

  const zone = getZone(zoneId);
  if (zone && zone.status === 'not_started') {
    updateZone(zoneId, { status: 'in_progress' });
  }

  openZoneDetail(zoneId);
}

// Permanently removes an item (any item, template or custom) after a confirm
// prompt — unlike None Found, this has no undo, so it's a separate control from the
// tap-to-cycle status button, not folded into the status cycle itself.
function removeItem(itemId, zoneId) {
  const item = getItemsForZone(zoneId).find((i) => i.id === itemId);
  if (!item) return;
  if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;

  deleteItem(itemId);
  openZoneDetail(zoneId);
}

// ----- Add custom item (M2.3, FR-005) -----
// New item behaves identically to template items: same pending status, same
// cycle/render path (openZoneDetail -> cycleItemStatus), just source: 'custom'.
function addCustomItem() {
  const input = document.getElementById('add-item-input');
  const name = input.value.trim();
  if (!name || !currentZoneId) {
    input.focus();
    return;
  }

  addItem(currentZoneId, name);

  const zone = getZone(currentZoneId);
  if (zone && zone.status === 'not_started') {
    updateZone(currentZoneId, { status: 'in_progress' });
  }

  input.value = '';
  openZoneDetail(currentZoneId);
  input.focus();
}

// ----- New zone flow (M1.3 template, M1.4 freeform) -----

function openNewZoneChoice() {
  showScreen('view-new-zone');
}

function openLibrary() {
  const listEl = document.getElementById('library-list');
  listEl.innerHTML = '';

  zoneTypes.forEach((type) => {
    const card = document.createElement('button');
    card.className = 'library-card';
    card.type = 'button';
    card.innerHTML = `
      <span class="library-card-name">${escapeHtml(type.name)}</span>
      <span class="library-card-count">${type.defaultItems.length} items</span>
    `;
    card.addEventListener('click', () => openNameZone(type));
    listEl.appendChild(card);
  });

  showScreen('view-library');
}

function openNameZone(type) {
  pendingZoneCreation = type || null;
  const input = document.getElementById('zone-name-input');
  input.value = type ? type.name : '';
  document.getElementById('zone-name-heading').textContent = type
    ? `Name your "${type.name}" zone`
    : 'Name your custom zone';
  showScreen('view-name-zone');
  input.focus();
}

function confirmCreateZone() {
  const input = document.getElementById('zone-name-input');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }

  const zone = pendingZoneCreation
    ? createZone({
        name,
        typeId: pendingZoneCreation.id,
        defaultItems: pendingZoneCreation.defaultItems,
      })
    : createZone({ name });

  pendingZoneCreation = null;
  renderZoneList();
  showScreen('view-list');
  openZoneDetail(zone.id);
}

// ----- Export/import (M0.3, FR-016) -----

function showDataIoStatus(message, tone) {
  const el = document.getElementById('data-io-status');
  el.textContent = message;
  el.dataset.tone = tone;
  el.hidden = false;
}

function exportData() {
  const json = exportDataJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);

  const a = document.createElement('a');
  a.href = url;
  a.download = `declutter-quest-export-${dateStamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showDataIoStatus('Export downloaded.', 'success');
}

function handleImportFileChosen(event) {
  const file = event.target.files[0];
  event.target.value = ''; // allow re-selecting the same file later
  if (!file) return;

  const hasExistingData = getZones().length > 0;
  if (hasExistingData && !confirm('Importing will overwrite all data currently in the app. Continue?')) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = importDataJson(reader.result);
    if (!result.ok) {
      showDataIoStatus(result.error, 'error');
      return;
    }
    renderZoneList();
    showScreen('view-list');
    showDataIoStatus('Import complete.', 'success');
  };
  reader.onerror = () => showDataIoStatus('Could not read that file.', 'error');
  reader.readAsText(file);
}

// ----- Wire up + boot -----

async function loadZoneTypes() {
  try {
    const res = await fetch('data/zone-types.json');
    const data = await res.json();
    zoneTypes = data.zoneTypes;
  } catch (err) {
    zoneTypes = [];
  }
}

function init() {
  document.getElementById('new-zone-btn').addEventListener('click', openNewZoneChoice);
  document.getElementById('choose-library-btn').addEventListener('click', openLibrary);
  document.getElementById('choose-custom-btn').addEventListener('click', () => openNameZone(null));
  document.getElementById('back-to-list-from-new').addEventListener('click', () => showScreen('view-list'));
  document.getElementById('back-to-new-from-library').addEventListener('click', () => showScreen('view-new-zone'));
  document.getElementById('back-from-name-zone').addEventListener('click', () => {
    showScreen(pendingZoneCreation ? 'view-library' : 'view-new-zone');
  });
  document.getElementById('create-zone-btn').addEventListener('click', confirmCreateZone);
  document.getElementById('zone-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmCreateZone();
  });
  document.getElementById('back-to-list-from-detail').addEventListener('click', () => {
    renderZoneList();
    showScreen('view-list');
  });
  document.getElementById('add-item-btn').addEventListener('click', addCustomItem);
  document.getElementById('add-item-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addCustomItem();
  });

  document.getElementById('export-data-btn').addEventListener('click', exportData);
  document.getElementById('import-data-btn').addEventListener('click', () => {
    document.getElementById('import-data-file').click();
  });
  document.getElementById('import-data-file').addEventListener('change', handleImportFileChosen);

  // Best-effort request to reduce eviction risk; not load-bearing (FR-016 export/import is the real safety net).
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist();
  }

  renderZoneList();
  loadZoneTypes();
  showScreen('view-list');
}

init();
