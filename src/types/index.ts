export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  parent_id: string | null;
  content: string;
  is_hidden: boolean;
  ip_address?: string;
  ip_country?: string;
  ip_region?: string;
  created_at: string;
  replies?: Comment[];
}

export interface LikeState {
  count: number;
  liked: boolean;
}

export interface CommentsConfig {
  /** Max comment content length (default: 500) */
  maxLength: number;
  /** Content filter keywords — comments containing these are rejected */
  blockedKeywords: string[];
  /** Rate limit: max likes per user/IP per window */
  likeRateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}
