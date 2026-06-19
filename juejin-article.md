# 每个项目都要写评论区，我把它抽出来了，直接拿去用

每次开新项目，评论区都要重写一遍。

数据库建表、写CRUD、画前端、加限流、做过滤……技术上没啥难度，就是耗时间。一套下来两天起步。

前阵子做项目又写了一遍，烦了。干脆把代码抽出来做成通用包，以后不管做啥项目，三分钟搞定。

---

## 拆出来这些

```
nextjs-supabase-comments/
├── supabase/migrations/     ← 1条SQL，建表+RLS
├── src/
│   ├── components/          ← LikeButton / CommentForm / CommentList
│   ├── api/                 ← 评论和点赞的API handler
│   ├── lib/                 ← 限流器、内容过滤、配置
│   └── types/               ← TypeScript类型
├── example/                 ← 示例页面
```

内置了嵌套回复、点赞、IP限流、关键词过滤、RLS、封禁检测。全 TypeScript，Tailwind CSS。

---

## 接入三步

跑迁移：
```bash
supabase db push
```

加API路由：
```ts
import { createCommentsHandler } from 'nextjs-supabase-comments';

const handler = createCommentsHandler({ maxLength: 500 });

export const GET = handler.GET;
export const POST = handler.POST;
```

页面里放组件：
```tsx
<LikeButton postId={post.id} userId={user.id} />
<CommentList postId={post.id} refreshKey={refresh} />
<CommentForm postId={post.id} userId={user.id} username={user.name} />
```

就这些，评论和点赞就能用了。

---

## 免费拿，懒得配也有现成的

GitHub 开源，MIT 协议，随便用。

[github.com/frozenwzx-wq/nextjs-supabase-comments](https://github.com/frozenwzx-wq/nextjs-supabase-comments)

实在不想折腾 GitHub、不会配环境的，闲鱼搜「Next.js评论区」，19.9 打包好了，下完就能跑。

---

周末花了两天把这个包整理出来。后面做项目省的时间，早就赚回来了。有人用得上就行。

有问题 GitHub 提 issue。
