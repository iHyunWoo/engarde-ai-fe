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
      <main className="w-full h-full">
        <SidebarTrigger className="w-8 h-8 m-4"/>
        {children}
      </main>
    </SidebarProvider>

  );
}
