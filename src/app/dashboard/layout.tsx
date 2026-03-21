"use client";

import { useState, useCallback } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarContent } from "@/components/dashboard/sidebar/SidebarContent";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <TopBar onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          sidebarOpen && (
            <aside className="w-64 shrink-0 border-r border-border bg-sidebar">
              <SidebarContent />
            </aside>
          )
        )}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
