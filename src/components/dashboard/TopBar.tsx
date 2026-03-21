"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
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
