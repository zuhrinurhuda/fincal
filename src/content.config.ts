import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { ARTICLE_CATEGORIES } from '@/constants/article';

const article = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/article' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Tim FinCal'),
    category: z.enum(ARTICLE_CATEGORIES),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    relatedCalculators: z.array(z.string()).default([]),
    /** Article entry ids (file stems); shown first, then auto-related fills up to four. */
    relatedArticles: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { article };
