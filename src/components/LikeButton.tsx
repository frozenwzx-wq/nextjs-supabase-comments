'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  /** The ID of the post/resource to like */
  postId: string;
  /** Current user ID for tracking like state */
  userId: string;
  /** API base path (default: '/api/likes') */
  apiPath?: string;
  /** Custom class for the button */
  className?: string;
  /** Custom class when liked */
  likedClassName?: string;
}

export function LikeButton({
  postId,
  userId,
  apiPath = '/api/likes',
  className,
  likedClassName,
}: LikeButtonProps) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiPath}?post_id=${postId}&user_id=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count || 0);
        setLiked(d.liked || false);
      })
      .catch(() => {});
  }, [postId, userId, apiPath]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (liked) {
        await fetch(`${apiPath}?post_id=${postId}&user_id=${userId}`, {
          method: 'DELETE',
        });
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        const res = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: postId, user_id: userId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setLiked(true);
        if (data.count != null) setCount(data.count);
        else setCount((c) => c + 1);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  const base = `inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-md border transition-colors ${
    loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
  }`;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={
        liked
          ? `${base} border-red-300 bg-red-50 text-red-600 ${likedClassName ?? ''}`
          : `${base} border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-600 ${className ?? ''}`
      }
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      {count > 0 && <span className="text-xs font-medium">{count}</span>}
    </button>
  );
}
