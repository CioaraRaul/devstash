# Current Feature

<!-- Feature name and short description -->

## Status

Completed

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

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
