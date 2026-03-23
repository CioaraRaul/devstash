# Current Feature

<!-- Feature name and short description -->

## Status

Completed

## Goals

<!-- Next feature goals go here -->

## Notes

<!-- Any extra notes -->

## History

- 2026-03-23: Seed data completed
  - Created seed script (`prisma/seed.ts`)
  - Demo user (demo@devstash.io) with bcryptjs password hash
  - 7 system item types with Lucide icons and colors
  - 15 tags across all categories
  - 5 collections: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources
  - 18 items total (3 snippets, 3 prompts, 1 snippet, 1 command, 2 links, 4 commands, 4 links)
- 2026-03-22: Prisma + Neon PostgreSQL setup completed
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
