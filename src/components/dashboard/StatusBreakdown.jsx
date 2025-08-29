import React, { useMemo } from "react";

function Bar({ color, pct }) {
  const width = Math.max(0, Math.min(100, pct));
  return (
    <div className="w-12 md:w-16 bg-gray-700 rounded-full h-2">
      <div className={color + " h-2 rounded-full"} style={{ width: `${width}%` }} />
    </div>
  );
}

function Row({ label, value, color, pct }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300 text-sm md:text-base">{label}</span>
      <div className="flex items-center gap-2">
        <span className={color.replace("bg-", "text-") + " font-semibold text-sm md:text-base"}>
          {value}
        </span>
        <Bar color={color} pct={pct} />
      </div>
    </div>
  );
}

function StatusBreakdown({ active, allowed, denied }) {
  const allowedPct = useMemo(() => (active ? (allowed / active) * 100 : 0), [active, allowed]);
  const deniedPct = useMemo(() => (active ? (denied / active) * 100 : 0), [active, denied]);
  const allowedPctText = Math.round(allowedPct);

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl shadow">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Drone Status Breakdown</h2>
      <div className="space-y-3 md:space-y-4">
        <Row label="Allowed Drones" value={allowed} color="bg-green-500" pct={allowedPct} />
        <Row label="Denied Drones" value={denied} color="bg-red-500" pct={deniedPct} />

        {active > 0 && (
          <div className="pt-3 md:pt-4 border-t border-gray-700">
            <p className="text-xs md:text-sm text-gray-400">
              {allowedPctText}% of drones are allowed to fly
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(StatusBreakdown);
