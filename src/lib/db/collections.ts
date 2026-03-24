import { prisma } from "@/lib/prisma";
import { computeDominantColor } from "./utils";

export async function getAllCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
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
    const uniqueTypes = [
      ...new Map(itemTypes.map((t) => [t.slug, t])).values(),
    ];

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      dominantColor: computeDominantColor(itemTypes),
      types: uniqueTypes.map((t) => ({
        slug: t.slug,
        icon: t.icon,
        color: t.color,
      })),
    };
  });
}

export async function getCollectionStats(userId: string) {
  const [totalCollections, favoriteCollections] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { totalCollections, favoriteCollections };
}

export async function getItemStats(userId: string) {
  const [totalItems, favoriteItems] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { totalItems, favoriteItems };
}
