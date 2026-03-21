"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SidebarNav";
import { SidebarTypes } from "./SidebarTypes";
import { SidebarCollections } from "./SidebarCollections";
import { SidebarUser } from "./SidebarUser";

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
        <Separator className="mb-4" />
        <SidebarTypes />
        <Separator className="mb-4" />
        <SidebarCollections />
      </div>
      <SidebarUser />
    </div>
  );
}
