import { useState, useMemo, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import DroneCard from "./DroneCard";
import { useDroneStore } from "../store/useDroneStore";
import { fmtDur } from "../shared/lib/time";



export default function DronePanel() {
  const [activeTab, setActiveTab] = useState("drones");
  const [collapsed, setCollapsed] = useState(false);

  const drones = useDroneStore((s) => s.drones);
  const flights = useDroneStore((s) => s.flights);
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const setSelectedDroneId = useDroneStore((s) => s.setSelectedDroneId);

  // Re-render every second so ongoing durations update
  const [tick, setTick] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const droneList = useMemo(() => Object.values(drones), [drones]);

  const flatHistory = useMemo(() => {
    const rows = [];
    for (const id of Object.keys(flights)) {
      for (const f of flights[id] || []) {
        const startedAt = f.startedAt;
        const endedAt = f.endedAt;
        const durationMs = (endedAt ? endedAt : tick) - startedAt;
        rows.push({
          droneId: id,
          model: drones[id]?.model || "Drone",
          statusAtStart: f.statusAtStart,
          startedAt,
          endedAt,
          durationMs,
          distanceKm: f.distanceKm || 0,
        });
      }
    }
    return rows.sort((a, b) => (b.endedAt || 0) - (a.endedAt || 0));
  }, [flights, drones, tick]);

  // Auto-scroll the selected card into view (skip when collapsed)
  const listRef = useRef(null);
  useEffect(() => {
    if (!selectedDroneId || !listRef.current || collapsed) return;
    const el = listRef.current.querySelector(
      `[data-drone-id="${CSS.escape(selectedDroneId)}"]`
    );
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedDroneId, collapsed]);

  return (
    <div
      className={`bg-[#1A1A1A] border-l border-[#252525] flex flex-col h-[93vh] mt-2 ml-3 overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? "w-12" : "w-72"}`}
      style={{ willChange: "width" }}
      data-collapsed={collapsed}
    >
      {/* Header */}
      <div
        className={`flex items-center py-4 border-b border-[#252525] ${
          collapsed ? "justify-center px-0" : "justify-between px-6"
        }`}
      >
        {!collapsed && <h2 className="text-lg font-bold">DRONE FLYING</h2>}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#252525] transition-colors"
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <FiX
            size={20}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Tabs */}
      {!collapsed && (
        <div className="flex border-b border-[#252525] transition-opacity duration-300">
          <button
            onClick={() => setActiveTab("drones")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "drones"
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400"
            }`}
          >
            Drones
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "history"
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400"
            }`}
          >
            Flights History
          </button>
        </div>
      )}

      {/* Body */}
      {!collapsed && (
        <div className="overflow-y-auto flex-1 transition-opacity duration-300" ref={listRef}>
          {activeTab === "drones" && (
            <div className="p-3 space-y-3">
              {droneList.length ? (
                droneList.map((d) => {
                  const isSelected = d.id === selectedDroneId;
                  return (
                    <div key={d.id} data-drone-id={d.id}>
                      <DroneCard
                        model={d.model}
                        serial={d.serial}
                        reg={d.registration}
                        pilot={d.pilot}
                        org={d.organization}
                        status={d.status}
                        selected={isSelected}
                        onClick={() => setSelectedDroneId(isSelected ? null : d.id)}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <div className="mb-4 text-4xl">🛰️</div>
                  <p>No drones yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-3 space-y-3 text-sm">
              {flatHistory.length ? (
                flatHistory.map((h, i) => (
                  <div
                    key={`${h.droneId}-${i}`}
                    className="rounded-lg bg-[#111] border border-[#252525] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{h.model}</div>
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            h.statusAtStart === "allowed" ? "#22c55e" : "#ef4444",
                        }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-gray-300">
                      <div>Start</div>
                      <div className="text-right">
                        {new Date(h.startedAt).toLocaleString()}
                      </div>
                      <div>End</div>
                      <div className="text-right">
                        {h.endedAt ? new Date(h.endedAt).toLocaleString() : "-"}
                      </div>
                      <div>Duration</div>
                      <div className="text-right">{fmtDur(h.durationMs)}</div>
                      <div>Distance</div>
                      <div className="text-right">
                        {h.distanceKm.toFixed(2)} km
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <div className="mb-4 text-4xl">📊</div>
                  <p>No flight history yet.</p>
                  <p className="mt-2">
                    Flight records will appear here after drone operations.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
