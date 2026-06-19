-- ============================================================
-- Comments + Likes System — Reusable Supabase Schema
-- Drop this into any Next.js + Supabase project
-- ============================================================

-- 1. Comments table
CREATE TABLE IF NOT EXISTS comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       TEXT NOT NULL,
  user_id       TEXT NOT NULL,
  username      TEXT NOT NULL,
  parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  is_hidden     BOOLEAN DEFAULT false,
  ip_address    TEXT,
  ip_country    TEXT,
  ip_region     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- 2. Likes table
CREATE TABLE IF NOT EXISTS likes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      TEXT NOT NULL,
  user_id      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);

-- 3. Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-hidden comments
CREATE POLICY "Anyone can read visible comments" ON comments
  FOR SELECT USING (is_hidden = false);

-- Anyone can create comments
CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Anyone can read likes
CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (true);

-- Anyone can create likes
CREATE POLICY "Anyone can create likes" ON likes FOR INSERT WITH CHECK (true);

-- Anyone can delete their own likes
CREATE POLICY "Anyone can delete own likes" ON likes FOR DELETE USING (true);

-- 4. RPC: Increment comment count on parent record
-- Usage: Call this after inserting a comment to keep counts in sync
CREATE OR REPLACE FUNCTION increment_comment_count(target_id TEXT, tbl TEXT)
RETURNS void AS $$
BEGIN
  IF tbl = 'posts' THEN
    EXECUTE format('UPDATE %I SET comment_count = COALESCE(comment_count, 0) + 1 WHERE id = $1', tbl)
    USING target_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
