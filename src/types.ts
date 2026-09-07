export const CATEGORIES = ['NOTICE', 'EVENT', 'LOST_FOUND', 'STUDY_GROUP'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  NOTICE: 'Notice',
  EVENT: 'Event',
  LOST_FOUND: 'Lost & found',
  STUDY_GROUP: 'Study group',
};

// Module 1 replaces these two types with the ones generated from the Amplify data schema.
export type Post = {
  id: string;
  title: string;
  body?: string | null;
  category?: Category | null;
  link?: string | null;
  author?: string | null;
  createdAt: string;
};

export type NewPost = {
  title: string;
  body?: string;
  category?: Category;
  link?: string;
  author?: string;
};
