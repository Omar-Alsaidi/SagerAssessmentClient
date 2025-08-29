import React from "react";

function StatCard({ icon: Icon, iconClass, label, value }) {
  return (
    <div className="bg-[#1a1a1a] p-3 md:p-4 rounded-xl shadow flex items-center gap-3 md:gap-4">
      {Icon ? <Icon size={24} className={iconClass} /> : null}
      <div>
        <p className="text-gray-400 text-xs md:text-sm">{label}</p>
        <p className="text-lg md:text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default React.memo(StatCard);
