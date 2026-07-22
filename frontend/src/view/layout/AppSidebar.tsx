import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, LogOut, Bot, User } from "lucide-react";
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
} from "@/components/ui/sidebar";
import Context from "@/context/context";
import useLogout from "@/hooks/useLogout";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge-base",
    icon: Database,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const logout = useLogout();
  const {
    userProfileState: { profileDetails },
    organisationState: { organisationDetails },
  } = useContext(Context);

  return (
    <Sidebar className="border-r border-white/10 bg-card/60 backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-md shadow-purple-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-foreground">
              {organisationDetails?.name || "Embed Bot"}
            </span>
            <span className="text-[11px] truncate text-muted-foreground">
              {organisationDetails?.website || "AI Assistant"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 font-medium border border-purple-500/20 shadow-sm"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <Icon
                          className={`h-4 w-4 ${isActive ? "text-purple-400" : ""}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-3">
        <div className="flex flex-col gap-2">
          {profileDetails && (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                {profileDetails.name ? (
                  profileDetails.name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium truncate text-foreground">
                  {profileDetails.name}
                </span>
                <span className="text-[10px] truncate text-muted-foreground">
                  {profileDetails.email}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs font-medium text-red-400/90 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
