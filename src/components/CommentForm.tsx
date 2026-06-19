'use client';

import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  userId: string;
  username: string;
  /** API base path (default: '/api/comments') */
  apiPath?: string;
  /** Max content length (default: 500) */
  maxLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Called after successful submit */
  onCommentPosted?: () => void;
  className?: string;
}

export function CommentForm({
  postId,
  userId,
  username,
  apiPath = '/api/comments',
  maxLength = 500,
  placeholder,
  onCommentPosted,
  className,
}: CommentFormProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId,
          username,
          content: text.trim(),
        }),
      });
      if (res.ok) {
        setText('');
        onCommentPosted?.();
      }
    } catch {
      // silently fail
    }
    setSubmitting(false);
  };

  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder ?? `Reply as ${username}...`}
        maxLength={maxLength}
        className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={submit}
        disabled={submitting || !text.trim()}
        className="px-4 h-9 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        {submitting ? '...' : 'Reply'}
      </button>
    </div>
  );
}
