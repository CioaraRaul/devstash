import { prisma } from "@/lib/prisma";

export async function getPinnedItems(userId: string) {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return items.map(formatItem);
}

export async function getRecentItems(userId: string, limit = 10) {
  const items = await prisma.item.findMany({
    where: { userId },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return items.map(formatItem);
}

type ItemWithRelations = Awaited<
  ReturnType<typeof prisma.item.findMany<{
    include: { type: true; tags: { include: { tag: true } } };
  }>>
>[number];

function formatItem(item: ItemWithRelations) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.url,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
    typeSlug: item.type.slug,
    typeIcon: item.type.icon,
    typeColor: item.type.color,
    tags: item.tags.map((t) => t.tag.name),
  };
}

export type DashboardItem = ReturnType<typeof formatItem>;
