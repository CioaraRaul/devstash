"use client";

import { useState } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarContent } from "@/components/dashboard/sidebar/SidebarContent";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { DashboardShellProps } from "@/types/dashboard";

export function DashboardShell({ children, itemTypes, collections, user }: DashboardShellProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-full flex-col">
      <TopBar onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent itemTypes={itemTypes} collections={collections} user={user} />
            </SheetContent>
          </Sheet>
        ) : (
          sidebarOpen && (
            <aside className="w-64 shrink-0 border-r border-border bg-sidebar">
              <SidebarContent itemTypes={itemTypes} collections={collections} user={user} />
            </aside>
          )
        )}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
