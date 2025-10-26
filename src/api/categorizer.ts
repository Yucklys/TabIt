import { type TabInfo } from './tabs.ts';

export interface CategorizedTab extends TabInfo {
  category: string;
  confidence: number;
}