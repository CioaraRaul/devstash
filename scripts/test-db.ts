import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // Item types
  const itemTypes = await prisma.itemType.findMany({
    orderBy: { slug: "asc" },
  });
  console.log(`Item Types (${itemTypes.length}):`);
  for (const type of itemTypes) {
    console.log(`  ${type.icon.padEnd(12)} ${type.label.padEnd(10)} ${type.color}  [${type.contentType}]`);
  }

  // Demo user
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: { _count: { select: { items: true, collections: true, tags: true } } },
  });
  console.log(`\nDemo User:`);
  if (user) {
    console.log(`  Name:          ${user.name}`);
    console.log(`  Email:         ${user.email}`);
    console.log(`  Verified:      ${user.emailVerified?.toISOString() ?? "no"}`);
    console.log(`  Items:         ${user._count.items}`);
    console.log(`  Collections:   ${user._count.collections}`);
    console.log(`  Tags:          ${user._count.tags}`);
  } else {
    console.log("  Not found!");
  }

  // Collections with item counts
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: {
      items: { include: { item: { include: { type: true } } } },
    },
  });
  console.log(`\nCollections (${collections.length}):`);
  for (const col of collections) {
    const fav = col.isFavorite ? " ★" : "";
    console.log(`  ${col.name}${fav} — ${col.description}`);
    for (const ci of col.items) {
      const icon = ci.item.type.icon.padEnd(12);
      console.log(`    ${icon} ${ci.item.title}`);
    }
  }

  // Tags
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
  console.log(`\nTags (${tags.length}):`);
  console.log(`  ${tags.map((t) => `${t.name}(${t._count.items})`).join("  ")}`);

  // Pinned / favorited items
  const pinned = await prisma.item.findMany({
    where: { isPinned: true },
    include: { type: true },
  });
  const favorited = await prisma.item.findMany({
    where: { isFavorite: true },
    include: { type: true },
  });
  console.log(`\nPinned Items (${pinned.length}):`);
  for (const item of pinned) {
    console.log(`  📌 ${item.title} [${item.type.label}]`);
  }
  console.log(`\nFavorite Items (${favorited.length}):`);
  for (const item of favorited) {
    console.log(`  ★  ${item.title} [${item.type.label}]`);
  }

  console.log("\nDatabase connection OK ✓");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
