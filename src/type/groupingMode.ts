import { oneTimeGrouping } from '../mode/oneTime';
import { smartGrouping } from '../mode/smart';
import { aggressiveGrouping } from '../mode/aggressive';

export type GroupingMode = 'oneTime' | 'smart' | 'aggressive';

/**
 * Mode interface with name and grouping function
 */
export interface Mode {
  id: GroupingMode;
  name: string;
  description?: string;
  groupingFunction: () => Promise<void>;
}

/**
 * Mode registry type
 */
export type ModeRegistry = {
  [K in GroupingMode]: Mode;
};

/**
 * Mode registry with all available modes
 */
export const MODES: ModeRegistry = {
  oneTime: {
    id: 'oneTime',
    name: 'One-time',
    description: 'Group tabs once without affecting existing groups',
    groupingFunction: oneTimeGrouping
  },
  smart: {
    id: 'smart',
    name: 'Smart',
    description: 'Intelligently group tabs while preserving existing structure',
    groupingFunction: smartGrouping
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Completely regroup all tabs from scratch',
    groupingFunction: aggressiveGrouping
  }
} as const;
