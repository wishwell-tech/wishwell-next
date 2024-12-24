"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, Gift, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Home",
    href: "/p/home",
    icon: Home,
  },
  {
    title: "Events",
    href: "/p/events",
    icon: Calendar,
  },
  {
    title: "Wishes",
    href: "/p/wishes",
    icon: Gift,
  },
  {
    title: "Profile",
    href: "/p/profile",
    icon: User,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar for tablet and up */}
      <div className="hidden md:block">
        <Sidebar>
          <SidebarHeader>
            Wishwell    
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 border-t bg-background z-50">
        <nav className="flex justify-around p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
