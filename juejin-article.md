# 每个项目都要写一遍评论区？我把它抽出来开源了，3分钟接入

不知道你有没有这种感觉——每次开新项目，评论区就像那个"又得重新做一遍"的东西。

数据库 schema 要设计、CRUD API 要写、前端组件要画、限流要加、内容过滤要配...这些东西技术上不难，但就是**纯花时间**。一个评论区从零到上线，再怎么熟练也得两三天。

做 SheetRant 的时候我又经历了一遍这个过程。做完之后我想：与其每个项目复制粘贴改半天，不如直接抽成一个通用包。

---

## 拆出来的东西

```
nextjs-supabase-comments/
├── supabase/migrations/     ← 1条SQL，建表+RLS一步到位
├── src/
│   ├── components/          ← 3个React组件，直接放页面
│   ├── api/                 ← 2个API route handler
│   ├── lib/                 ← 限流器、内容过滤器、配置
│   └── types/               ← 全TypeScript类型
├── example/                 ← 可跑的示例页面
└── package.json
```

**内置功能：**
- 嵌套回复（无限层级）
- 点赞/取消（乐观UI更新）
- IP级别限流（可配置）
- 内容过滤（自定义关键词黑名单）
- RLS 行级安全（数据库层面）
- 封禁检测钩子 / IP地理定位（可选）
- 全 TypeScript + Tailwind CSS

---

## 怎么用

### 1. 跑迁移
```bash
supabase db push
```

### 2. 创建 API 路由
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

### 3. 组件扔进页面
```tsx
<LikeButton postId={post.id} userId={user.id} />
<CommentList postId={post.id} refreshKey={refresh} />
<CommentForm postId={post.id} userId={user.id} username={user.name} />
```

**完了，评论和点赞就有了。**

---

## 开源，但不止开源

GitHub 上代码完全开源，MIT 协议，随便用。

但如果想要**可直接跑的完整项目 + 部署指南 + 视频教程 + 后续更新**，我打包了一个完整版放在 Gumroad，$29 终身。

[👉 Gumroad 链接](https://frozenwave3.gumroad.com/l/aqdwe)

其实算一笔账：一个开发者写一套评论区至少两三天，$29 省三天，时薪算下来不到一块钱。对我自己来说，这就是"做一次，卖了然后不用再管"的东西——符合我追求的"少投入、长尾收"的副业模式。

---

## 写在最后

这个包是我"程序员副业实验"的第一个产品。目标不是暴富，是验证一句话——**你写过的代码，换个形式，可能就是别人愿意付费的东西。**

如果你也是 Next.js + Supabase 技术栈，试试看，有问题直接提 issue。如果觉得有用，$29 买一份就当支持我继续做下去。

---

*技术栈：Next.js 14+ / Supabase / TypeScript / Tailwind CSS / React*
