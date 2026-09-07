import type { Schema } from '../amplify/data/resource';

export const CATEGORIES = ['NOTICE', 'EVENT', 'LOST_FOUND', 'STUDY_GROUP'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  NOTICE: 'Notice',
  EVENT: 'Event',
  LOST_FOUND: 'Lost & found',
  STUDY_GROUP: 'Study group',
};

export type Post = Schema['Post']['type'];
export type NewPost = Schema['Post']['createType'];
