import { mockItems, mockCollections } from "@/lib/mock-data";

export function getItemCountByType(slug: string): number {
  return mockItems.filter((item) => item.typeSlug === slug).length;
}

export function getFavoriteCollections() {
  return mockCollections.filter((c) => c.isFavorite);
}

export function getRecentCollections(limit = 3) {
  return mockCollections.filter((c) => !c.isFavorite).slice(0, limit);
}
