import { useState, useMemo, useEffect, useRef, useCallback, type ReactNode } from 'react';
import type { HomeCalculatorCard } from '@/types/home';
import type { CalculatorCategory } from '@/types/calculator';
import { trackSearchFilter, trackCategoryFilter } from '@/lib/analytics';

type SortOption = 'populer' | 'az' | 'za';

interface Props {
  calculators: HomeCalculatorCard[];
  adClient: string;
  adSlotInFeed: string;
}

const ALL_CATEGORIES: CalculatorCategory[] = ['Kredit', 'Investasi', 'Pajak & Zakat'];
const AD_INTERVAL = 4;

const ICONS: Record<string, ReactNode> = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
    />
  ),
  receipt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
    />
  ),
  bike: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  car: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11M3 11v5a1 1 0 001 1h1m16-6v5a1 1 0 01-1 1h-1M3 11h18"
    />
  ),
  smartphone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 18h.01M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z"
    />
  ),
  store: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 3h18l-2 9H5L3 3zm0 0l-1 9m20-9l1 9M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  ),
  'trending-up': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M23 6l-9.5 9.5-5-5L1 18M23 6h-6m6 0v6"
    />
  ),
  'bar-chart': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 20V10M18 20V4M6 20v-4"
    />
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    />
  ),
  rocket: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3m3 3a22 22 0 005-13.5A22 22 0 009 7m3 8l-3-3m0 0a22 22 0 00-4 7.5"
    />
  ),
};

const CATEGORY_COLORS: Record<CalculatorCategory, string> = {
  Kredit: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  Investasi: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  'Pajak & Zakat': 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
};

const CATEGORY_ICON_COLORS: Record<CalculatorCategory, string> = {
  Kredit: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  Investasi: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
  'Pajak & Zakat': 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
};

function InFeedAd({ adClient, adSlot }: Readonly<{ adClient: string; adSlot: string }>) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
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

export default function CalculatorGrid({
  calculators,
  adClient,
  adSlotInFeed,
}: Readonly<Props>) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<CalculatorCategory>>(new Set());
  const [sort, setSort] = useState<SortOption>('populer');

  const categories = useMemo(() => {
    const present = new Set(calculators.map((c) => c.category));
    return ALL_CATEGORIES.filter((cat) => present.has(cat));
  }, [calculators]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = calculators;

    if (q) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.size > 0) {
      result = result.filter((c) => selectedCategories.has(c.category));
    }

    switch (sort) {
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'id'));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title, 'id'));
        break;
      case 'populer':
      default:
        result = [...result].sort((a, b) => a.order - b.order);
        break;
    }

    return result;
  }, [calculators, search, selectedCategories, sort]);

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

  function toggleCategory(cat: CalculatorCategory) {
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

  const gridItems: (HomeCalculatorCard | { type: 'ad'; key: string })[] = [];
  let cardCount = 0;
  for (const calc of filtered) {
    gridItems.push(calc);
    cardCount++;
    if (cardCount % AD_INTERVAL === 0) {
      gridItems.push({ type: 'ad', key: `ad-${cardCount}` });
    }
  }

  return (
    <div>
      {/* Sticky search + filter bar */}
      <div className="sticky top-14 z-40 -mx-4 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-6xl py-3">
          {/* Search input */}
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
              placeholder="Cari kalkulator..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400"
              aria-label="Cari kalkulator"
            />
          </div>

          {/* Chips + sort row */}
          <div className="mt-2.5 flex items-center justify-between gap-3">
            {/* Category chips */}
            <fieldset className="min-w-0">
              <legend className="sr-only">Filter kategori</legend>
              <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const active = selectedCategories.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
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

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              aria-label="Urutkan"
            >
              <option value="populer">Populer</option>
              <option value="az">A — Z</option>
              <option value="za">Z — A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count (screen reader live region) */}
      <p className="sr-only" aria-live="polite" role="status">
        {filtered.length} kalkulator ditemukan
      </p>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item) => {
            if ('type' in item && item.type === 'ad') {
              return (
                <div key={item.key} className="col-span-full">
                  <InFeedAd adClient={adClient} adSlot={adSlotInFeed} />
                </div>
              );
            }

            const calc = item as HomeCalculatorCard;
            return (
              <a
                key={calc.slug}
                href={`/kalkulator/${calc.slug}`}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${CATEGORY_ICON_COLORS[calc.category]}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      {ICONS[calc.icon] ?? ICONS['trending-up']}
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {calc.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[calc.category]}`}
                    >
                      {calc.category}
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {calc.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  Hitung sekarang
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
            );
          })}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tidak ada kalkulator ditemukan.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategories(new Set());
            }}
            className="mt-2 cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
