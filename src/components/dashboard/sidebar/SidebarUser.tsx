import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";

export function SidebarUser() {
  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-sidebar-foreground">
            {mockUser.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {mockUser.email}
          </span>
        </div>
      </div>
    </div>
  );
}
