import type { CalculatorCategory } from '@/types/calculator';

export type HomeCalculatorCard = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: CalculatorCategory;
  icon: string;
  order: number;
};
