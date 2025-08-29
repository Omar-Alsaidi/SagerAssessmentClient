// Shared time helpers
export const now = () => Date.now();
export const fmtDur = (ms) => {
  if (!Number.isFinite(ms) || ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
export const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
