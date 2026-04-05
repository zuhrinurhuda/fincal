import type { ArticleCategory } from '@/constants/article';

/** Serializable article row for client-side listing (e.g. ArticleGrid). */
export type ArticleListCard = {
  id: string;
  title: string;
  metaDescription: string;
  category: ArticleCategory;
  tags: string[];
  publishDate: string;
  featured: boolean;
};
