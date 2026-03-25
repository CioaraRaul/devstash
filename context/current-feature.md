# Current Feature: Auth Setup - NextAuth + GitHub Provider

Set up NextAuth v5 with Prisma adapter and GitHub OAuth.

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in
- Use NextAuth's default pages for testing

## Notes

- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page
- Use Context7 to verify newest config and conventions
- Files to create: `src/auth.config.ts`, `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/proxy.ts`, `src/types/next-auth.d.ts`
- Env vars needed: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

---

## History

- 2026-03-20: Initial Next.js 16.2 and Tailwind CSS v4 setup with TypeScript
- 2026-03-21: Dashboard UI Phase 1 completed
  - ShadCN UI initialization and component installation
  - Dashboard route at /dashboard
  - Main dashboard layout and global styles with dark mode by default
  - Top bar with search and new item button (display only)
  - Placeholder for sidebar and main area
- 2026-03-21: Dashboard UI Phase 2 completed
  - Collapsible sidebar with toggle button
  - Items/types with colorful icons and links to /items/TYPE
  - Favorite collections with star indicator
  - Most recent collections with folder icons
  - User avatar area at the bottom
  - Drawer icon (PanelLeft) to open/close sidebar
  - Sheet drawer on mobile view
- 2026-03-22: Dashboard UI Phase 3 completed
  - 4 stats cards for items, collections, favorite items, and favorite collections
  - Collections grid with type icons, descriptions, and favorite indicators
  - Pinned items section
  - Recent items grid (10 items) with colored borders, tags, and content previews
  - Refactored layout to server component with client DashboardShell
- 2026-03-22: Prisma + Neon PostgreSQL setup completed
- 2026-03-23: Seed data completed
  - Created seed script (`prisma/seed.ts`)
  - Demo user (demo@devstash.io) with bcryptjs password hash
  - 7 system item types with Lucide icons and colors
  - 15 tags across all categories
  - 5 collections: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources
  - 18 items total (3 snippets, 3 prompts, 1 snippet, 1 command, 2 links, 4 commands, 4 links)
- 2026-03-23: Dashboard collections real data completed
  - Created src/lib/db/collections.ts with Prisma queries
  - Replaced mock data with real Neon DB data for collections grid and stats
  - Collection card border color derived from most-used content type
  - Small type icons displayed per collection
  - Stats cards now show real database counts
- 2026-03-23: Dashboard items real data completed
  - Created src/lib/db/items.ts with getPinnedItems() and getRecentItems() Prisma queries
  - Replaced mock data with real Neon DB data for pinned and recent items
  - Item card icon/border derived from item type via DashboardItem shape
  - Tags fetched from DB and displayed on item cards
  - Pinned items section hidden when no pinned items exist
- 2026-03-24: Stats sidebar real data completed
  - Created src/lib/db/sidebar.ts with getItemTypesWithCounts() and getSidebarCollections()
  - Sidebar types now show real DB item types with counts, linking to /items/[slug]
  - Favorite collections display star icons, recent collections show colored circle (dominant type color)
  - Added "View all collections" link under collections list
  - Data flows from async layout → DashboardShell → SidebarContent via props
  - Added sidebar interfaces to src/types/dashboard.ts
- 2026-03-24: Add Pro Badge to Sidebar completed
  - Added PRO badge (ShadCN Badge, outline variant) to Files and Images types in sidebar
  - Subtle styling: small height, tiny text, muted color
  - PRO_TYPE_SLUGS Set for easy extensibility
- 2026-03-24: Codebase Audit Quick Wins completed
  - Deleted dead data-helpers.ts and mock-data.ts (248 lines removed)
  - Added userId filter to all 7 Prisma query functions for data isolation
  - Replaced mock user in SidebarUser with real DB user data via props
  - Fixed PRO badge slug mismatch (file/image → files/images)
  - Fixed "All Items" → "Recent Items" heading in RecentItems
  - Removed redundant useCallback in DashboardShell (React Compiler)
  - Added DATABASE_URL null guard in prisma.ts
  - Extracted shared computeDominantColor helper to db/utils.ts
