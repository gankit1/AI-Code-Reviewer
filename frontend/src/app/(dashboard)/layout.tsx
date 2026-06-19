"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  GitFork,
  GitPullRequest,
  FileSearch,
  BarChart3,
  Settings,
  Code2,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  LogOut,
  User,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Repositories", href: "/repositories", icon: GitFork },
  { label: "Pull Requests", href: "/pull-requests", icon: GitPullRequest },
  { label: "Reviews", href: "/reviews", icon: FileSearch },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        const link = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 shrink-0",
                isActive && "text-primary"
              )}
            />
            {!collapsed && <span>{item.label}</span>}
            {isActive && !collapsed && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Link>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        }

        return link;
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-sidebar sidebar-transition fixed inset-y-0 z-30",
          sidebarCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <div className="h-8 w-8 rounded-lg animated-gradient flex items-center justify-center shrink-0">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight">
              CodeLens <span className="gradient-text">AI</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <SidebarNav collapsed={sidebarCollapsed} />

        {/* Bottom controls */}
        <div className="border-t p-3 space-y-2">
          <Tooltip>
            <TooltipTrigger render={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={toggleSidebarCollapsed}
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <>
                    <PanelLeftClose className="h-5 w-5" />
                    <span>Collapse</span>
                  </>
                )}
              </Button>
            } />
            {sidebarCollapsed && (
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-[margin] duration-300",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 border-b bg-background/80 backdrop-blur-lg flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              } />
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 px-4 border-b">
                  <div className="h-8 w-8 rounded-lg animated-gradient flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">
                    CodeLens <span className="gradient-text">AI</span>
                  </span>
                </div>
                <SidebarNav collapsed={false} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary pulse-glow" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button
                  variant="ghost"
                  className="gap-2 h-9 px-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xs">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col items-start text-left ml-1 hidden md:block">
                      <span className="text-sm font-medium leading-none">{user?.name}</span>
                    </div>
                  )}
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={
                  <Link href="/settings/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                } />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
