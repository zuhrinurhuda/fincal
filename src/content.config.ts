import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/artikel' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Tim FinCal'),
    category: z.enum(['Kredit', 'Investasi', 'Pajak & Zakat', 'Panduan Keuangan']),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    relatedCalculators: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { artikel };
