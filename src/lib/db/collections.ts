import { prisma } from "@/lib/prisma";

export async function getAllCollections() {
  const collections = await prisma.collection.findMany({
    include: {
      items: {
        include: {
          item: {
            include: {
              type: true,
            },
          },
        },
      },
    },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });

  return collections.map((collection) => {
    const itemTypes = collection.items.map((ci) => ci.item.type);
    const typeCounts = new Map<string, number>();
    for (const type of itemTypes) {
      typeCounts.set(type.slug, (typeCounts.get(type.slug) ?? 0) + 1);
    }

    const uniqueTypes = [
      ...new Map(itemTypes.map((t) => [t.slug, t])).values(),
    ];

    let dominantColor = "";
    let maxCount = 0;
    for (const [slug, count] of typeCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor =
          uniqueTypes.find((t) => t.slug === slug)?.color ?? "";
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      dominantColor,
      types: uniqueTypes.map((t) => ({
        slug: t.slug,
        icon: t.icon,
        color: t.color,
      })),
    };
  });
}

export async function getCollectionStats() {
  const [totalCollections, favoriteCollections] = await Promise.all([
    prisma.collection.count(),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);

  return { totalCollections, favoriteCollections };
}

export async function getItemStats() {
  const [totalItems, favoriteItems] = await Promise.all([
    prisma.item.count(),
    prisma.item.count({ where: { isFavorite: true } }),
  ]);

  return { totalItems, favoriteItems };
}
