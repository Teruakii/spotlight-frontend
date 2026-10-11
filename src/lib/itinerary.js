// Pure helpers for editing a collection's day-by-day layout. Every function
// takes the collection's items (ordered by day, then position) and returns the
// full layout array that PUT /collections/:id/layout expects.

export function toLayout(items) {
  return items.map((item) => ({ id: item.id, day: item.day, startTime: item.startTime ?? null }));
}

export function groupByDay(items) {
  const days = new Map();
  for (const item of items) {
    if (!days.has(item.day)) days.set(item.day, []);
    days.get(item.day).push(item);
  }
  return [...days.entries()].sort(([a], [b]) => a - b).map(([day, dayItems]) => ({ day, items: dayItems }));
}

// Swap an item with its neighbour inside the same day (delta = -1 up, +1 down).
export function moveWithinDay(items, itemId, delta) {
  const layout = toLayout(items);
  const index = layout.findIndex((entry) => entry.id === itemId);
  const target = index + delta;
  if (index < 0 || target < 0 || target >= layout.length || layout[target].day !== layout[index].day) {
    return null;
  }
  [layout[index], layout[target]] = [layout[target], layout[index]];
  return layout;
}

// Move an item to the end of another day.
export function moveToDay(items, itemId, day) {
  const layout = toLayout(items);
  const index = layout.findIndex((entry) => entry.id === itemId);
  if (index < 0) return null;
  const [entry] = layout.splice(index, 1);
  const lastOfDay = layout.findLastIndex((e) => e.day <= day);
  layout.splice(lastOfDay + 1, 0, { ...entry, day });
  return layout;
}

export function setStartTime(items, itemId, startTime) {
  return toLayout(items).map((entry) => (entry.id === itemId ? { ...entry, startTime: startTime || null } : entry));
}
