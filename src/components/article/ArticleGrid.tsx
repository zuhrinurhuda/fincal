import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { ArticleListCard } from '@/types/article';
import { ARTICLE_CATEGORIES, CATEGORY_COLORS, type ArticleCategory } from '@/constants/article';
import { articleIndexHref } from '@/utils/articleUrls';
import { trackSearchFilter, trackCategoryFilter } from '@/lib/analytics';

type SortOption = 'terbaru' | 'terlama' | 'az' | 'za';

const AD_INTERVAL = 4;

interface Props {
  posts: ArticleListCard[];
  adClient: string;
  adSlotInFeed: string;
  adsEnabled: boolean;
}

function InFeedAd({ adClient, adSlot }: Readonly<{ adClient: string; adSlot: string }>) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      const w = globalThis as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // AdSense not ready
    }
  }, []);

  return (
    <div
      className="flex min-h-[250px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-full-width-responsive="true"
      />
    </div>
  );
}

function parseInitialFromSearch(search: string): {
  categories: Set<ArticleCategory>;
  searchQuery: string;
} {
  const params = new URLSearchParams(search);
  const cat = params.get('kategori');
  const tag = params.get('tag')?.trim() ?? '';
  const categories = new Set<ArticleCategory>();
  if (cat && (ARTICLE_CATEGORIES as readonly string[]).includes(cat)) {
    categories.add(cat as ArticleCategory);
  }
  return { categories, searchQuery: tag };
}

function buildListPath(categories: Set<ArticleCategory>, search: string): string {
  const params = new URLSearchParams();
  if (categories.size === 1) {
    params.set('kategori', [...categories][0]);
  }
  const t = search.trim();
  if (t) params.set('tag', t);
  const q = params.toString();
  return q ? `/artikel/?${q}` : '/artikel/';
}

export default function ArticleGrid({
  posts,
  adClient,
  adSlotInFeed,
  adsEnabled,
}: Readonly<Props>) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<ArticleCategory>>(new Set());
  const [sort, setSort] = useState<SortOption>('terbaru');
  const [urlHydrated, setUrlHydrated] = useState(false);

  const categories = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return ARTICLE_CATEGORIES.filter((cat) => present.has(cat));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = posts;

    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.metaDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.size > 0) {
      result = result.filter((p) => selectedCategories.has(p.category));
    }

    switch (sort) {
      case 'terlama':
        result = [...result].sort(
          (a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        );
        break;
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'id'));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title, 'id'));
        break;
      case 'terbaru':
      default:
        result = [...result].sort((a, b) => {
          const f = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          if (f !== 0) return f;
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        });
        break;
    }

    return result;
  }, [posts, search, selectedCategories, sort]);

  useEffect(() => {
    const { categories: c, searchQuery } = parseInitialFromSearch(globalThis.location.search);
    setSelectedCategories(c);
    setSearch(searchQuery);
    setUrlHydrated(true);
  }, []);

  useEffect(() => {
    if (!urlHydrated) return;
    const next = buildListPath(selectedCategories, search);
    const current = `${globalThis.location.pathname}${globalThis.location.search}`;
    if (next !== current) {
      globalThis.history.replaceState(null, '', next);
    }
  }, [search, selectedCategories, urlHydrated]);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const trackSearch = useCallback((query: string, count: number) => {
    clearTimeout(searchTimerRef.current);
    if (!query.trim()) return;
    searchTimerRef.current = setTimeout(() => {
      trackSearchFilter(query, count);
    }, 800);
  }, []);

  useEffect(() => {
    trackSearch(search, filtered.length);
  }, [search, filtered.length, trackSearch]);

  function toggleCategory(cat: ArticleCategory) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
        trackCategoryFilter(cat);
      }
      return next;
    });
  }

  function resetFilters() {
    setSearch('');
    setSelectedCategories(new Set());
    setSort('terbaru');
  }

  const listItems: (ArticleListCard | { type: 'ad'; key: string })[] = [];
  let cardCount = 0;
  for (const post of filtered) {
    listItems.push(post);
    cardCount++;
    if (adsEnabled && cardCount % AD_INTERVAL === 0) {
      listItems.push({ type: 'ad', key: `ad-${cardCount}` });
    }
  }

  if (posts.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada artikel. Segera hadir.</p>
    );
  }

  return (
    <div>
      <div className="sticky top-14 z-40 -mx-4 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-6xl py-3">
          <div className="relative">
            <svg
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel, topik, atau tag..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-brand-400"
              aria-label="Cari artikel"
            />
          </div>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <fieldset className="min-w-0">
              <legend className="sr-only">Filter kategori</legend>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const active = selectedCategories.has(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        active
                          ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      aria-pressed={active}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              aria-label="Urutkan artikel"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="az">Judul A — Z</option>
              <option value="za">Judul Z — A</option>
            </select>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {filtered.length} artikel ditemukan
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 space-y-6">
          {listItems.map((item) => {
            if ('type' in item && item.type === 'ad') {
              return (
                <div key={item.key}>
                  <InFeedAd adClient={adClient} adSlot={adSlotInFeed} />
                </div>
              );
            }

            const post = item as ArticleListCard;
            return (
              <article
                key={post.id}
                className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-600"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[post.category]}`}
                  >
                    {post.category}
                  </span>
                  <time
                    dateTime={post.publishDate}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {new Date(post.publishDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                <a
                  href={`/artikel/${post.id}/`}
                  className="block min-w-0 outline-offset-2 focus-visible:rounded-md"
                >
                  <h2 className="text-base font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-400">
                    {post.title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {post.metaDescription}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                    Baca selengkapnya
                    <svg
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </a>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 4).map((tag) => (
                      <a
                        key={tag}
                        href={articleIndexHref({ kategori: post.category, tag })}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada artikel yang cocok.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 cursor-pointer text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
