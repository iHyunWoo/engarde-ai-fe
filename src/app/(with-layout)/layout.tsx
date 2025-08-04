import {ReactNode} from "react";
import {SidebarProvider, SidebarTrigger} from "@/widgets/common/Sidebar";
import {AppSidebar} from "@/widgets/common/AppSidebar";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>

  );
}
