# Codebase Audit Quick Wins

Clean up issues found during the 2026-03-24 codebase audit.

## Status

In Progress

## Goals

- Delete dead `data-helpers.ts` and add TODO for mock user replacement
- Add `userId` filter to all Prisma queries for data isolation
- Fix PRO badge slug mismatch in SidebarTypes
- Fix "All Items" heading mismatch in RecentItems
- Remove redundant `useCallback` in DashboardShell
- Add `DATABASE_URL` guard in prisma.ts
- Extract shared dominant-color helper to reduce duplication

## Notes

<!-- Any extra notes -->

---

## Quick Wins (From Codebase Audit — 2026-03-24)

### QW-1: Remove dead `data-helpers.ts` and consolidate mock data usage
**Files:** `src/lib/data-helpers.ts`, `src/lib/mock-data.ts`
**Issue:** `data-helpers.ts` contains helper functions that all operate on mock data (never called from any real page). `mock-data.ts` is still imported by `SidebarUser.tsx` for the user's name/email display.
**Tasks:**
- [ ] Delete `src/lib/data-helpers.ts` (all functions are dead code — real DB functions exist in `src/lib/db/`)
- [ ] Replace `mockUser` import in `src/components/dashboard/sidebar/SidebarUser.tsx` with real session data once auth is wired up, or add a TODO comment so it's not missed

### QW-2: Fix missing `userId` filter in all Prisma queries (data isolation)
**Files:** `src/lib/db/collections.ts` (lines 4, 57-59, 65-68), `src/lib/db/items.ts` (lines 4-12, 16-24), `src/lib/db/sidebar.ts` (lines 3-18, 25-34)
**Issue:** Every query fetches ALL rows regardless of user. `getAllCollections()`, `getPinnedItems()`, `getRecentItems()`, `getItemTypesWithCounts()`, `getSidebarCollections()`, `getCollectionStats()`, `getItemStats()` have no `where: { userId: ... }` clause. When multiple users exist, every user sees every other user's data.
**Tasks:**
- [ ] Add `where: { userId }` to every Prisma query in `src/lib/db/collections.ts`, `src/lib/db/items.ts`, and `src/lib/db/sidebar.ts`
- [ ] Thread the `userId` parameter down from the session (once auth is wired up) or from a shared server-side session helper

### QW-3: Fix `PRO_TYPE_SLUGS` slug mismatch in `SidebarTypes.tsx`
**File:** `src/components/dashboard/sidebar/SidebarTypes.tsx` (line 6)
**Issue:** `PRO_TYPE_SLUGS` is defined as `new Set(["file", "image"])` but the actual slugs seeded into the DB (and used in links) are `"files"` and `"images"` (plural). The PRO badge never appears because the slug check never matches.
**Tasks:**
- [ ] Change line 6 to `const PRO_TYPE_SLUGS = new Set(["files", "images"]);`

### QW-4: Fix type label pluralization in `SidebarTypes.tsx`
**File:** `src/components/dashboard/sidebar/SidebarTypes.tsx` (line 25)
**Issue:** The label is rendered as `{type.label}s` (appending a hard-coded "s"). The DB stores labels like "Snippet", "Link", etc. This produces "Snippets", "Links" correctly but will break for any label ending in a vowel or irregular plural if custom types are added later.
**Tasks:**
- [ ] Store the plural form in the DB/seed (`labels` column or a separate `pluralLabel` field), or use a proper pluralization utility, rather than naively appending "s"

### QW-5: Inconsistent `useCallback` import in `DashboardShell.tsx`
**File:** `src/components/dashboard/DashboardShell.tsx` (line 3)
**Issue:** `useCallback` is imported and used to wrap `toggleSidebar`. The React Compiler (enabled in this project) handles memoization automatically, making this redundant. The import adds noise.
**Tasks:**
- [ ] Remove `useCallback` import and unwrap `toggleSidebar` to a plain function: `const toggleSidebar = () => setSidebarOpen((prev) => !prev);`

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
