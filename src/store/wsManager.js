import { io } from "socket.io-client";
import { getWsUrl } from "./net";
import { enqueueForFlush } from "./batch";
import { safeParse } from "../shared/lib/time";
import { ensureSdRegWith5Digits, statusFromRegistration } from "../shared/lib/identity";

const perDroneSockets = new Map();
let connectedCount = 0;

export function openSocketForIdentity(get, set, meta, url = getWsUrl()) {
  const key = meta.registration || meta.serial || meta.name;
  if (!key || perDroneSockets.has(key)) return;

  const sock = io(url, {
    path: "/socket.io",
    transports: ["polling"],
    upgrade: false,
  });

  sock.on("connect", () => {
    connectedCount++;
    set({ wsState: "connected" });
  });

  sock.on("disconnect", () => {
    connectedCount = Math.max(0, connectedCount - 1);
    if (connectedCount === 0) set({ wsState: "disconnected" });
  });

  sock.on("message", (payload) => {
    const data = typeof payload === "string" ? safeParse(payload) : payload;
    const f = data?.features?.[0] || (data?.type === "Feature" ? data : null);
    const coords = f?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return;

    const altitude = f?.properties?.altitude ?? Math.floor(Math.random() * 100);
    const yaw = f?.properties?.yaw ?? (120 + Math.floor(Math.random() * 20));

    const registration = ensureSdRegWith5Digits(meta.registration);
    const status = statusFromRegistration(registration);

    enqueueForFlush(get, [{
      type: "Feature",
      geometry: { type: "Point", coordinates: coords },
      properties: {
        id: registration,
        Name: meta.name || "Dji Mavic",
        serial: meta.serial,
        registration,
        pilot: meta.pilot || "Pilot",
        organization: meta.organization || "Sager Drone",
        altitude,
        yaw,
        status,
      },
    }]);
  });

  perDroneSockets.set(key, sock);
}

export function clearAllSockets() {
  for (const [, sock] of perDroneSockets) sock.close();
  perDroneSockets.clear();
  connectedCount = 0;
}
