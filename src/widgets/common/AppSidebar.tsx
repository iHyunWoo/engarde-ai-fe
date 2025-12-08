"use client"

import {ChartLine, Gamepad2, Upload, User, Settings, Users, Shield, LogOut, type LucideIcon} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/widgets/common/Sidebar"
import {useUserStore} from "@/shared/hooks/use-user-store";
import {useUserInfo} from "@/app/features/auth/hooks/use-user-info";
import {useLogout} from "@/app/features/auth/hooks/use-logout";
import {Separator} from "@/widgets/common/Separator";
import {Skeleton} from "@/widgets/common/Skeleton";
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
  const { hasRole, loading } = useUserInfo();
  const { mutate: handleLogout, isPending } = useLogout();

  const hasAdminAccess = hasRole(['ADMIN']);
  const hasCoachAccess = hasRole(['COACH']);

  if (loading) {
    return (
      <Sidebar>
        <SidebarHeader>
          <Skeleton className="h-7 w-32" />
        </SidebarHeader>
        <Separator/>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {baseItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

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
      {user && (
        <SidebarFooter>
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleLogout()} 
                disabled={isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isPending ? 'Logging out...' : 'Logout'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}