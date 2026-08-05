"use client";

import DashboardBreadcrumb from "./_components/bread-crumb";
import { BreadcrumbProvider } from "./_components/bread-crumb/breadcrumb-context";
import DashboardSidebar from "./_components/sidebar";
import MobileHeader from "./_components/mobile-header";
import MobileBottomNav from "./_components/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BreadcrumbProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <DashboardSidebar />
        </aside>

        <main className="flex flex-col flex-1 min-w-0">
          {/* Mobile top bar: logo + avatar/menu (design uses a bottom nav
              instead of an off-canvas sidebar on mobile) */}
          <MobileHeader />

          <div>
            <DashboardBreadcrumb />
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex-1 overflow-x-auto pb-24 lg:pb-3">
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl">{children}</div>
          </div>

          {/* Mobile bottom nav */}
          <MobileBottomNav />
        </main>
      </div>
    </BreadcrumbProvider>
  );
}
