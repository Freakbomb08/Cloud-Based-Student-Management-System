import { Outlet, useLocation } from "react-router-dom";
import { PortalSidebar } from "./PortalSidebar";
import { MobileTabBar } from "./MobileTabBar";

export function PortalLayout() {
  const { pathname } = useLocation();
  // Chat manages its own full-height layout — skip bottom padding offset for it
  const isChat = pathname.startsWith("/chat");
  return (
    <div className="min-h-screen flex bg-background">
      <PortalSidebar />
      <main className={`flex-1 min-w-0 ${isChat ? "" : "pb-24 lg:pb-0"}`}>
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  );
}
