export function nextCoords(prevCoords, coords, canMove) {
  return canMove ? coords : (prevCoords || coords);
}
export function nextYaw(prevYaw, yaw, canMove) {
  if (canMove) return (typeof yaw === "number" ? yaw : prevYaw);
  if (typeof prevYaw === "number") return prevYaw;
  return (typeof yaw === "number" ? yaw : prevYaw);
}
export function nextAltitude(prevAlt, rawAlt, canMove) {
  const formatted = rawAlt != null ? `${rawAlt} m` : "";
  if (canMove) return formatted || (prevAlt || "");
  return prevAlt ?? formatted;
}
