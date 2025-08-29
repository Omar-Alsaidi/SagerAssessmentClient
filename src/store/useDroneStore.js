import { create } from "zustand";
import { now } from "../shared/lib/time";
import { ensureSdRegWith5Digits, randomRegistrationByAllowed, randomSerial, rand5 } from "../shared/lib/identity";
import { TRAIL_MAX, MAX_TRAILS_DRONES, GAP_MS } from "./config";
import { getWsUrl } from "./net";
import { enqueueForFlush, resetBatch } from "./batch";
import { openSocketForIdentity as openSocketForIdentityImpl, clearAllSockets } from "./wsManager";
import { updateTrail, updateFlights } from "../features/drones/lib/history";
import { nextCoords, nextYaw, nextAltitude } from "../features/drones/lib/snapshot";

export const useDroneStore = create((set, get) => ({
  wsState: "disconnected",
  drones: {},
  trails: {},
  flights: {},
  deniedCount: 0,
  selectedDroneId: null,
  setSelectedDroneId: (id) => set({ selectedDroneId: id }),

  /* ---------- lifecycle ---------- */
  clearAll: () => {
    clearAllSockets();
    resetBatch();
    set({
      wsState: "disconnected",
      drones: {},
      trails: {},
      flights: {},
      deniedCount: 0,
      selectedDroneId: null,
    });
  },

  /* ---------- per-drone sockets ---------- */
  openSocketForIdentity: (meta, url = getWsUrl()) => {
    openSocketForIdentityImpl(get, set, meta, url);
  },

  /** Bulk create N drones: open N sockets; random allowed/denied (by reg) */
  createRandomDrones: (count, opts = {}) => {
    const { allowRatio = 0.5, pilots = ["Besher"] } = opts;
    const metas = Array.from({ length: count }, () => {
      const allowed = Math.random() < allowRatio;
      const regBase = randomRegistrationByAllowed(allowed);
      return {
        registration: ensureSdRegWith5Digits(regBase),
        serial: randomSerial(10),
        name: "Dji Mavic",
        pilot: pilots[Math.floor(Math.random() * pilots.length)],
        organization: "Sager Drone",
      };
    });
    const { openSocketForIdentity } = get();
    for (const m of metas) openSocketForIdentity(m);
  },

  /* ---------- ingest & history ---------- */
  ingestBatch: (features) => {
    if (!features?.length) return;

    set((state) => {
      const drones = { ...state.drones };
      const trails = { ...state.trails };
      const flights = { ...state.flights };
      const ts = now();

      for (const f of features) {
        const coords = f?.geometry?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) continue;
        const p = f?.properties || {};

        const id = p.id || p.serial || p.registration || p.droneId || p.Name || `dr-${Math.random().toString(36).slice(2)}`;
        const prev = drones[id] || {};
        const prevStatus = prev.status;

        // Descriptive fields
        const model        = (p.Name || p.model) ?? prev.model ?? "Drone";
        const pilot        = p.pilot ?? prev.pilot;
        const organization = p.organization ?? prev.organization;
        const registration = prev.registration ?? (p.registration ? ensureSdRegWith5Digits(p.registration) : null);
        const serial       = prev.serial ?? p.serial;

        // Movement rules
        const status  = (p.status ?? prev.status ?? "denied");
        const canMove = status === "allowed";
        const cCoords = nextCoords(prev.coords, coords, canMove);
        const cYaw    = nextYaw(prev.yaw, p.yaw, canMove);
        const cAlt    = nextAltitude(prev.altitude, p.altitude, canMove);

        const snapshot = {
          id,
          model,
          registration,
          serial,
          pilot,
          organization,
          status,
          coords: cCoords,
          altitude: cAlt,
          flightTime: p.flightTime || prev.flightTime || "",
          yaw: cYaw,
          lastSeen: ts,
        };
        drones[id] = snapshot;

        // Trails & Flights
        updateTrail(trails, id, snapshot.coords, canMove, state.selectedDroneId, TRAIL_MAX, MAX_TRAILS_DRONES);
        const statusChanged = prevStatus !== undefined && prevStatus !== status;
        updateFlights(flights, id, canMove, coords, prev, ts, GAP_MS, statusChanged);
      }

      const deniedCount = Object.values(drones).reduce((n, d) => n + (d.status === "denied" ? 1 : 0), 0);
      return { drones, trails, flights, deniedCount };
    });
  },

  closeActiveFlights: () =>
    set((state) => {
      const flights = { ...state.flights };
      const ts = now();
      for (const id of Object.keys(flights)) {
        const arr = flights[id] || [];
        if (arr.length && arr[arr.length - 1].endedAt == null) {
          arr[arr.length - 1] = { ...arr[arr.length - 1], endedAt: ts };
        }
      }
      return { flights };
    }),

  // simple demo seeding (no sockets)
  seedDemoDrones: () => {
    const features = [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [35.930359, 31.963158] },
        properties: {
          id: "alpha",
          Name: "Alpha Drone",
          registration: "SD-BA" + rand5(),
          altitude: 60, yaw: 45, status: "allowed",
          pilot: "Pilot A", organization: "Sager Drone",
        },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [35.98, 31.97] },
        properties: {
          id: "beta",
          Name: "Beta Drone",
          registration: "SD-CA" + rand5(),
          altitude: 55, yaw: 120, status: "denied",
          pilot: "Pilot B", organization: "Sager Drone",
        },
      },
    ];
    enqueueForFlush(get, features);
  },
}));
