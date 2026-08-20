// data.js — localStorage data layer for Declutter Quest (Roadmap M1.1)
//
// One JSON blob at DATA_KEY holds all app data, matching the shape in
// TECHNICAL_DESIGN.md's Data Model section: zones, items, rewards,
// weeklyCheckins. Rewards/weeklyCheckins are unused until M4/M5 but are
// included now so the blob shape doesn't need a migration later.

const DATA_KEY = 'declutter-quest:data';

function loadData() {
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) {
    return { zones: [], items: [], rewards: [], weeklyCheckins: [] };
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function makeId() {
  return crypto.randomUUID();
}

// ----- Zones -----

function getZones() {
  return loadData().zones;
}

function getZone(zoneId) {
  return loadData().zones.find((z) => z.id === zoneId) || null;
}

// defaultItems: array of item-name strings (from a ZoneType), or omitted for a freeform zone.
function createZone({ name, typeId = null, defaultItems = [] }) {
  const data = loadData();
  const zone = {
    id: makeId(),
    name,
    typeId,
    status: 'not_started',
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  data.zones.push(zone);

  defaultItems.forEach((itemName) => {
    data.items.push({
      id: makeId(),
      zoneId: zone.id,
      name: itemName,
      status: 'pending',
      source: 'template',
      xpAwarded: 0,
    });
  });

  saveData(data);
  return zone;
}

function updateZone(zoneId, changes) {
  const data = loadData();
  const zone = data.zones.find((z) => z.id === zoneId);
  if (!zone) return null;
  Object.assign(zone, changes);
  saveData(data);
  return zone;
}

function deleteZone(zoneId) {
  const data = loadData();
  data.zones = data.zones.filter((z) => z.id !== zoneId);
  data.items = data.items.filter((i) => i.zoneId !== zoneId);
  saveData(data);
}

// ----- Items -----

function getItemsForZone(zoneId) {
  return loadData().items.filter((i) => i.zoneId === zoneId);
}

function addItem(zoneId, name, source = 'custom') {
  const data = loadData();
  const item = {
    id: makeId(),
    zoneId,
    name,
    status: 'pending',
    source,
    xpAwarded: 0,
  };
  data.items.push(item);
  saveData(data);
  return item;
}

function updateItem(itemId, changes) {
  const data = loadData();
  const item = data.items.find((i) => i.id === itemId);
  if (!item) return null;
  Object.assign(item, changes);
  saveData(data);
  return item;
}

function deleteItem(itemId) {
  const data = loadData();
  data.items = data.items.filter((i) => i.id !== itemId);
  saveData(data);
}

// percent of a zone's items that are resolved (dealt_with or na); 0 for a zone with no items.
function getZonePercentResolved(zoneId) {
  const items = getItemsForZone(zoneId);
  if (items.length === 0) return 0;
  const resolved = items.filter((i) => i.status === 'dealt_with' || i.status === 'na').length;
  return Math.round((resolved / items.length) * 100);
}
