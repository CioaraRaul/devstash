"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SidebarNav";
import { SidebarTypes } from "./SidebarTypes";
import { SidebarCollections } from "./SidebarCollections";
import { SidebarUser } from "./SidebarUser";
import type { SidebarContentProps } from "@/types/dashboard";

export function SidebarContent({ itemTypes, collections, user }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
        <Separator className="mb-4" />
        <SidebarTypes itemTypes={itemTypes} />
        <Separator className="mb-4" />
        <SidebarCollections collections={collections} />
      </div>
      <SidebarUser user={user} />
    </div>
  );
}
