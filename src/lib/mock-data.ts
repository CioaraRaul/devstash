export type ItemType = {
  id: string;
  slug: string;
  label: string;
  icon: string;
  color: string;
  contentType: "TEXT" | "FILE" | "URL";
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
  isFavorite: boolean;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  typeSlug: string;
  content?: string;
  url?: string;
  language?: string;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export const mockUser: User = {
  id: "user-1",
  name: "John Developer",
  email: "john@example.com",
  image: null,
};

export const mockItemTypes: ItemType[] = [
  { id: "type-1", slug: "snippets", label: "Snippet", icon: "Code", color: "#3b82f6", contentType: "TEXT" },
  { id: "type-2", slug: "prompts", label: "Prompt", icon: "Sparkles", color: "#8b5cf6", contentType: "TEXT" },
  { id: "type-3", slug: "commands", label: "Command", icon: "Terminal", color: "#f97316", contentType: "TEXT" },
  { id: "type-4", slug: "notes", label: "Note", icon: "StickyNote", color: "#fde047", contentType: "TEXT" },
  { id: "type-5", slug: "files", label: "File", icon: "File", color: "#6b7280", contentType: "FILE" },
  { id: "type-6", slug: "images", label: "Image", icon: "Image", color: "#ec4899", contentType: "FILE" },
  { id: "type-7", slug: "links", label: "Link", icon: "Link", color: "#10b981", contentType: "URL" },
];

export const mockCollections: Collection[] = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Custom React patterns and hooks",
    itemIds: ["item-1", "item-4"],
    isFavorite: true,
  },
  {
    id: "col-2",
    name: "AI Prompts",
    description: "Curated prompts for coding assistants",
    itemIds: ["item-5", "item-8"],
    isFavorite: true,
  },
  {
    id: "col-3",
    name: "DevOps Commands",
    description: "Docker, k8s, and deployment commands",
    itemIds: ["item-3"],
    isFavorite: false,
  },
  {
    id: "col-4",
    name: "Interview Prep",
    description: "Algorithm practice and explanations",
    itemIds: ["item-6"],
    isFavorite: false,
  },
  {
    id: "col-5",
    name: "Useful Links",
    description: "Documentation and learning resources",
    itemIds: ["item-4", "item-7"],
    isFavorite: false,
  },
  {
    id: "col-6",
    name: "Project Notes",
    description: "Architecture decisions and notes",
    itemIds: ["item-2"],
    isFavorite: false,
  },
];

export const mockItems: Item[] = [
  {
    id: "item-1",
    title: "useDebounce Hook",
    description: "A custom React hook for debouncing values",
    typeSlug: "snippets",
    language: "typescript",
    content: `import { useState, useEffect } from 'react'\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value)\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n\n  return debouncedValue\n}`,
    tags: ["react", "hooks", "debounce"],
    collectionIds: ["col-1"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "item-2",
    title: "Architecture Notes",
    description: "High-level architecture opinions and decisions",
    typeSlug: "notes",
    content: "## Architecture Decisions\n\n- Use App Router for all routing\n- Server components by default\n- Client components only when interactivity is needed",
    tags: ["architecture", "decisions", "project"],
    collectionIds: ["col-6"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-12T14:00:00Z",
  },
  {
    id: "item-3",
    title: "Docker Cleanup",
    description: "Remove stopped containers and unused Docker resources",
    typeSlug: "commands",
    content: "docker system prune -af --volumes",
    tags: ["docker", "cleanup", "devops"],
    collectionIds: ["col-3"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "item-4",
    title: "React Documentation",
    description: "Official React documentation and learning resources",
    typeSlug: "links",
    url: "https://react.dev",
    tags: ["react", "docs", "learning"],
    collectionIds: ["col-1", "col-5"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-05T11:00:00Z",
  },
  {
    id: "item-5",
    title: "Code Review Prompt",
    description: "AI prompt for thorough code review",
    typeSlug: "prompts",
    content: "Review the following code for bugs, performance issues, and best practices. Suggest improvements with explanations:\n\n```\n{{code}}\n```",
    tags: ["code-review", "ai"],
    collectionIds: ["col-2"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-03-14T16:00:00Z",
  },
  {
    id: "item-6",
    title: "Binary Search",
    description: "Classic binary search algorithm",
    typeSlug: "snippets",
    language: "typescript",
    content: `function binarySearch(arr: number[], target: number): number {\n  let left = 0\n  let right = arr.length - 1\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2)\n    if (arr[mid] === target) return mid\n    if (arr[mid] < target) left = mid + 1\n    else right = mid - 1\n  }\n\n  return -1\n}`,
    tags: ["algorithms", "search"],
    collectionIds: ["col-4"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "item-7",
    title: "TypeScript Documentation",
    description: "Official TypeScript handbook",
    typeSlug: "links",
    url: "https://www.typescriptlang.org/docs/",
    tags: ["typescript", "docs"],
    collectionIds: ["col-5"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-03T13:00:00Z",
  },
  {
    id: "item-8",
    title: "Refactor Prompt",
    description: "AI prompt for code refactoring",
    typeSlug: "prompts",
    content: "Refactor the following code to improve readability, reduce duplication, and follow best practices. Keep the same behavior:\n\n```\n{{code}}\n```",
    tags: ["refactor", "ai"],
    collectionIds: ["col-2"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-15T10:00:00Z",
  },
];
