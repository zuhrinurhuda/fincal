export const ARTICLE_CATEGORIES = [
  'Kredit',
  'Investasi',
  'Pajak & Zakat',
  'Panduan Keuangan',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Kredit: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300',
  Investasi: 'bg-invest-50 text-invest-700 dark:bg-invest-950/50 dark:text-invest-300',
  'Pajak & Zakat': 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  'Panduan Keuangan': 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
};
