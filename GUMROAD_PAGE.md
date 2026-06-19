# Gumroad 产品页文案

---

## 标题

**Next.js Comments & Likes System — Drop-in Component Pack**

---

## 副标题（出现在标题下方）

Add threaded comments + likes to any Next.js project in 3 minutes. One migration, 3 components, done. No monthly subscription, lifetime access.

---

## 封面图建议

放一张 GIF：一个页面从空白 → 出现评论区 → 有人评论、点赞的完整交互过程。10秒以内，循环播放。

---

## 产品描述正文

### Stop writing the same comment system for every project.

You're building a Next.js app. You need comments. Should be simple, right?

But then you realize you need:
- Database schema (did you remember the indexes? the RLS policies?)
- CRUD API routes (GET comments, POST comment, threaded replies...)
- Frontend components (loading states? optimistic UI for likes?)
- Rate limiting (or one bot fills your DB with spam overnight)
- Content filtering (or your client's blog gets NSFW in the comments)

**Three days later** you're still tweaking SQL and writing CSS for the reply button. And the feature you actually wanted to build? Still untouched.

This package solves that. Completely.

---

### What You Get

A complete, production-tested comments + likes system extracted from a real product with thousands of users. Copy in, configure, ship.

**Database (1 file)**
- `supabase/migrations/` — One SQL file. Creates `comments` and `likes` tables with all indexes, constraints, and Row Level Security policies. Run once, done.

**API Handlers (2 files)**
- Comments handler — `GET` (list threaded), `POST` (create with IP tracking, geo lookup, content filtering, ban detection)
- Likes handler — `GET` (count), `POST` (toggle), `DELETE` (unlike) — all with rate limiting

**React Components (3 files)**
- `CommentList` — Threaded display with configurable avatars and relative timestamps
- `CommentForm` — Text input with character limit, auto-focus
- `LikeButton` — Optimistic toggle with animated states

**Utilities (4 files)**
- Rate limiter (in-memory, IP-based, configurable)
- Content filter (keyword blocklist, extensible)
- TypeScript types (full coverage)
- Supabase client helper

**Plus**
- Working example page (see it running in 2 minutes)
- Tailwind CSS — clean design, easy to customize
- Full TypeScript support

---

### How It Works

```
1. Run 1 SQL migration    →  Tables + RLS ready
2. Copy 2 API route files  →  Backend done
3. Drop 3 components       →  Frontend done
```

That's literally it. No config files, no complex setup, no vendor lock-in. The code is yours — modify it however you want.

---

### Built for the Real World

This isn't a tutorial project. It's extracted from a production application handling real users. Every piece has been battle-tested:

- **Threaded replies** — Comments can nest under comments, unlimited depth
- **Optimistic UI** — Like button updates instantly, rolls back on failure
- **Rate limiting** — Configurable per-IP limits to prevent abuse
- **Content filtering** — Block specific keywords, plug in your own filter logic
- **IP geo-tracking** — Optional country/region logging for moderation
- **Ban system hook** — Integrate with your existing ban/block logic
- **RLS baked in** — Row Level Security policies in the migration, not an afterthought

---

### Who Is This For?

- **Solo founders** shipping an MVP — don't spend 3 days on comments
- **Freelancers** — deliver faster, bill the same, keep the difference
- **Agencies** — standardize comments across all client projects
- **Developers learning Next.js** — study real production patterns, not toy examples

---

### Pricing

<div style="text-align: center; font-size: 24px; margin: 40px 0;">
  <span style="text-decoration: line-through; color: #999;">$49</span>
  <span style="font-size: 48px; font-weight: bold; color: #000; margin: 0 12px;">$29</span>
  <span style="color: #666;">one-time payment</span>
</div>

- Lifetime access to all current files
- All future updates included
- $29 once. Not per month. Not per project. Once.

---

### FAQ

**Q: What tech stack does this require?**
Next.js 14+ (App Router) + Supabase. Uses TypeScript and Tailwind CSS. The components work with Pages Router too — just adapt the API routes.

**Q: Will this work with my existing auth system?**
Yes. You pass `userId` and `username` as props. The package doesn't care if you use Auth.js, Clerk, Supabase Auth, or a custom solution.

**Q: Can I use this in multiple projects?**
Absolutely. One purchase, unlimited projects — personal or commercial.

**Q: What if I don't use Supabase?**
The SQL is standard PostgreSQL. Skip the RLS policies and hook up your own database client. The component logic works with any backend.

**Q: Do you offer refunds?**
Yes. If it doesn't save you at least 3 hours of work, email me within 14 days and I'll refund you. No questions asked.

**Q: Will this work with Next.js 15 / future versions?**
Yes. The package uses standard App Router patterns. I use this in my own projects and update it whenever the Next.js team ships breaking changes.

---

### 30-Day Money-Back Guarantee

If this package doesn't save you time, I don't want your money. Try it, use it in a real project. If it doesn't work for you, email me within 30 days for a full refund.

---

### About the Creator

I'm a full-stack developer who builds Next.js products for a living. I got tired of writing the same comment system for every project, so I extracted my production code into a reusable package. This is the exact code I use in my own SaaS products. I stand behind it.

---

## 产品截图建议

需要准备 7 张图：

1. **封面 GIF** — 产品运行效果（评论区完整交互过程）
2. **目录结构** — 展示文件有多简洁（那一棵文件树截图）
3. **代码片段** — 3步接入的代码（README里那段）
4. **数据库表结构** — Supabase 面板截图
5. **前端效果** — 评论区展开、有回复的完整截图
6. **API 响应** — Postman 或浏览器 Network 面板截图
7. **移动端适配** — 手机上评论区显示效果

---

## 上架后宣传渠道

| 渠道 | 内容 | 目标 |
|------|------|------|
| **掘金** | "我做了个评论组件，3天变3分钟" | 技术文章引流 |
| **V2EX** | "分享一个Next.js评论组件包" | 程序员社区 |
| **Twitter/X** | 发 GIF + 链接 | 海外开发者 |
| **Reddit** r/nextjs | Show-off Saturday | 海外开发者 |
| **GitHub** | 建开源 repo，README 引流 | SEO + 信任 |
| **Dev.to** | 英文版技术文章 | 海外SEO |
