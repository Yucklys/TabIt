/**
 * TabProps - Contains all tab information that will be sent to the AI for categorization
 * Uses domain and path instead of full URL to reduce tokens while preserving semantic meaning
 */
export type TabProps = {
  index: number;
  title: string;
  domain: string;           // Extracted domain (e.g., "github.com")
  path: string;             // URL path without query params (e.g., "/user/repo")
};