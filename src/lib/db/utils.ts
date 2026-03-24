export function computeDominantColor(
  itemTypes: { slug: string; color: string }[]
): string {
  const counts = new Map<string, { count: number; color: string }>();
  for (const type of itemTypes) {
    const existing = counts.get(type.slug);
    counts.set(type.slug, {
      count: (existing?.count ?? 0) + 1,
      color: type.color,
    });
  }

  let dominant = "";
  let maxCount = 0;
  for (const [, { count, color }] of counts) {
    if (count > maxCount) {
      maxCount = count;
      dominant = color;
    }
  }

  return dominant;
}
