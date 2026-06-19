/**
 * Generic Comments API Route Handler
 *
 * Usage:
 *   In your Next.js App Router at app/api/comments/route.ts:
 *
 *   import { createCommentsHandler } from 'nextjs-supabase-comments/api';
 *   export const { GET, POST } = createCommentsHandler({
 *     blockedKeywords: ['spam', 'badword'],
 *   });
 *
 * Or compose with your own logic:
 *   const handler = createCommentsHandler({ maxLength: 300 });
 *   export const POST = withAuth(handler.POST);
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { filterContent } from '@/lib/content-filter';
import { defaultConfig } from '@/lib/config';
import type { CommentsConfig } from '@/types';

type HandlerOptions = Partial<CommentsConfig> & {
  /** Called before creating a comment. Return false to reject. */
  beforeCreate?: (data: {
    post_id: string;
    user_id: string;
    username: string;
    content: string;
    parent_id: string | null;
    ip: string;
  }) => Promise<boolean> | boolean;
  /** Optional geo lookup (ip → { country, region }) */
  geoLookup?: (ip: string) => Promise<{ country?: string; region?: string } | null>;
  /** Optional ban check. Throw or return error to reject. */
  banCheck?: (user_id: string) => Promise<boolean>;
  /** Supabase table name for comments (default: 'comments') */
  tableName?: string;
};

export function createCommentsHandler(opts: HandlerOptions = {}) {
  const maxLength = opts.maxLength ?? defaultConfig.maxLength;
  const keywords = opts.blockedKeywords ?? defaultConfig.blockedKeywords;
  const table = opts.tableName ?? 'comments';

  // GET /api/comments?post_id=xxx
  async function GET(request: NextRequest) {
    const postId = request.nextUrl.searchParams.get('post_id');
    if (!postId) {
      return NextResponse.json({ error: 'Missing post_id' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('post_id', postId)
      .is('is_hidden', false)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Thread replies under their parents
    const topLevel = (data || []).filter((c) => !c.parent_id);
    const replies = (data || []).filter((c) => c.parent_id);
    const threaded = topLevel.map((t) => ({
      ...t,
      replies: replies.filter((r) => r.parent_id === t.id),
    }));

    return NextResponse.json(threaded);
  }

  // POST /api/comments
  async function POST(request: NextRequest) {
    const body = await request.json();
    const { content, user_id, username, parent_id, post_id } = body;
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!content || !user_id || !username || !post_id) {
      return NextResponse.json(
        { error: 'Missing required fields: content, user_id, username, post_id' },
        { status: 400 }
      );
    }

    if (content.length > maxLength) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 });
    }

    const contentCheck = filterContent(content, keywords);
    if (!contentCheck.allowed) {
      return NextResponse.json({ error: 'Content rejected by filter' }, { status: 400 });
    }

    // Ban check
    if (opts.banCheck) {
      const isBanned = await opts.banCheck(user_id);
      if (isBanned) {
        return NextResponse.json({ error: 'You have been banned from commenting.' }, { status: 403 });
      }
    }

    // Pre-create hook
    if (opts.beforeCreate) {
      const ok = await opts.beforeCreate({
        post_id,
        user_id,
        username,
        content: content.trim(),
        parent_id: parent_id || null,
        ip,
      });
      if (!ok) {
        return NextResponse.json({ error: 'Comment rejected' }, { status: 400 });
      }
    }

    // Geo lookup
    let country: string | undefined;
    let region: string | undefined;
    if (opts.geoLookup) {
      const geo = await opts.geoLookup(ip);
      if (geo) {
        country = geo.country;
        region = geo.region;
      }
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from(table)
      .insert({
        post_id,
        user_id,
        username,
        content: content.trim(),
        parent_id: parent_id || null,
        ip_address: ip,
        ip_country: country || null,
        ip_region: region || null,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment count via RPC
    await supabase.rpc('increment_comment_count', {
      target_id: post_id,
      tbl: 'posts',
    });

    return NextResponse.json(data, { status: 201 });
  }

  return { GET, POST };
}
