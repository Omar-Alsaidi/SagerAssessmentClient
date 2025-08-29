import { Outlet } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-black">
      {/* Top header */}
      <HeaderBar />

      {/* Body: content left, sidebar right */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="shrink-0">
          <Sidebar />
        </aside>
        
        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>

        
      </div>
    </div>
  );
}
