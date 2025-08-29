export default function DroneCard({
  model,
  serial,
  reg,
  pilot,
  org,
  status,
  selected = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={selected}
      className={[
        "w-full text-left px-6 py-4 border-b border-[#252525] transition-colors",
        "hover:bg-[#252525] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
        selected ? "ring-2 ring-red-500 bg-[#202020]" : "",
      ].join(" ")}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white truncate max-w-[60%]" title={model}>
          {model || "Drone"}
        </h3>
        <div className="flex items-center shrink-0">
          <span
            className={`h-3 w-3 rounded-full mr-2 ${
              status === "allowed" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs font-medium text-gray-400">
            {(status || "").toUpperCase()}
          </span>
        </div>
      </div>

      {serial ? (
        <p className="text-xs text-gray-400 mt-2 truncate" title={serial}>
          Serial #: <span className="text-gray-300">{serial}</span>
        </p>
      ) : null}

      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-gray-400">Registration #:</span>
        <span className="text-white truncate max-w-[55%]" title={reg}>
          {reg || "—"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-gray-400">Pilot:</span>
        <span className="text-white truncate max-w-[55%]" title={pilot}>
          {pilot || "—"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-gray-400">Organization:</span>
        <span className="text-white truncate max-w-[55%]" title={org}>
          {org || "—"}
        </span>
      </div>
    </button>
  );
}
