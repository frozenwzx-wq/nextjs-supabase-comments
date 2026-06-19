// Components
export { LikeButton } from './components/LikeButton';
export { CommentForm } from './components/CommentForm';
export { CommentList } from './components/CommentList';

// API handlers
export { createCommentsHandler } from './api/comments/route';
export { createLikesHandler } from './api/likes/route';

// Utilities
export { checkRateLimit } from './lib/rate-limiter';
export { filterContent } from './lib/content-filter';
export { defaultConfig } from './lib/config';

// Types
export type { Comment, LikeState, CommentsConfig } from './types';
