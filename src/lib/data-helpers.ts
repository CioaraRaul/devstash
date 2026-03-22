import { mockItems, mockCollections, mockItemTypes } from "@/lib/mock-data";

export function getItemCountByType(slug: string): number {
  return mockItems.filter((item) => item.typeSlug === slug).length;
}

export function getFavoriteCollections() {
  return mockCollections.filter((c) => c.isFavorite);
}

export function getRecentCollections(limit = 3) {
  return mockCollections.filter((c) => !c.isFavorite).slice(0, limit);
}

export function getAllCollections() {
  return mockCollections;
}

export function getPinnedItems() {
  return mockItems.filter((item) => item.isPinned);
}

export function getRecentItems(limit = 10) {
  return [...mockItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getItemTypeBySlug(slug: string) {
  return mockItemTypes.find((t) => t.slug === slug);
}

export function getCollectionItemTypeSlugs(collectionId: string): string[] {
  const collection = mockCollections.find((c) => c.id === collectionId);
  if (!collection) return [];
  const items = mockItems.filter((item) => collection.itemIds.includes(item.id));
  return [...new Set(items.map((item) => item.typeSlug))];
}

export function getStats() {
  return {
    totalItems: mockItems.length,
    totalCollections: mockCollections.length,
    favoriteItems: mockItems.filter((item) => item.isFavorite).length,
    favoriteCollections: mockCollections.filter((c) => c.isFavorite).length,
  };
}
