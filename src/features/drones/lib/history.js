import { haversineKm } from "../../../shared/lib/geo";

export function updateTrail(trails, id, coords, canMove, selectedId, TRAIL_MAX, MAX_TRAILS_DRONES) {
  const keepTrail =
    selectedId === id || Object.keys(trails).length < MAX_TRAILS_DRONES;
  if (!keepTrail) return;

  if (canMove) {
    const t = trails[id] ? trails[id].slice() : [];
    t.push(coords);
    if (t.length > TRAIL_MAX) t.splice(0, t.length - TRAIL_MAX);
    trails[id] = t;
  } else if (!trails[id] && coords) {
    trails[id] = [coords]; // seed first point
  }
}

export function updateFlights(flights, id, canMove, coords, prev, ts, GAP_MS, statusChanged) {
  const list = flights[id] ? flights[id].slice() : [];
  let current = list[list.length - 1];

  if (canMove) {
    const lastSeenTs = prev.lastSeen ?? 0;
    const longGap = ts - lastSeenTs > GAP_MS;
    const shouldStartNew = !current || current.endedAt != null || statusChanged || longGap;
    if (shouldStartNew) {
      current = {
        flightId: `${id}-${ts}`,
        startedAt: ts,
        endedAt: null,
        statusAtStart: "allowed",
        coords: [],
        distanceKm: 0,
      };
      list.push(current);
    }
    const lastPoint = current.coords[current.coords.length - 1];
    current.coords.push([coords[0], coords[1], ts]);
    if (lastPoint) current.distanceKm += haversineKm([lastPoint[0], lastPoint[1]], coords);
  } else {
    if (current && current.endedAt == null) {
      current = { ...current, endedAt: ts };
      list[list.length - 1] = current;
    }
  }

  flights[id] = list;
}
