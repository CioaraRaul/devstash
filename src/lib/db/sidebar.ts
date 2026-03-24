import { prisma } from "@/lib/prisma";
import { computeDominantColor } from "./utils";

// TODO: Replace with real session user once auth is wired up
export async function getCurrentUser() {
  const user = await prisma.user.findFirst({
    select: { id: true, name: true, email: true, image: true },
  });

  return user
    ? { id: user.id, name: user.name ?? "User", email: user.email, image: user.image }
    : { id: "", name: "DevStash User", email: "user@devstash.io", image: null };
}

export type SidebarUser = Awaited<ReturnType<typeof getCurrentUser>>;

export async function getItemTypesWithCounts(userId: string) {
  const types = await prisma.itemType.findMany({
    include: {
      _count: { select: { items: { where: { userId } } } },
    },
    orderBy: { slug: "asc" },
  });

  return types.map((type) => ({
    id: type.id,
    slug: type.slug,
    label: type.label,
    icon: type.icon,
    color: type.color,
    count: type._count.items,
  }));
}

export type SidebarItemType = Awaited<
  ReturnType<typeof getItemTypesWithCounts>
>[number];

export async function getSidebarCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: { include: { type: true } },
        },
      },
    },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });

  return collections.map((collection) => {
    const itemTypes = collection.items.map((ci) => ci.item.type);

    return {
      id: collection.id,
      name: collection.name,
      isFavorite: collection.isFavorite,
      dominantColor: computeDominantColor(itemTypes),
    };
  });
}

export type SidebarCollection = Awaited<
  ReturnType<typeof getSidebarCollections>
>[number];
