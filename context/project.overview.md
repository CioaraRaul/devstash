# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all developer knowledge & resources.**

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Target Users](#target-users)
3. [Tech Stack](#tech-stack)
4. [Data Models & Prisma Schema](#data-models--prisma-schema)
5. [Features](#features)
6. [Item Types Reference](#item-types-reference)
7. [Monetization](#monetization)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Architecture Diagram](#architecture-diagram)
10. [Route Structure](#route-structure)
11. [Key Decisions & Notes](#key-decisions--notes)

---

## Problem Statement

Developers scatter their essential resources across too many places:

| Resource | Where it lives today |
|---|---|
| Code snippets | VS Code, Notion, Gists |
| AI prompts | Chat history, random docs |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Commands | `.txt` files, bash history |
| Templates | GitHub Gists, local folders |

**DevStash consolidates all of this into one place** — fast to access, powerful to search, and AI-enhanced for pro users.

---

## Target Users

| User Type | Core Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| **AI-first Developer** | Organize prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) / React 19 — SSR + API routes |
| **Language** | TypeScript |
| **Database** | [Neon](https://neon.tech/) (PostgreSQL, serverless) |
| **ORM** | [Prisma 7](https://www.prisma.io/) — migrations only, never `db push` |
| **Auth** | [NextAuth v5](https://authjs.dev/) — email/password + GitHub OAuth |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| **AI** | OpenAI `gpt-4o-mini` |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Caching** | Redis (optional, TBD) |

> ⚠️ **DB Rule**: Never run `prisma db push` in any environment. Always generate and run migrations (`prisma migrate dev` / `prisma migrate deploy`).

---

## Data Models & Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth (extends NextAuth) ──────────────────────────────────────────────────

model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String    @unique
  emailVerified         DateTime?
  image                 String?
  passwordHash          String?
  isPro                 Boolean   @default(false)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─── Item Types ───────────────────────────────────────────────────────────────

enum ContentType {
  TEXT
  FILE
  URL
}

model ItemType {
  id       String      @id @default(cuid())
  name     String      // e.g. "snippet", "prompt", "command"
  slug     String      // e.g. "snippets" — used in URL: /items/snippets
  icon     String      // Lucide icon name
  color    String      // Hex color, e.g. "#3b82f6"
  contentType ContentType
  isSystem Boolean     @default(false)
  userId   String?     // null for system types

  user  User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  items Item[]

  @@unique([slug, userId]) // system slugs are unique without userId
  @@map("item_types")
}

// ─── Items ────────────────────────────────────────────────────────────────────

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  content     String?  @db.Text   // text content (snippet, note, prompt, command)
  fileUrl     String?             // Cloudflare R2 URL
  fileName    String?
  fileSize    Int?                // bytes
  url         String?             // for link type
  language    String?             // e.g. "typescript", "python"
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId     String
  itemTypeId String

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemType    ItemType         @relation(fields: [itemTypeId], references: [id])
  tags        Tag[]
  collections ItemCollection[]

  @@map("items")
}

// ─── Collections ─────────────────────────────────────────────────────────────

model Collection {
  id            String   @id @default(cuid())
  name          String   // e.g. "React Patterns", "Context Files"
  description   String?
  isFavorite    Boolean  @default(false)
  defaultTypeId String?  // fallback type for new items added to this collection
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId String

  user  User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  items ItemCollection[]

  @@map("collections")
}

// ─── Join Table ───────────────────────────────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
  @@map("item_collections")
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

model Tag {
  id    String @id @default(cuid())
  name  String
  items Item[]

  @@map("tags")
}
```

---

## Features

### A. Items & Item Types

- Items have a **type** (snippet, prompt, command, note, file, image, link)
- Items are **quick to create and access** via a slide-over drawer
- System types cannot be modified; custom types are a Pro feature (future)
- File/Image types are **Pro only**

### B. Collections

- Users create named collections (e.g. "React Patterns", "Interview Prep")
- An item can belong to **multiple collections**
- Collections have an optional default item type for convenience

### C. Search

Full-text search across:
- Item **title**
- Item **content**
- **Tags**
- Item **type**

### D. Authentication

- Email/password (with hashed password via NextAuth credentials provider)
- GitHub OAuth

### E. Core UX Features

- ⭐ Favorite collections and items
- 📌 Pin items to top
- 🕐 Recently used tracking (`lastUsedAt`)
- 📥 Import code from a file
- ✍️ Markdown editor for text-type items (with syntax highlighting)
- 📤 Export data (JSON/ZIP) — Pro
- 🌑 Dark mode default
- ➕ Add/remove items to/from multiple collections
- 🔍 View which collections an item belongs to

### F. AI Features *(Pro only)*

| Feature | Description |
|---|---|
| **Auto-tag** | Suggest relevant tags for an item automatically |
| **AI Summary** | Generate a short summary of any item |
| **Explain This Code** | Plain-English explanation of a snippet |
| **Prompt Optimizer** | Rewrite and improve AI prompts |

> 🧪 **Dev Note**: During development, all users have access to all features regardless of `isPro`.

---

## Item Types Reference

| Type | Slug | Color | Icon | Content Type |
|---|---|---|---|---|
| Snippet | `snippets` | `#3b82f6` ![blue](https://via.placeholder.com/12/3b82f6/3b82f6.png) | `Code` | TEXT |
| Prompt | `prompts` | `#8b5cf6` ![purple](https://via.placeholder.com/12/8b5cf6/8b5cf6.png) | `Sparkles` | TEXT |
| Command | `commands` | `#f97316` ![orange](https://via.placeholder.com/12/f97316/f97316.png) | `Terminal` | TEXT |
| Note | `notes` | `#fde047` ![yellow](https://via.placeholder.com/12/fde047/fde047.png) | `StickyNote` | TEXT |
| File | `files` | `#6b7280` ![gray](https://via.placeholder.com/12/6b7280/6b7280.png) | `File` | FILE |
| Image | `images` | `#ec4899` ![pink](https://via.placeholder.com/12/ec4899/ec4899.png) | `Image` | FILE |
| Link | `links` | `#10b981` ![emerald](https://via.placeholder.com/12/10b981/10b981.png) | `Link` | URL |

Icons are from [Lucide React](https://lucide.dev/).

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types **except** File & Image
- Basic search
- No AI features
- No file/image uploads

### Pro Tier — $8/month or $72/year

- Unlimited items & collections
- File & Image uploads (via Cloudflare R2)
- Custom item types *(future)*
- All AI features
- Export data as JSON/ZIP
- Priority support

Payments handled via **Stripe** (`stripeCustomerId`, `stripeSubscriptionId` on User model).

---

## UI/UX Guidelines

### Design Philosophy

- **Minimal, developer-focused, dark-first**
- Inspired by: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Clean typography, generous whitespace, subtle borders and shadows
- Syntax highlighting on all code blocks

### Layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  DevStash                    [Search] [User] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ TYPES    │   Collections Grid                       │
│ ─────    │   ┌──────────┐  ┌──────────┐            │
│ Snippets │   │ React    │  │ Interview│            │
│ Prompts  │   │ Patterns │  │ Prep     │            │
│ Commands │   └──────────┘  └──────────┘            │
│ Notes    │                                          │
│ Links    │   Items (under selected collection)      │
│          │   ┌──────────┐  ┌──────────┐            │
│ ─────    │   │ useState │  │ useEffect│            │
│ COLLECTIONS  │ snippet  │  │ snippet  │            │
│ ─────    │   └──────────┘  └──────────┘            │
│ React… ⭐│                                          │
│ Interview│                                          │
│ Python…  │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **Sidebar**: Collapsible. Lists item types (with item counts) + recent/favorited collections.
- **Main area**: Collection cards (color-coded by dominant item type). Items below, color-coded by type (border color).
- **Item drawer**: Slides in from the right. Markdown editor, copy button, AI actions, collection membership.
- **Mobile**: Sidebar becomes a bottom drawer or hamburger menu.

### Color Coding

Collection cards use a **background tint** based on the most common item type in that collection. Item cards use a **left border** in their type's color.

### Micro-interactions

- Smooth slide transitions on drawer open/close
- Hover states on cards (subtle lift + border highlight)
- Toast notifications for copy, save, delete actions
- Loading skeletons while fetching items

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Next.js)                  │
│  React 19 + Tailwind v4 + shadcn/ui                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │  App Pages │  │ API Routes │  │  Auth (NextAuth v5) │ │
│  └────────────┘  └─────┬──────┘  └────────────────────┘ │
└────────────────────────┼────────────────────────────────┘
                         │
          ┌──────────────┼──────────────────┐
          │              │                  │
   ┌──────▼──────┐  ┌────▼────┐  ┌─────────▼────────┐
   │  Neon (PG)  │  │ OpenAI  │  │  Cloudflare R2   │
   │  + Prisma 7 │  │  AI API │  │  (file uploads)  │
   └─────────────┘  └─────────┘  └──────────────────┘
          │
   ┌──────▼──────┐
   │  Stripe API │
   │  (payments) │
   └─────────────┘
```

---

## Route Structure

```
/                          → Landing / marketing page
/auth/signin               → Sign in (email or GitHub)
/auth/signup               → Register
/dashboard                 → Main app shell
/dashboard/items           → All items (flat view)
/dashboard/items/[slug]    → Items filtered by type (e.g. /items/snippets)
/dashboard/collections     → All collections
/dashboard/collections/[id]→ Single collection view
/dashboard/search          → Search results
/dashboard/settings        → User settings (profile, export, billing)
/api/items                 → CRUD for items
/api/collections           → CRUD for collections
/api/upload                → File upload to R2
/api/ai/tag                → AI auto-tagging
/api/ai/explain            → AI explain code
/api/ai/summarize          → AI summarize item
/api/ai/optimize-prompt    → AI prompt optimizer
/api/stripe/webhook        → Stripe billing webhook
```

---

## Key Decisions & Notes

| Decision | Rationale |
|---|---|
| **Next.js API routes** over a separate backend | One repo, less overhead, simpler deployment |
| **Neon (serverless Postgres)** | Scales to zero, generous free tier, pairs well with Prisma |
| **Prisma migrations only** | Safer for production — never `db push` |
| **NextAuth v5** | Handles both credentials and OAuth cleanly in Next.js App Router |
| **Cloudflare R2** | S3-compatible, no egress fees, great for file/image storage |
| **Dark mode default** | Developer audience prefers it; light mode available as a toggle |
| **Drawer for items** | Fast access without leaving context — similar to Linear's detail pane |
| **Items can be in multiple collections** | More flexible than a folder hierarchy; join table handles M:M |
| **`isPro` flag on User** | Simple gate for features; Stripe manages subscription lifecycle |
| **All features unlocked in dev** | Speeds up development; gate later with `isPro` checks |

---

*Last updated: March 2026*
