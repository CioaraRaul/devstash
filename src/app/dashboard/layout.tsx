import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  getItemTypesWithCounts,
  getSidebarCollections,
} from "@/lib/db/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [itemTypes, collections] = await Promise.all([
    getItemTypesWithCounts(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell itemTypes={itemTypes} collections={collections}>
      {children}
    </DashboardShell>
  );
}
