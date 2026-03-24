import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  getCurrentUser,
  getItemTypesWithCounts,
  getSidebarCollections,
} from "@/lib/db/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const [itemTypes, collections] = await Promise.all([
    getItemTypesWithCounts(user.id),
    getSidebarCollections(user.id),
  ]);

  return (
    <DashboardShell itemTypes={itemTypes} collections={collections} user={user}>
      {children}
    </DashboardShell>
  );
}
