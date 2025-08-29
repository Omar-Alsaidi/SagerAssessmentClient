import DronePanel from "../components/DronePanel";
import MapSection from "../components/MapSection";

export default function Map() {
  return (
    <div className="flex flex-1">
      <DronePanel />
      <MapSection />
    </div>
  );
}
