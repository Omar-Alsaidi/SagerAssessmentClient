import { FiActivity, FiCpu, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useDroneStore } from "../store/useDroneStore";
import useDashboardStats from "../shared/hooks/useDashboardStats";
import StatCard from "../components/dashboard/StatCard";
import StatusBreakdown from "../components/dashboard/StatusBreakdown";
import CreateDronesPanel from "../components/dashboard/CreateDronesPanel";
import RegistrationRulesCard from "../components/dashboard/RegistrationRulesCard";

export default function Dashboard() {
  const createRandomDrones = useDroneStore((s) => s.createRandomDrones);
  const { activeDrones, allowedDrones, deniedDrones, totalFlights } =
    useDashboardStats();

  const handleCreate = (count) => {
    createRandomDrones(count, { allowRatio: 0.5 });
  };

  return (
    <div className="h-full p-4 md:p-6 space-y-4 md:space-y-6 bg-[#0f0f0f] text-white overflow-auto">
      <h1 className="text-xl md:text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon={FiActivity} iconClass="text-red-500" label="Active Drones" value={activeDrones} />
        <StatCard icon={FiCheckCircle} iconClass="text-green-500" label="Allowed Drones" value={allowedDrones} />
        <StatCard icon={FiXCircle} iconClass="text-red-500" label="Denied Drones" value={deniedDrones} />
        <StatCard icon={FiCpu} iconClass="text-blue-500" label="Total Flights" value={totalFlights} />
      </div>

      {/* Status Breakdown + Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <StatusBreakdown active={activeDrones} allowed={allowedDrones} denied={deniedDrones} />
        </div>
        <CreateDronesPanel onCreate={handleCreate} />
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <RegistrationRulesCard />
      </div>
    </div>
  );
}
