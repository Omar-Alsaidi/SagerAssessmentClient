// Identity & registration helpers
export const rand5 = () => String(Math.floor(Math.random() * 100000)).padStart(5, "0");
export function ensureSdRegWith5Digits(regRaw) {
  if (!regRaw) return null;
  const reg = String(regRaw).trim();
  if (/^SD-[A-Za-z]+[0-9]{5}$/.test(reg)) return reg;
  const m1 = /^SD-([A-Za-z]+)/.exec(reg);
  const letters = m1?.[1] || (reg.match(/[A-Za-z]+/g)?.join("").slice(0, 3) ?? "BC");
  return `SD-${letters}${rand5()}`;
}
// allowed iff letters after SD- start with B/b
export function statusFromRegistration(reg) {
  if (!reg) return "denied";
  const letters = /^SD-([A-Za-z]+)/.exec(String(reg))?.[1] ?? "";
  return letters && letters[0].toUpperCase() === "B" ? "allowed" : "denied";
}
export function randomRegistrationByAllowed(allowed) {
  const firstLetter = allowed ? "B" : "ACDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 25)];
  const secondLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `SD-${firstLetter}${secondLetter}`;
}

export function randomSerial(number) {
  const characters = 'ABCD';
  let result = '';

  for (let i = 0; i < number; i++) {
    result += characters.charAt(Math.floor(Math.random() * 4));
  }

  return result;
}