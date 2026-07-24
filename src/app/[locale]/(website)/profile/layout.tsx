import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountSidebar } from "./_components/account-sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex-col lg:flex-row">
      <AccountSidebar />
      <main className="w-full px-4 sm:px-8 lg:px-0 pb-10">{children}</main>
    </SidebarProvider>
  );
}
