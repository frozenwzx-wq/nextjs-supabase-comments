'use client';
/**
 * Minimal example: Comments + Likes on a single page.
 * Drop this into your Next.js App Router project to test the system.
 *
 * Prerequisites:
 *   1. Run the Supabase migration: supabase/migrations/00001_comments_likes.sql
 *   2. Set up your API routes (see README)
 *   3. Update the postId and userId below
 */

import { useState, useCallback } from 'react';
import { CommentList, CommentForm, LikeButton } from 'nextjs-supabase-comments';

// Simulated user — replace with your own auth
const USER = {
  id: 'user-abc-123',
  name: 'DemoUser',
};

// Simulated post — replace with your own resource
const POST_ID = 'post-demo-001';

export default function ExamplePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentPosted = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">Comments Demo</h1>

      {/* Like button */}
      <LikeButton postId={POST_ID} userId={USER.id} />

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500">COMMENTS</h2>
        <CommentList postId={POST_ID} refreshKey={refreshKey} />
        <CommentForm
          postId={POST_ID}
          userId={USER.id}
          username={USER.name}
          onCommentPosted={handleCommentPosted}
        />
      </section>
    </main>
  );
}
