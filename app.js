// app.js — UI logic for Declutter Quest (Roadmap M1.2, M1.3, M1.4)
// Single-page, no router: a handful of <section> "screens" in index.html are
// shown/hidden by id. All data access goes through data.js.

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
  archived: 'Archived',
};

let zoneTypes = [];
let pendingZoneCreation = null; // { typeId, defaultItems } while naming a library zone, or null for custom

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

  document.getElementById('zone-detail-name').textContent = zone.name;
  const items = getItemsForZone(zoneId);
  const itemsEl = document.getElementById('zone-detail-items');
  itemsEl.innerHTML = '';

  if (items.length === 0) {
    itemsEl.innerHTML = '<li class="zone-detail-empty">No items yet.</li>';
  } else {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.name;
      itemsEl.appendChild(li);
    });
  }

  showScreen('view-zone-detail');
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
  document.getElementById('new-zone-btn-empty').addEventListener('click', openNewZoneChoice);
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
  document.getElementById('back-to-list-from-detail').addEventListener('click', () => showScreen('view-list'));

  renderZoneList();
  loadZoneTypes();
  showScreen('view-list');
}

init();
