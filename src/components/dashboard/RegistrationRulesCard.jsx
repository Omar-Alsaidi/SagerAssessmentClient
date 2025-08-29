import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

function RegistrationRulesCard() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl shadow">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Registration Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-500" size={16} />
            <span className="font-medium">Allowed Drones:</span>
          </div>
          <p className="text-gray-400 ml-5 md:ml-6">
            Registration starts with <code className="bg-gray-800 px-1 rounded">SD-B</code>
            <br />
            Example: <code className="bg-gray-800 px-1 rounded">SD-BC12345</code>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiXCircle className="text-red-500" size={16} />
            <span className="font-medium">Denied Drones:</span>
          </div>
          <p className="text-gray-400 ml-5 md:ml-6">
            Registration starts with <code className="bg-gray-800 px-1 rounded">SD-</code> (not B)
            <br />
            Example: <code className="bg-gray-800 px-1 rounded">SD-CA67890</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RegistrationRulesCard);
