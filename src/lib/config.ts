// Default config — import and override in your project
import type { CommentsConfig } from '@/types';

export const defaultConfig: CommentsConfig = {
  maxLength: 500,
  blockedKeywords: [],
  likeRateLimit: {
    maxRequests: 4,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
};
