import type { CollectionEntry } from 'astro:content';

const MAX_RELATED = 4;

type ArticleEntry = CollectionEntry<'article'>;

/**
 * Hybrid related articles: explicit frontmatter order first, then auto-rank by
 * same category, shared tags (case-insensitive), then recency.
 */
export function getRelatedArticle(
  all: ArticleEntry[],
  current: ArticleEntry,
  explicitSlugs: string[]
): ArticleEntry[] {
  const byId = new Map(all.map((p) => [p.id, p]));
  const result: ArticleEntry[] = [];
  const seen = new Set<string>();

  for (const slug of explicitSlugs) {
    if (slug === current.id || seen.has(slug)) continue;
    const post = byId.get(slug);
    if (post) {
      result.push(post);
      seen.add(slug);
    }
    if (result.length >= MAX_RELATED) return result;
  }

  const currentTags = new Set(current.data.tags.map((t) => t.toLowerCase()));

  const scored = all
    .filter((p) => p.id !== current.id && !seen.has(p.id))
    .map((p) => {
      let score = 0;
      if (p.data.category === current.data.category) score += 100;
      score += p.data.tags.filter((t) => currentTags.has(t.toLowerCase())).length * 10;
      return { p, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.p.data.publishDate.getTime() - a.p.data.publishDate.getTime();
    });

  for (const { p } of scored) {
    if (result.length >= MAX_RELATED) break;
    result.push(p);
  }

  return result;
}
