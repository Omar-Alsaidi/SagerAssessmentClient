import React, { useState, useCallback } from "react";

function QtyButton({ n, onClick }) {
  return (
    <button
      onClick={() => onClick(n)}
      className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-[#111] hover:bg-[#191919] border border-[#2a2a2a] text-xs md:text-sm"
      title={`Add ${n}`}
    >
      +{n}
    </button>
  );
}

function CreateDronesPanel({ onCreate }) {
  const [qty, setQty] = useState(0);
  const addQty = useCallback((n) => setQty((q) => Math.max(0, (Number(q) || 0) + n)), []);

  const handleCreate = useCallback(() => {
    const count = Math.max(0, Number(qty) || 0);
    if (!count) return;
    onCreate?.(count);
    setQty(0);
  }, [qty, onCreate]);

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl shadow">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Create Drones</h2>

      <label className="block text-xs md:text-sm text-gray-300 mb-1">How many?</label>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          min={0}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 outline-none focus:border-[#444] text-sm"
          placeholder="0"
        />
        <button
          onClick={handleCreate}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 md:px-4 py-2 rounded-lg"
        >
          Create
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 10, 100, 1000, 10000].map((n) => (
          <QtyButton key={n} n={n} onClick={addQty} />
        ))}
        <button
          onClick={() => setQty(0)}
          className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-[#0f0f0f] hover:bg-[#191919] border border-[#2a2a2a] text-xs md:text-sm"
          title="Reset to 0"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3 md:mt-4">
        Drones are created with a random allowed/denied mix and appear on the map immediately.
      </p>
    </div>
  );
}

export default React.memo(CreateDronesPanel);
