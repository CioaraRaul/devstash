"use client";

import { Search, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TopBarProps } from "@/types/dashboard";

export function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-sm text-primary-foreground">
          D
        </div>
        <span className="text-lg font-semibold">DevStash</span>
      </div>

      <div className="mx-4 max-w-md flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items, collections, tags..."
            className="pl-9"
          />
        </div>
      </div>

      <Button>New Item</Button>
    </header>
  );
}
