import { useMemo } from "react";
import { useDroneStore } from "../../store/useDroneStore";

export default function useDashboardStats() {
  const drones = useDroneStore((s) => s.drones);
  const flights = useDroneStore((s) => s.flights);

  const dronesArr = useMemo(() => Object.values(drones), [drones]);

  const activeDrones = dronesArr.length;
  const allowedDrones = useMemo(
    () => dronesArr.filter((d) => d?.status === "allowed").length,
    [dronesArr]
  );
  const deniedDrones = useMemo(
    () => dronesArr.filter((d) => d?.status === "denied").length,
    [dronesArr]
  );
  const totalFlights = useMemo(
    () =>
      Object.values(flights).reduce(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      ),
    [flights]
  );

  const allowedPct = activeDrones ? Math.round((allowedDrones / activeDrones) * 100) : 0;
  const deniedPct = activeDrones ? Math.round((deniedDrones / activeDrones) * 100) : 0;

  return {
    activeDrones,
    allowedDrones,
    deniedDrones,
    totalFlights,
    allowedPct,
    deniedPct,
  };
}
