import { NavLink } from "react-router-dom";
import { GrMap } from "react-icons/gr";

export default function Sidebar() {
  return (
    <aside className="w-24 bg-black border-l border-[#252525] flex flex-col items-center py-4">
      <nav className="flex flex-col items-center w-full">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `w-full h-20 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-500/20
             border-l-5 ${
               isActive
                 ? "text-white bg-gray-500/20 border-l-red-600"
                 : "text-gray-400 hover:text-white hover:bg-gray-500/20 border-l-transparent"
             }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="grid place-items-center h-10 w-10">
                <img
                  src="/dashboard.svg"
                  alt="dashboard"
                  className={` ${
                    // Force pure white when active; otherwise keep original colors
                    isActive ? "invert brightness-0" : ""
                  }`}
                  draggable="false"
                />
              </div>
              <span className="text-[11px] tracking-wide">DASHBOARD</span>
            </>
          )}
        </NavLink>

        <hr className="w-10 border-gray-700 my-2" />

        {/* Map */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `w-full h-20 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-500/20
     border-l-5 ${
       isActive
         ? "text-white bg-gray-500/20 border-l-red-600"
         : "text-gray-400 hover:text-white border-l-transparent"
     }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="grid place-items-center h-10 w-10">
                <img
                  src="/location-svgrepo-com-2.svg"
                  alt="map"
                  className={`${
                    isActive ? "invert brightness-0" : "invert brightness-50"
                  }`}
                  draggable="false"
                />
              </div>
              <span className="text-[11px] tracking-wide">MAP</span>
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
