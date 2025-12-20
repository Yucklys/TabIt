/**
 * URL Extraction Utilities
 * Extracts domain and path from URLs to reduce tokens while preserving semantic meaning
 */

/**
 * Extract domain from URL
 * Removes 'www.' prefix for cleaner output
 *
 * Example: "https://www.github.com/user/repo" -> "github.com"
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
};

/**
 * Extract path from URL (without query params or fragments)
 *
 * Example: "https://github.com/user/repo?tab=issues#top" -> "/user/repo"
 */
export const extractPath = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '';
  }
};

/**
 * Extract domain/path format from URL
 * Removes protocol, www prefix, query params, and fragments
 *
 * Examples:
 *   "https://www.github.com/user/repo?tab=issues#top" -> "github.com/user/repo"
 *   "https://youtube.com/watch?v=abc123" -> "youtube.com/watch"
 */
export const extractDomainPath = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, '');
    const path = urlObj.pathname;

    // Combine and remove trailing slash
    return (domain + path).replace(/\/$/, '');
  } catch {
    return url;
  }
};