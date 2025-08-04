"use client"

import {ChartLine, Gamepad2, Upload} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/widgets/common/Sidebar"
import {useUserStore} from "@/shared/hooks/use-user-store";
import {Separator} from "@/widgets/common/Separator";

const items = [
  {
    title: "Matches",
    url: "/matches",
    icon: Gamepad2,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: ChartLine,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: Upload,
  },
]

export function AppSidebar() {
  const { user } = useUserStore()
  return (
    <Sidebar>
      <SidebarHeader>
        {user && (
          <p className="font-bold text-xl">{user.name}</p>
        )}
        {!user && (
          <p className="font-bold text-base">Login is required.</p>
        )}
      </SidebarHeader>
      <Separator/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}