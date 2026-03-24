import { prisma } from "@/lib/prisma";

export async function getItemTypesWithCounts() {
  const types = await prisma.itemType.findMany({
    include: {
      _count: { select: { items: true } },
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

export async function getSidebarCollections() {
  const collections = await prisma.collection.findMany({
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
    const typeCounts = new Map<string, { count: number; color: string }>();
    for (const type of itemTypes) {
      const existing = typeCounts.get(type.slug);
      typeCounts.set(type.slug, {
        count: (existing?.count ?? 0) + 1,
        color: type.color,
      });
    }

    let dominantColor = "";
    let maxCount = 0;
    for (const [, { count, color }] of typeCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      isFavorite: collection.isFavorite,
      dominantColor,
    };
  });
}

export type SidebarCollection = Awaited<
  ReturnType<typeof getSidebarCollections>
>[number];
