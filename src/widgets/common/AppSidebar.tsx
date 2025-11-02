"use client"

import {ChartLine, Gamepad2, Upload, User, Settings, Users, Shield, type LucideIcon} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/widgets/common/Sidebar"
import {useUserStore} from "@/shared/hooks/use-user-store";
import {useUserInfo} from "@/app/features/auth/hooks/use-user-info";
import {Separator} from "@/widgets/common/Separator";
import { UserRole } from '@/entities/user-role';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiredRole?: UserRole[];
}

const baseItems: MenuItem[] = [
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
  {
    title: "My",
    url: "/my",
    icon: User,
  }
];

const adminItems: MenuItem[] = [
  {
      title: "All Users",
    url: "/users",
    icon: Settings,
    requiredRole: ["ADMIN"],
  },
  {
    title: "All Teams",
    url: "/teams",
    icon: Users,
    requiredRole: ["ADMIN"],
  },
];

const coachItems: MenuItem[] = [
  {
    title: "Team Management",
    url: "/my-team",
    icon: Users,
    requiredRole: ["ADMIN", "COACH"],
  },
];

export function AppSidebar() {
  const { user } = useUserStore();
  const { hasRole } = useUserInfo();

  const hasAdminAccess = hasRole(['ADMIN']);
  const hasCoachAccess = hasRole(['COACH']);

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
        {!hasCoachAccess && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseItems.map((item) => (
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
        )}

        {/* 관리자 메뉴 */}
        {hasAdminAccess && (
          <SidebarGroup>
            <SidebarGroupLabel>관리자</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
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
        )}

        {/* 코치 메뉴 */}
        {hasCoachAccess && (
          <SidebarGroup>
            <SidebarGroupLabel>코치</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {coachItems.map((item) => (
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
        )}
      </SidebarContent>
    </Sidebar>
  )
}