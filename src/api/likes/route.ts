/**
 * Generic Likes API Route Handler
 *
 * Usage:
 *   import { createLikesHandler } from 'nextjs-supabase-comments/api';
 *   export const { GET, POST, DELETE } = createLikesHandler();
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limiter';
import { defaultConfig } from '@/lib/config';
import type { CommentsConfig } from '@/types';

type HandlerOptions = {
  likeRateLimit?: CommentsConfig['likeRateLimit'];
  /** Supabase table name for likes (default: 'likes') */
  tableName?: string;
};

export function createLikesHandler(opts: HandlerOptions = {}) {
  const rateLimit = opts.likeRateLimit ?? defaultConfig.likeRateLimit;
  const table = opts.tableName ?? 'likes';

  function getIp(request: NextRequest): string {
    return request.headers.get('x-forwarded-for') || 'unknown';
  }

  // GET /api/likes?post_id=xxx&user_id=yyy
  async function GET(request: NextRequest) {
    const postId = request.nextUrl.searchParams.get('post_id');
    const userId = request.nextUrl.searchParams.get('user_id');

    if (!postId) {
      return NextResponse.json({ error: 'Missing post_id' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    let liked = false;
    if (userId) {
      const { data } = await supabase
        .from(table)
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();
      liked = !!data;
    }

    return NextResponse.json({ count: count || 0, liked });
  }

  // POST /api/likes
  async function POST(request: NextRequest) {
    const body = await request.json();
    const { post_id, user_id } = body;

    if (!post_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing post_id or user_id' },
        { status: 400 }
      );
    }

    const ip = getIp(request);
    const rateCheck = checkRateLimit(
      `like:${ip}`,
      rateLimit.maxRequests,
      rateLimit.windowMs
    );
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many likes. Please wait.' },
        { status: 429 }
      );
    }

    const supabase = createServerClient();

    // Idempotent: already liked
    const { data: existing } = await supabase
      .from(table)
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ liked: true, count: null }, { status: 200 });
    }

    const { error } = await supabase
      .from(table)
      .insert({ post_id, user_id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post_id);

    return NextResponse.json({ liked: true, count: count || 1 }, { status: 201 });
  }

  // DELETE /api/likes?post_id=xxx&user_id=yyy
  async function DELETE(request: NextRequest) {
    const postId = request.nextUrl.searchParams.get('post_id');
    const userId = request.nextUrl.searchParams.get('user_id');

    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'Missing post_id or user_id' },
        { status: 400 }
      );
    }

    const ip = getIp(request);
    const rateCheck = checkRateLimit(
      `like:${ip}`,
      rateLimit.maxRequests,
      rateLimit.windowMs
    );
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many likes. Please wait.' },
        { status: 429 }
      );
    }

    const supabase = createServerClient();

    await supabase
      .from(table)
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({ liked: false, count: count || 0 });
  }

  return { GET, POST, DELETE };
}
