/**
 * TabProps - Contains all tab information that will be sent to the AI for categorization
 * Uses domain and path instead of full URL to reduce tokens while preserving semantic meaning
 */
export type TabProps = {
  id: number;
  title: string;
  domain: string;
  path: string;
};
