# Next.js Comments + Likes — 3 minutes, not 3 days

**Every Next.js project needs comments. Stop rebuilding it from scratch.**

Add threaded comments + likes to any Next.js + Supabase project. Copy 3 files, run 1 migration, done. Works in any page, any project, any number of times.

---

## Before & After

| Without this package | With this package |
|---------------------|-------------------|
| Design DB schema from scratch | 1 SQL migration file, already battle-tested |
| Write CRUD API routes by hand | `createCommentsHandler()` — one function call |
| Build comment UI components | 3 pre-built React components, drop in |
| Implement rate limiting yourself | Configurable IP rate limiter, built in |
| Handle spam / bad words manually | Keyword blocklist, built in |
| Figure out RLS policies | RLS included in migration |
| **3 days of work** | **3 minutes** |

---

## What's Inside

```
nextjs-supabase-comments/
├── supabase/migrations/     ← Run once, schema + RLS ready
├── src/
│   ├── components/          ← CommentList, CommentForm, LikeButton
│   ├── api/                 ← Next.js App Router handlers
│   ├── lib/                 ← Rate limiter, content filter, config
│   └── types/               ← Full TypeScript types
├── example/                 ← Working demo page
└── package.json
```

**Features built in:**

- Threaded comments (reply under reply)
- Like/unlike toggle with optimistic UI
- IP-based rate limiting
- Content filtering (custom keyword blocklist)
- Row Level Security (RLS) in the database
- Geo-location tracking (optional)
- Custom ban-check hook (optional)
- Fully typed TypeScript

---

## Quick Start

### 1. Run the migration

```bash
supabase db push
```

### 2. Create your API routes

```ts
// app/api/comments/route.ts
import { createCommentsHandler } from 'nextjs-supabase-comments';

const handler = createCommentsHandler({
  maxLength: 500,
  blockedKeywords: ['spam'],
});

export const GET = handler.GET;
export const POST = handler.POST;
```

```ts
// app/api/likes/route.ts
import { createLikesHandler } from 'nextjs-supabase-comments';

const handler = createLikesHandler();

export const GET = handler.GET;
export const POST = handler.POST;
export const DELETE = handler.DELETE;
```

### 3. Drop components into your page

```tsx
'use client';
import { CommentList, CommentForm, LikeButton } from 'nextjs-supabase-comments';

export default function PostPage() {
  return (
    <div>
      <LikeButton postId={post.id} userId={user.id} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} userId={user.id} username={user.name} />
    </div>
  );
}
```

**Done. Comments and likes work.**

---

## API Reference

### `createCommentsHandler(opts?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxLength` | `number` | `500` | Max comment length |
| `blockedKeywords` | `string[]` | `[]` | Words that trigger rejection |
| `likeRateLimit` | `{ maxRequests, windowMs }` | `4 per 10min` | Rate limit |
| `tableName` | `string` | `'comments'` | Custom table name |
| `banCheck` | `(userId: string) => Promise<boolean>` | — | Custom ban detection |
| `geoLookup` | `(ip: string) => Promise<{country, region}>` | — | IP geolocation |
| `beforeCreate` | `(data) => Promise<boolean>` | — | Pre-insert auth hook |

### `createLikesHandler(opts?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tableName` | `string` | `'likes'` | Custom table name |
| `likeRateLimit` | `{ maxRequests, windowMs }` | `4 per 10min` | Rate limit |

### Component Props

**LikeButton** — `postId` (required), `userId` (required), `apiPath`, `className`, `likedClassName`

**CommentList** — `postId` (required), `apiPath`, `refreshKey`, `avatarColor`, `formatTime`

**CommentForm** — `postId` (required), `userId` (required), `username` (required), `apiPath`, `maxLength`, `onCommentPosted`

---

## Who This Is For

- Solo developers building SaaS products
- Indie hackers shipping MVPs
- Freelancers who don't want to bill clients for reinventing comments
- Anyone building a Next.js site with user interaction

## Real Use Cases

- Blog comment sections
- Course / lesson discussions
- Product review systems
- Community feedback pages
- Changelog reactions

---

## Free vs Complete Package

This repository is free and MIT-licensed. Use it in any project.

**Need the full guided experience?**

📦 **[Get the Complete Package on Gumroad →](https://gumroad.com)** _(link coming soon)_

| | Free (GitHub) | Complete Package ($29) |
|---|---|---|
| Source code | ✅ | ✅ |
| Database migration | ✅ | ✅ |
| API handlers | ✅ | ✅ |
| React components | ✅ | ✅ |
| Working example page | ✅ | ✅ |
| Step-by-step video walkthrough | — | ✅ |
| Ready-to-run demo project | — | ✅ |
| Vercel deployment guide | — | ✅ |
| 3 bonus page templates | — | ✅ |
| Lifetime updates | — | ✅ |

---

## FAQ

**Q: Does this work with Pages Router?**
The components work anywhere. API handlers target App Router. For Pages Router, copy the logic into `pages/api/`.

**Q: Works with plain PostgreSQL (without Supabase)?**
Yes — the SQL is standard PostgreSQL. Skip the RLS policies and handle auth in your own middleware.

**Q: Can I use a custom auth system?**
Yes. Pass `user_id` and `username` — the package doesn't care how you identify users.

**Q: Real-time updates?**
Enable Supabase Realtime on the comments table. Components accept a `refreshKey` prop for triggering reloads.

---

## License

MIT — use freely in any project, commercial or personal.

---

<p align="center">
  <b>Built by a developer who got tired of writing the same comments system for every project.</b><br>
  <sub>Questions? Open an issue. Need the full package? <a href="https://gumroad.com">Gumroad →</a></sub>
</p>
