import type { ArticleCategory } from '@/constants/article';

export function articleIndexHref(opts: {
  kategori: ArticleCategory | null;
  tag: string | null;
}): string {
  const params = new URLSearchParams();
  if (opts.kategori) params.set('kategori', opts.kategori);
  if (opts.tag) params.set('tag', opts.tag);
  const q = params.toString();
  return q ? `/artikel/?${q}` : '/artikel/';
}
