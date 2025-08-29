import MapGL, { Source, Layer, Popup, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useDroneStore } from "../store/useDroneStore";
import { PiDrone } from "react-icons/pi";
import useThrottle from "../shared/hooks/useThrottle";
import { bearing } from "../shared/lib/geo";



/* Marker */
const DroneMarker = ({ drone, selected, heading, onClick, onHover, onLeave }) => {
  const isAllowed = drone.status === "allowed";
  const size = selected ? 36 : 28;
  const iconSize = selected ? 20 : 16;

  return (
    <Marker longitude={drone.coords[0]} latitude={drone.coords[1]} anchor="center">
      <div
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onTouchStart={onHover} // Added touch support for mobile
        style={{
          transform: `rotate(${heading}deg)`,
          width: `${size}px`,
          height: `${size}px`,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: `${size - 6}px`,
            height: `${size - 6}px`,
            borderRadius: '50%',
            backgroundColor: isAllowed ? "#22c55e" : "#ef4444",
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <PiDrone size={iconSize} color="white" style={{ zIndex: 3 }} />
        </div>
        {/* Direction arrow */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '10px solid #3b82f6',
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
            zIndex: 4
          }}
        />
      </div>
    </Marker>
  );
};

export default function MapSection() {
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const setSelectedDroneId = useDroneStore((s) => s.setSelectedDroneId);
  const drones = useDroneStore((s) => s.drones);
  const trails = useDroneStore((s) => s.trails);

  // local hover state for popup
  const [hoverDroneId, setHoverDroneId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Throttle state
  const throttledDrones = useThrottle(drones, 100);
  const throttledTrails = useThrottle(trails, 250);

  const [viewState, setViewState] = useState({
    longitude: 35.930359,
    latitude: 31.963158,
    zoom: 9,
  });

  const mapRef = useRef(null);
  const zoomIn = useCallback(() => setViewState((v) => ({ ...v, zoom: v.zoom + 0.5 })), []);
  const zoomOut = useCallback(() => setViewState((v) => ({ ...v, zoom: Math.max(1, v.zoom - 0.5) })), []);

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build markers
  const droneMarkers = useMemo(() => {
    return Object.values(throttledDrones).map((drone) => {
      const trail = throttledTrails[drone.id] || [];
      const heading =
        trail.length >= 2
          ? bearing(trail[trail.length - 2], trail[trail.length - 1])
          : (drone.yaw || 0);

      return (
        <DroneMarker
          key={drone.id}
          drone={drone}
          selected={drone.id === selectedDroneId}
          heading={heading}
          onClick={() => {
            setSelectedDroneId(drone.id);
            if (isMobile) {
              // On mobile, clear hover state when selecting
              setHoverDroneId(null);
            }
          }}
          onHover={() => !isMobile && setHoverDroneId(drone.id)} // Only hover on desktop
          onLeave={() => !isMobile && setHoverDroneId((curr) => (curr === drone.id ? null : curr))}
        />
      );
    });
  }, [throttledDrones, throttledTrails, selectedDroneId, setSelectedDroneId, isMobile]);

  // Trails layer
  const trailFeatures = useMemo(() => {
    return Object.entries(throttledTrails)
      .filter(([, coords]) => coords.length > 1)
      .map(([id, coords]) => {
        const drone = throttledDrones[id];
        return {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: { id, status: drone?.status || 'denied' }
        };
      });
  }, [throttledTrails, throttledDrones]);

  // Fly to selected drone
  useEffect(() => {
    if (!selectedDroneId) return;
    const d = drones[selectedDroneId];
    if (!d || !Array.isArray(d.coords)) return;
    const [lng, lat] = d.coords;
    if (mapRef.current?.flyTo) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: viewState.zoom, duration: 800, essential: true });
    }
  }, [selectedDroneId, drones, viewState.zoom]);

  // 👇 NEW: popup follows hover if any, otherwise the selected drone (panel click)
  const popupDrone = useMemo(() => {
    // On mobile, only show popup for selected drone, not hover
    if (isMobile) {
      if (selectedDroneId && drones[selectedDroneId]) return drones[selectedDroneId];
      return null;
    }
    
    if (hoverDroneId && drones[hoverDroneId]) return drones[hoverDroneId];
    if (selectedDroneId && drones[selectedDroneId]) return drones[selectedDroneId];
    return null;
  }, [hoverDroneId, selectedDroneId, drones, isMobile]);

  const redCount = useMemo(
    () => Object.values(drones).filter((d) => d?.status === "denied").length,
    [drones]
  );

  return (
    <div className="flex-1 relative min-h-[300px] md:min-h-[400px]">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        touchZoomRotate={true}
        doubleClickZoom={true}
      >
        {/* Trails */}
        <Source id="trails-source" type="geojson" data={{ type: 'FeatureCollection', features: trailFeatures }}>
          <Layer
            id="trails-layer"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": [
                "case",
                ["==", ["get", "status"], "allowed"],
                "#22c55e",
                "#ef4444"
              ],
              "line-width": isMobile ? 1.5 : 2, // Thinner lines on mobile
              "line-opacity": 0.7
            }}
          />
        </Source>

        {/* Markers */}
        {droneMarkers}

        {/* Popup: hover > selected */}
        {popupDrone && Array.isArray(popupDrone.coords) && (
          <Popup
            longitude={popupDrone.coords[0]}
            latitude={popupDrone.coords[1]}
            closeButton={!isMobile} // Hide close button on mobile
            closeOnClick={false}
            anchor="top"
            className="custom-popup"
          >
            <div className="text-gray-900 p-2">
              <p className="font-bold text-base md:text-lg">{popupDrone.model}</p>
              <div className="flex justify-between mt-1">
                <span className="text-xs md:text-sm">Altitude:</span>
                <span className="font-medium text-xs md:text-sm">{popupDrone.altitude}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs md:text-sm">Yaw:</span>
                <span className="font-medium text-xs md:text-sm">
                  {typeof popupDrone.yaw === "number" ? popupDrone.yaw : 0}°
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs md:text-sm">Status:</span>
                <span className={`font-medium text-xs md:text-sm ${popupDrone.status === "allowed" ? "text-green-600" : "text-red-600"}`}>
                  {popupDrone.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Zoom controls */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-gray-800 rounded-lg p-1 md:p-2 shadow-lg">
        <div className="flex flex-col space-y-1 md:space-y-2">
          <button
            onClick={zoomIn}
            className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-sm md:text-base"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-sm md:text-base"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      {/* Bottom-right counter */}
      <div className="absolute bottom-2 md:bottom-11 right-2 md:right-4 pointer-events-auto">
        <div className="flex items-center gap-1 md:gap-2 bg-white/95 text-gray-900 rounded-full shadow-lg px-2 py-1 md:px-3 md:py-1.5">
          <span
            className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs md:text-sm font-semibold rounded-full"
            style={{ background: "#ef4444", color: "#fff" }}
            aria-label="Denied drones count"
          >
            {redCount}
          </span>
          <span className="text-xs md:text-sm">Drone Flying</span>
        </div>
      </div>

      {/* Mobile instructions */}
      {isMobile && (
        <div className="absolute top-2 left-2 pointer-events-auto bg-black/70 text-white text-xs p-2 rounded">
          Tap drones for details
        </div>
      )}
    </div>
  );
}

