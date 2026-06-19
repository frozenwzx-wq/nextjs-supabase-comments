'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/types';

interface CommentListProps {
  postId: string;
  /** API base path (default: '/api/comments') */
  apiPath?: string;
  /** Refresh trigger — increment to reload */
  refreshKey?: number;
  /** Show loading skeleton */
  loading?: boolean;
  /** Custom empty state */
  emptyText?: string;
  /** Custom loading text */
  loadingText?: string;
  /** Avatar color generator — receives userId, returns hex color */
  avatarColor?: (userId: string) => string;
  /** Format timestamp */
  formatTime?: (iso: string) => string;
  className?: string;
}

function defaultColor(uid: string): string {
  const colors = [
    '#E74C3C', '#8E44AD', '#27AE60', '#2980B9',
    '#F39C12', '#1ABC9C', '#E67E22', '#3498DB',
  ];
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function defaultTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function CommentList({
  postId,
  apiPath = '/api/comments',
  refreshKey = 0,
  loading: externalLoading,
  emptyText = 'No comments yet.',
  loadingText = 'Loading...',
  avatarColor = defaultColor,
  formatTime = defaultTime,
  className,
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiPath}?post_id=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId, apiPath, refreshKey]);

  if (loading || externalLoading) {
    return <div className="text-sm text-gray-400">{loadingText}</div>;
  }

  if (comments.length === 0) {
    return <div className="text-sm text-gray-400">{emptyText}</div>;
  }

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      {comments.map((c) => (
        <div key={c.id}>
          {/* Top-level comment */}
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: avatarColor(c.user_id) }}
            >
              <span className="text-[10px] text-white font-bold">
                {c.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs">
                <span className="font-semibold text-gray-600">{c.username}</span>
                <span className="text-gray-400 ml-2">{formatTime(c.created_at)}</span>
              </div>
              <div className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                {c.content}
              </div>
            </div>
          </div>

          {/* Replies */}
          {c.replies?.map((r) => (
            <div key={r.id} className="ml-8 mt-2 flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: avatarColor(r.user_id) }}
              >
                <span className="text-[9px] text-white font-bold">
                  {r.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs">
                  <span className="font-semibold text-gray-600">{r.username}</span>
                  <span className="text-gray-400 ml-2">{formatTime(r.created_at)}</span>
                </div>
                <div className="text-sm text-gray-700 mt-0.5">{r.content}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
