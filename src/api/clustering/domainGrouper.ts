import type { TabProps } from '@/type/tabProps';

/**
 * Domain group - represents all tabs from the same domain
 */
export type DomainGroup = {
  domain: string;
  tabs: TabProps[];
};

/**
 * Group tabs by their domain
 * Same-domain tabs will always stay together in the same group
 * @param tabs - Array of tab properties
 * @returns Array of domain groups
 */
export function groupTabsByDomain(tabs: TabProps[]): DomainGroup[] {
  const domainMap = new Map<string, TabProps[]>();

  for (const tab of tabs) {
    const existing = domainMap.get(tab.domain);
    if (existing) {
      existing.push(tab);
    } else {
      domainMap.set(tab.domain, [tab]);
    }
  }

  return Array.from(domainMap.entries()).map(([domain, tabs]) => ({
    domain,
    tabs
  }));
}

/**
 * Get representative tab info for a domain group (for AI prompts)
 * Returns a formatted string showing domain, paths, and sample tab titles
 */
export function getDomainGroupSummary(group: DomainGroup): string {
  const sampleTabs = group.tabs.slice(0, 3);
  const remaining = group.tabs.length - sampleTabs.length;

  let summary = `${group.domain} (${group.tabs.length} tabs):\n`;
  summary += sampleTabs.map(tab => `  - ${tab.path}: ${tab.title}`).join('\n');

  if (remaining > 0) {
    summary += `\n  ... and ${remaining} more`;
  }

  return summary;
}

/**
 * Get all tab IDs from a domain group
 */
export function getTabIds(group: DomainGroup): number[] {
  return group.tabs.map(tab => tab.id);
}
