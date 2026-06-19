# I Got Tired of Building Comments Systems. So I Extracted Mine Into a Drop-in Package.

Every Next.js project needs comments. And every time, I found myself doing the same things:

- Designing a `comments` table with proper indexes and RLS policies
- Writing CRUD API routes with rate limiting
- Building the React UI — threaded display, optimistic likes, form validation
- Adding content filtering so spam doesn't hit production
- Setting up IP tracking and ban hooks

None of this is hard. It's just **three days of work I'd rather spend on features that matter.**

---

## What I Did

I run a Next.js + Supabase project called SheetRant. After building the comment system there, I extracted everything into a standalone package:

```
nextjs-supabase-comments/
├── supabase/migrations/     ← 1 SQL file, tables + RLS
├── src/
│   ├── components/          ← LikeButton, CommentForm, CommentList
│   ├── api/                 ← Comments handler, Likes handler
│   └── lib/                 ← Rate limiter, content filter, config
└── example/                 ← Working demo page
```

Built-in: threaded replies, optimistic like UI, IP rate limiting, content filtering, ban detection hooks, IP geo-location, full TypeScript, Tailwind CSS.

---

## Usage: 3 Steps

**Step 1** — Run the migration:
```bash
supabase db push
```

**Step 2** — Create API routes:
```ts
import { createCommentsHandler } from 'nextjs-supabase-comments';

const handler = createCommentsHandler({
  maxLength: 500,
  blockedKeywords: ['spam'],
});

export const GET = handler.GET;
export const POST = handler.POST;
```

**Step 3** — Drop components into your page:
```tsx
<LikeButton postId={post.id} userId={user.id} />
<CommentList postId={post.id} refreshKey={refresh} />
<CommentForm postId={post.id} userId={user.id} username={user.name} />
```

That's it. Comments and likes work.

---

## Free vs Complete

The full source code is open-source on GitHub, MIT license. Use it in any project for free.

👉 [GitHub: frozenwzx-wq/nextjs-supabase-comments](https://github.com/frozenwzx-wq/nextjs-supabase-comments)

I also put together a **Complete Package** with:
- Ready-to-run demo project (clone, `npm install`, works immediately)
- Step-by-step video walkthrough
- Vercel deployment guide
- 3 bonus page templates
- Lifetime updates

👉 [Get it on Gumroad — $29](https://frozenwave3.gumroad.com/l/aqdwe)

---

## Why Charge for Free Code?

I'm not charging for the code. I'm charging for the time I've already spent so you don't have to.

If you're comfortable reading source code and setting things up yourself — the GitHub repo has everything you need. If you want the guided experience with a ready-to-run project — that's what the $29 is for.

Either way, stop building comments from scratch.

---

*Tech stack: Next.js 14+ / Supabase / TypeScript / Tailwind CSS / React*
