import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  const itemTypes = await prisma.itemType.findMany({
    orderBy: { slug: "asc" },
  });

  console.log(`Found ${itemTypes.length} item types:`);
  for (const type of itemTypes) {
    console.log(`  - ${type.label} (${type.slug}) [${type.contentType}]`);
  }

  const userCount = await prisma.user.count();
  const itemCount = await prisma.item.count();
  const collectionCount = await prisma.collection.count();
  const tagCount = await prisma.tag.count();

  console.log("\nRecord counts:");
  console.log(`  Users:       ${userCount}`);
  console.log(`  Items:       ${itemCount}`);
  console.log(`  Collections: ${collectionCount}`);
  console.log(`  Tags:        ${tagCount}`);

  console.log("\nDatabase connection OK.");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
