import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// ─── System Item Types ──────────────────────────────────────────────

const itemTypes = [
  {
    slug: "snippet",
    label: "Snippet",
    icon: "Code",
    color: "#3b82f6",
    contentType: "TEXT" as const,
  },
  {
    slug: "prompt",
    label: "Prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
    contentType: "TEXT" as const,
  },
  {
    slug: "command",
    label: "Command",
    icon: "Terminal",
    color: "#f97316",
    contentType: "TEXT" as const,
  },
  {
    slug: "note",
    label: "Note",
    icon: "StickyNote",
    color: "#fde047",
    contentType: "TEXT" as const,
  },
  {
    slug: "file",
    label: "File",
    icon: "File",
    color: "#6b7280",
    contentType: "FILE" as const,
  },
  {
    slug: "image",
    label: "Image",
    icon: "Image",
    color: "#ec4899",
    contentType: "FILE" as const,
  },
  {
    slug: "link",
    label: "Link",
    icon: "Link",
    color: "#10b981",
    contentType: "URL" as const,
  },
];

// ─── Seed Data ──────────────────────────────────────────────────────

async function main() {
  // 1. Seed item types
  console.log("Seeding item types...");
  const types: Record<string, string> = {};
  for (const type of itemTypes) {
    const result = await prisma.itemType.upsert({
      where: { slug: type.slug },
      update: { icon: type.icon, color: type.color },
      create: type,
    });
    types[type.slug] = result.id;
  }
  console.log(`Seeded ${itemTypes.length} item types.`);

  // 2. Seed demo user
  console.log("Seeding demo user...");
  const passwordHash = await hash("12345678", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      emailVerified: new Date(),
    },
  });
  console.log(`Seeded user: ${user.email} (password hash: ${passwordHash})`);

  // 3. Seed tags
  console.log("Seeding tags...");
  const tagNames = [
    "react",
    "typescript",
    "hooks",
    "patterns",
    "ai",
    "prompts",
    "devops",
    "docker",
    "git",
    "css",
    "tailwind",
    "shell",
    "npm",
    "ci-cd",
    "design",
  ];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name_userId: { name, userId: user.id } },
      update: {},
      create: { name, userId: user.id },
    });
    tags[name] = tag.id;
  }
  console.log(`Seeded ${tagNames.length} tags.`);

  // 4. Seed collections and items
  console.log("Seeding collections and items...");

  // ── React Patterns ────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      isFavorite: true,
      userId: user.id,
    },
  });

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useDebounce Hook",
        description: "Custom hook for debouncing values in React components",
        content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
        language: "typescript",
        isFavorite: true,
        isPinned: true,
        typeId: types["snippet"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "useLocalStorage Hook",
        description:
          "Persist state to localStorage with automatic serialization",
        content: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
        language: "typescript",
        typeId: types["snippet"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Compound Component Pattern",
        description:
          "Context-based compound components for flexible composition",
        content: `import { createContext, useContext, type ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within <Tabs>");
  return context;
}

function Tabs({ children, value, onChange }: {
  children: ReactNode;
  value: string;
  onChange: (tab: string) => void;
}) {
  return (
    <TabsContext value={{ activeTab: value, setActiveTab: onChange }}>
      {children}
    </TabsContext>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  return activeTab === value ? <>{children}</> : null;
}

Tabs.Panel = TabPanel;
export { Tabs };`,
        language: "typescript",
        typeId: types["snippet"],
        userId: user.id,
      },
    }),
  ]);

  for (const item of reactItems) {
    await prisma.collectionItem.create({
      data: { collectionId: reactPatterns.id, itemId: item.id },
    });
  }
  await Promise.all([
    prisma.itemTag.create({
      data: { itemId: reactItems[0].id, tagId: tags["react"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[0].id, tagId: tags["hooks"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[0].id, tagId: tags["typescript"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[1].id, tagId: tags["react"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[1].id, tagId: tags["hooks"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[1].id, tagId: tags["typescript"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[2].id, tagId: tags["react"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[2].id, tagId: tags["patterns"] },
    }),
    prisma.itemTag.create({
      data: { itemId: reactItems[2].id, tagId: tags["typescript"] },
    }),
  ]);

  // ── AI Workflows ──────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      isFavorite: true,
      userId: user.id,
    },
  });

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Code Review Prompt",
        description: "Thorough code review with actionable feedback",
        content: `Review the following code and provide feedback on:

1. **Correctness** — Are there bugs, edge cases, or logic errors?
2. **Performance** — Are there unnecessary re-renders, O(n²) loops, or memory leaks?
3. **Readability** — Is the code clear? Are names descriptive? Is the structure logical?
4. **Security** — Are there XSS, injection, or data exposure risks?
5. **Best Practices** — Does it follow framework conventions and idiomatic patterns?

For each issue, provide:
- Severity (critical / warning / suggestion)
- The specific line or block
- A concrete fix or improvement

Code to review:
\`\`\`
{{code}}
\`\`\``,
        isFavorite: true,
        typeId: types["prompt"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Documentation Generator",
        description: "Generate comprehensive documentation from code",
        content: `Analyze the following code and generate documentation that includes:

1. **Overview** — A one-paragraph summary of what this module/component does
2. **API Reference** — For each exported function/component:
   - Parameters with types and descriptions
   - Return value
   - Usage example
3. **Dependencies** — External libraries or internal modules used
4. **Examples** — 2-3 realistic usage examples with expected output

Write in a clear, concise style suitable for a README or docs site.

Code:
\`\`\`
{{code}}
\`\`\``,
        typeId: types["prompt"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Refactoring Assistant",
        description: "Guided refactoring with before/after comparisons",
        content: `Refactor the following code to improve its quality. For each change:

1. Show the **before** and **after** code
2. Explain **why** the change improves the code
3. Categorize the change: extract function | simplify logic | improve naming | reduce duplication | apply pattern

Priorities:
- Preserve existing behavior (no functional changes)
- Prefer small, incremental improvements over large rewrites
- Focus on the highest-impact changes first

Code to refactor:
\`\`\`
{{code}}
\`\`\``,
        typeId: types["prompt"],
        userId: user.id,
      },
    }),
  ]);

  for (const item of aiItems) {
    await prisma.collectionItem.create({
      data: { collectionId: aiWorkflows.id, itemId: item.id },
    });
  }
  await Promise.all([
    prisma.itemTag.create({
      data: { itemId: aiItems[0].id, tagId: tags["ai"] },
    }),
    prisma.itemTag.create({
      data: { itemId: aiItems[0].id, tagId: tags["prompts"] },
    }),
    prisma.itemTag.create({
      data: { itemId: aiItems[1].id, tagId: tags["ai"] },
    }),
    prisma.itemTag.create({
      data: { itemId: aiItems[1].id, tagId: tags["prompts"] },
    }),
    prisma.itemTag.create({
      data: { itemId: aiItems[2].id, tagId: tags["ai"] },
    }),
    prisma.itemTag.create({
      data: { itemId: aiItems[2].id, tagId: tags["prompts"] },
    }),
  ]);

  // ── DevOps ────────────────────────────────────────────────────────
  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  const devopsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Multi-stage Dockerfile",
        description: "Production-optimized Docker build for Node.js apps",
        content: `FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
        language: "dockerfile",
        typeId: types["snippet"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Deploy to Production",
        description: "Build, tag, and deploy Docker image to production",
        content: `docker build -t app:latest . && \\
docker tag app:latest registry.example.com/app:$(git rev-parse --short HEAD) && \\
docker push registry.example.com/app:$(git rev-parse --short HEAD) && \\
echo "Deployed $(git rev-parse --short HEAD) to production"`,
        typeId: types["command"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker Documentation",
        description: "Official Docker reference documentation",
        url: "https://docs.docker.com/reference/",
        typeId: types["link"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "GitHub Actions Documentation",
        description: "CI/CD workflow reference for GitHub Actions",
        url: "https://docs.github.com/en/actions",
        typeId: types["link"],
        userId: user.id,
      },
    }),
  ]);

  for (const item of devopsItems) {
    await prisma.collectionItem.create({
      data: { collectionId: devops.id, itemId: item.id },
    });
  }
  await Promise.all([
    prisma.itemTag.create({
      data: { itemId: devopsItems[0].id, tagId: tags["docker"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[0].id, tagId: tags["devops"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[1].id, tagId: tags["docker"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[1].id, tagId: tags["devops"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[1].id, tagId: tags["ci-cd"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[2].id, tagId: tags["docker"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[2].id, tagId: tags["devops"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[3].id, tagId: tags["devops"] },
    }),
    prisma.itemTag.create({
      data: { itemId: devopsItems[3].id, tagId: tags["ci-cd"] },
    }),
  ]);

  // ── Terminal Commands ─────────────────────────────────────────────
  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Git Interactive Rebase",
        description: "Squash, reorder, or edit recent commits",
        content:
          "git rebase -i HEAD~5  # Interactive rebase last 5 commits\ngit rebase -i main   # Rebase current branch onto main",
        isPinned: true,
        typeId: types["command"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker Cleanup",
        description: "Remove unused containers, images, and volumes",
        content:
          "docker system prune -af --volumes  # Remove all unused data\ndocker image prune -a              # Remove all unused images\ndocker volume prune                # Remove all unused volumes",
        typeId: types["command"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Find and Kill Process by Port",
        description: "Find which process is using a port and kill it",
        content:
          'lsof -i :3000                      # Find process on port 3000\nkill -9 $(lsof -ti :3000)          # Kill process on port 3000\nnetstat -tlnp | grep :3000         # Alternative: check port usage',
        typeId: types["command"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "npm/pnpm Utilities",
        description: "Handy package manager commands for daily use",
        content:
          "npm ls --depth=0                   # List top-level dependencies\nnpm outdated                       # Check for outdated packages\nnpx npm-check-updates -u           # Update all package versions\npnpm why <package>                 # Why is a package installed",
        typeId: types["command"],
        userId: user.id,
      },
    }),
  ]);

  for (const item of terminalItems) {
    await prisma.collectionItem.create({
      data: { collectionId: terminalCommands.id, itemId: item.id },
    });
  }
  await Promise.all([
    prisma.itemTag.create({
      data: { itemId: terminalItems[0].id, tagId: tags["git"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[0].id, tagId: tags["shell"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[1].id, tagId: tags["docker"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[1].id, tagId: tags["shell"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[2].id, tagId: tags["shell"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[3].id, tagId: tags["npm"] },
    }),
    prisma.itemTag.create({
      data: { itemId: terminalItems[3].id, tagId: tags["shell"] },
    }),
  ]);

  // ── Design Resources ──────────────────────────────────────────────
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      isFavorite: true,
      userId: user.id,
    },
  });

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Tailwind CSS Documentation",
        description: "Official Tailwind CSS utility class reference",
        url: "https://tailwindcss.com/docs",
        isFavorite: true,
        typeId: types["link"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "shadcn/ui Components",
        description:
          "Beautifully designed components built with Radix UI and Tailwind",
        url: "https://ui.shadcn.com",
        typeId: types["link"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Radix UI Primitives",
        description: "Unstyled, accessible UI component primitives for React",
        url: "https://www.radix-ui.com/primitives",
        typeId: types["link"],
        userId: user.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Lucide Icons",
        description: "Beautiful and consistent icon library for React",
        url: "https://lucide.dev/icons",
        typeId: types["link"],
        userId: user.id,
      },
    }),
  ]);

  for (const item of designItems) {
    await prisma.collectionItem.create({
      data: { collectionId: designResources.id, itemId: item.id },
    });
  }
  await Promise.all([
    prisma.itemTag.create({
      data: { itemId: designItems[0].id, tagId: tags["css"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[0].id, tagId: tags["tailwind"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[1].id, tagId: tags["design"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[1].id, tagId: tags["tailwind"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[2].id, tagId: tags["design"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[2].id, tagId: tags["react"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[3].id, tagId: tags["design"] },
    }),
    prisma.itemTag.create({
      data: { itemId: designItems[3].id, tagId: tags["react"] },
    }),
  ]);

  console.log("Seeding complete!");
  console.log(
    `  - ${itemTypes.length} item types`,
  );
  console.log(`  - 1 demo user (${user.email})`);
  console.log(`  - ${tagNames.length} tags`);
  console.log(`  - 5 collections`);
  console.log(
    `  - ${reactItems.length + aiItems.length + devopsItems.length + terminalItems.length + designItems.length} items`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
