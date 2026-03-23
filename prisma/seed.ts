import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const itemTypes = [
  {
    slug: "snippet",
    label: "Snippet",
    icon: "Code",
    color: "#3B82F6",
    contentType: "TEXT" as const,
  },
  {
    slug: "command",
    label: "Command",
    icon: "Terminal",
    color: "#10B981",
    contentType: "TEXT" as const,
  },
  {
    slug: "prompt",
    label: "Prompt",
    icon: "MessageSquare",
    color: "#8B5CF6",
    contentType: "TEXT" as const,
  },
  {
    slug: "note",
    label: "Note",
    icon: "StickyNote",
    color: "#F59E0B",
    contentType: "TEXT" as const,
  },
  {
    slug: "file",
    label: "File",
    icon: "File",
    color: "#6366F1",
    contentType: "FILE" as const,
  },
  {
    slug: "image",
    label: "Image",
    icon: "Image",
    color: "#EC4899",
    contentType: "FILE" as const,
  },
  {
    slug: "link",
    label: "Link",
    icon: "Link",
    color: "#14B8A6",
    contentType: "URL" as const,
  },
];

async function main() {
  console.log("Seeding item types...");

  for (const type of itemTypes) {
    await prisma.itemType.upsert({
      where: { slug: type.slug },
      update: {},
      create: type,
    });
  }

  console.log(`Seeded ${itemTypes.length} item types.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
