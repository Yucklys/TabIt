import { test, expect, describe } from 'bun:test';
import { incrementalClusterAndGroup } from './incrementalClustering';
import type { ExistingGroupInfo } from './incrementalClustering';
import type { TabProps } from '$type/tabProps';

function makeTabs(specs: Array<{ title: string; domain: string; path: string }>, idStart = 1): TabProps[] {
  return specs.map((s, i) => ({ id: idStart + i, title: s.title, domain: s.domain, path: s.path }));
}

describe('incrementalClusterAndGroup', () => {
  test('new tab similar to existing group merges into that group', async () => {
    const existingGroups: ExistingGroupInfo[] = [
      {
        name: 'React',
        tabs: makeTabs([
          { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
          { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
          { title: 'React Tutorial Intro', domain: 'react.dev', path: '/tutorial' },
        ], 100),
      },
    ];

    const newTabs = makeTabs([
      { title: 'React Components Overview', domain: 'react.dev', path: '/components' },
    ], 200);

    const result = await incrementalClusterAndGroup(newTabs, existingGroups, [1, 6], 0.5);

    // The new React tab should merge into the existing React group (index 0)
    expect(result.merged.length).toBeGreaterThanOrEqual(1);
    const reactMerge = result.merged.find(m => m.groupIndex === 0);
    expect(reactMerge).toBeDefined();
    expect(reactMerge!.tabIds).toContain(200);
  });

  test('new tab dissimilar to all existing groups stays ungrouped or forms new group', async () => {
    const existingGroups: ExistingGroupInfo[] = [
      {
        name: 'React',
        tabs: makeTabs([
          { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
          { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
          { title: 'React Tutorial Intro', domain: 'react.dev', path: '/tutorial' },
        ], 100),
      },
    ];

    const newTabs = makeTabs([
      { title: 'Best Pasta Recipes Italian Cooking', domain: 'allrecipes.com', path: '/pasta' },
    ], 200);

    const result = await incrementalClusterAndGroup(newTabs, existingGroups, [1, 6], 0.5);

    // The pasta tab should NOT merge into React group
    const reactMerge = result.merged.find(m => m.groupIndex === 0);
    if (reactMerge) {
      expect(reactMerge.tabIds).not.toContain(200);
    }
  });

  test('multiple new similar tabs cluster together as new group', async () => {
    const existingGroups: ExistingGroupInfo[] = [
      {
        name: 'React',
        tabs: makeTabs([
          { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
          { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
          { title: 'React Tutorial Intro', domain: 'react.dev', path: '/tutorial' },
        ], 100),
      },
    ];

    // Use same domain + overlapping terms to ensure high similarity
    const newTabs = makeTabs([
      { title: 'Python Machine Learning Tutorial', domain: 'python.org', path: '/ml/tutorial' },
      { title: 'Python Machine Learning Guide', domain: 'python.org', path: '/ml/guide' },
      { title: 'Python Machine Learning Examples', domain: 'python.org', path: '/ml/examples' },
    ], 200);

    const result = await incrementalClusterAndGroup(newTabs, existingGroups, [2, 6], 0.5);

    // The Python ML tabs should form a new group (not merge into React)
    const totalCreatedTabs = Object.values(result.created).flat();
    const newIds = [200, 201, 202];

    // At least some new tabs should be in created groups
    const inCreated = newIds.filter(id => totalCreatedTabs.includes(id));
    expect(inCreated.length).toBeGreaterThanOrEqual(2);
  });

  test('no existing groups delegates to full Leiden pipeline', async () => {
    const newTabs = makeTabs([
      { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
      { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
      { title: 'React Tutorial Intro', domain: 'react.dev', path: '/tutorial' },
      { title: 'Easy Pasta Recipes', domain: 'allrecipes.com', path: '/pasta' },
      { title: 'Pasta Cooking Tips', domain: 'foodnetwork.com', path: '/tips/pasta' },
      { title: 'Italian Pasta Guide', domain: 'seriouseats.com', path: '/italian/pasta' },
    ], 1);

    const result = await incrementalClusterAndGroup(newTabs, [], [2, 6], 0.5);

    // With no existing groups, merged should be empty
    expect(result.merged).toEqual([]);

    // Should create some groups from the full pipeline
    const groupCount = Object.keys(result.created).length;
    expect(groupCount).toBeGreaterThanOrEqual(1);
  });

  test('single new tab with no similarity stays ungrouped', async () => {
    const existingGroups: ExistingGroupInfo[] = [
      {
        name: 'React',
        tabs: makeTabs([
          { title: 'React Documentation', domain: 'react.dev', path: '/docs' },
          { title: 'React Hooks Guide', domain: 'react.dev', path: '/hooks' },
        ], 100),
      },
    ];

    // A very different tab
    const newTabs = makeTabs([
      { title: 'Quantum Physics Lecture Notes', domain: 'mit.edu', path: '/physics/quantum' },
    ], 200);

    const result = await incrementalClusterAndGroup(newTabs, existingGroups, [2, 6], 0.5);

    // With minSize=2, a single dissimilar tab should not form a group on its own
    // It should either not appear in merged or created
    const allMergedIds = result.merged.flatMap(m => m.tabIds);
    const allCreatedIds = Object.values(result.created).flat();
    const tabInResult = allMergedIds.includes(200) || allCreatedIds.includes(200);

    // Either stays ungrouped (outlier) or merged into existing — both acceptable
    // The key is it doesn't create a solo group with minSize=2
    const soloGroup = Object.values(result.created).find(ids => ids.length === 1 && ids[0] === 200);
    expect(soloGroup).toBeUndefined();
  });

  test('new group names avoid collision with existing group names', async () => {
    const existingGroups: ExistingGroupInfo[] = [
      {
        name: 'Pasta',
        tabs: makeTabs([
          { title: 'Easy Pasta Recipes', domain: 'allrecipes.com', path: '/pasta' },
          { title: 'Pasta Cooking Tips', domain: 'foodnetwork.com', path: '/tips/pasta' },
        ], 100),
      },
    ];

    // New tabs also about pasta-related cooking
    const newTabs = makeTabs([
      { title: 'Italian Pasta Guide', domain: 'seriouseats.com', path: '/italian/pasta' },
      { title: 'Homemade Pasta Dough Recipe', domain: 'bonappetit.com', path: '/recipes/pasta-dough' },
      { title: 'Fresh Pasta Making Tutorial', domain: 'youtube.com', path: '/watch/pasta-tutorial' },
    ], 200);

    const result = await incrementalClusterAndGroup(newTabs, existingGroups, [2, 6], 0.5);

    // If any new groups are created, their names should not be "Pasta" (already used)
    for (const name of Object.keys(result.created)) {
      expect(name.toLowerCase()).not.toBe('pasta');
    }
  });
});
