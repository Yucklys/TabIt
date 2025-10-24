// AI Service for Tab Sense Chrome Extension
// This module provides AI-powered tab analysis and categorization

export interface TabData {
  id: number;
  title: string;
  url: string;
  domain: string;
  content: string;
  timestamp: number;
}

export interface AICategory {
  name: string;
  description: string;
  keywords: string[];
  color: string;
}

export interface TabGroup {
  [category: string]: TabData[];
}

export interface AISummary {
  totalTabs: number;
  uniqueDomains: number;
  categories: number;
  topDomains: string[];
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  insights: string[];
  recommendations: string[];
}

class AIService {
  private categories: AICategory[] = [
    {
      name: 'Work & Study',
      description: 'Tabs related to work, learning, and career development',
      keywords: ['work', 'job', 'career', 'learn', 'study', 'education', 'linkedin', 'github', 'stackoverflow', 'notion', 'slack', 'teams', 'zoom', 'meeting', 'project', 'task', 'document', 'pdf', 'presentation'],
      color: '#3b82f6'
    },
    {
      name: 'Social Media',
      description: 'Social networks and instant messaging platforms',
      keywords: ['facebook', 'twitter', 'instagram', 'tiktok', 'snapchat', 'discord', 'telegram', 'whatsapp', 'wechat', 'social', 'chat', 'message', 'post', 'story'],
      color: '#8b5cf6'
    },
    {
      name: 'News & Info',
      description: 'News, information, blogs and media websites',
      keywords: ['news', 'cnn', 'bbc', 'reuters', 'blog', 'medium', 'substack', 'article', 'report', 'analysis', 'opinion', 'editorial', 'press'],
      color: '#ef4444'
    },
    {
      name: 'Shopping',
      description: 'E-commerce, shopping, payment and consumption related websites',
      keywords: ['amazon', 'shop', 'buy', 'purchase', 'cart', 'checkout', 'payment', 'paypal', 'alipay', 'store', 'mall', 'deal', 'sale', 'discount', 'product', 'review'],
      color: '#10b981'
    },
    {
      name: 'Entertainment',
      description: 'Video, music, games and entertainment content',
      keywords: ['youtube', 'netflix', 'spotify', 'music', 'video', 'game', 'gaming', 'twitch', 'stream', 'movie', 'tv', 'show', 'entertainment', 'fun', 'play'],
      color: '#f59e0b'
    },
    {
      name: 'Development',
      description: 'Programming, technical documentation, development tools and resources',
      keywords: ['github', 'stackoverflow', 'dev', 'code', 'programming', 'api', 'documentation', 'tutorial', 'guide', 'framework', 'library', 'tool', 'debug', 'deploy'],
      color: '#06b6d4'
    },
    {
      name: 'Life Services',
      description: 'Banking, insurance, medical, transportation and other life services',
      keywords: ['bank', 'insurance', 'health', 'medical', 'doctor', 'hospital', 'pharmacy', 'travel', 'booking', 'hotel', 'flight', 'train', 'bus', 'map', 'weather'],
      color: '#84cc16'
    },
    {
      name: 'Other',
      description: 'Uncategorized tabs',
      keywords: [],
      color: '#6b7280'
    }
  ];

  /**
   * Use AI algorithm to intelligently group tabs
   */
  async groupTabsByAI(tabs: TabData[]): Promise<TabGroup> {
    const groups: TabGroup = {};
    
    // Initialize all categories
    this.categories.forEach(category => {
      groups[category.name] = [];
    });

    // Categorize each tab
    tabs.forEach(tab => {
      const category = this.categorizeTab(tab);
      groups[category].push(tab);
    });

    // Remove empty groups
    Object.keys(groups).forEach(category => {
      if (groups[category].length === 0) {
        delete groups[category];
      }
    });

    return groups;
  }

  /**
   * Categorize a single tab
   */
  private categorizeTab(tab: TabData): string {
    const text = `${tab.title} ${tab.domain} ${tab.content}`.toLowerCase();
    
    // Calculate matching score for each category
    const scores = this.categories.map(category => {
      let score = 0;
      
      // Based on keyword matching
      category.keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      // Based on domain special rules
      const domain = tab.domain.toLowerCase();
      if (this.isSpecialDomain(domain, category.name)) {
        score += 5; // Special domain bonus
      }

      // Based on URL path rules
      if (this.isSpecialPath(tab.url, category.name)) {
        score += 3;
      }

      return { category: category.name, score };
    });

    // Find the highest scoring category
    const bestMatch = scores.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    // If no keywords match, categorize as "Other"
    return bestMatch.score > 0 ? bestMatch.category : 'Other';
  }

  /**
   * Check if it's a special domain
   */
  private isSpecialDomain(domain: string, categoryName: string): boolean {
    const specialDomains: { [key: string]: string[] } = {
      'Work & Study': ['linkedin.com', 'github.com', 'stackoverflow.com', 'notion.so', 'slack.com', 'teams.microsoft.com'],
      'Social Media': ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'discord.com', 'telegram.org'],
      'News & Info': ['cnn.com', 'bbc.com', 'reuters.com', 'medium.com', 'substack.com'],
      'Shopping': ['amazon.com', 'taobao.com', 'jd.com', 'ebay.com', 'paypal.com'],
      'Entertainment': ['youtube.com', 'netflix.com', 'spotify.com', 'twitch.tv'],
      'Development': ['github.com', 'stackoverflow.com', 'developer.mozilla.org', 'docs.microsoft.com'],
      'Life Services': ['google.com/maps', 'weather.com', 'booking.com', 'expedia.com']
    };

    const domains = specialDomains[categoryName] || [];
    return domains.some(specialDomain => domain.includes(specialDomain));
  }

  /**
   * Check if it's a special path
   */
  private isSpecialPath(url: string, categoryName: string): boolean {
    const specialPaths: { [key: string]: string[] } = {
      'Work & Study': ['/meeting', '/call', '/document', '/presentation', '/task', '/project'],
      'Shopping': ['/cart', '/checkout', '/payment', '/order', '/product'],
      'Entertainment': ['/watch', '/play', '/listen', '/stream'],
      'Development': ['/docs', '/api', '/guide', '/tutorial', '/reference']
    };

    const paths = specialPaths[categoryName] || [];
    return paths.some(path => url.toLowerCase().includes(path));
  }

  /**
   * Generate AI smart summary
   */
  async generateSummary(tabs: TabData[]): Promise<AISummary> {
    const groups = await this.groupTabsByAI(tabs);
    const domains = [...new Set(tabs.map(tab => tab.domain))];
    
    // Calculate category statistics
    const categoryBreakdown = Object.entries(groups).map(([category, categoryTabs]) => ({
      category,
      count: categoryTabs.length,
      percentage: Math.round((categoryTabs.length / tabs.length) * 100)
    }));

    // Generate insights
    const insights = this.generateInsights(tabs, groups, categoryBreakdown);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(tabs, groups);

    return {
      totalTabs: tabs.length,
      uniqueDomains: domains.length,
      categories: Object.keys(groups).length,
      topDomains: domains.slice(0, 5),
      categoryBreakdown,
      insights,
      recommendations
    };
  }

  /**
   * Generate insights
   */
  private generateInsights(tabs: TabData[], _groups: TabGroup, categoryBreakdown: Array<{category: string; count: number; percentage: number}>): string[] {
    const insights: string[] = [];
    
    // Tab count insights
    if (tabs.length > 20) {
      insights.push(`You currently have ${tabs.length} tabs open. Consider closing some unused tabs to improve browser performance.`);
    } else if (tabs.length < 5) {
      insights.push(`You only have ${tabs.length} tabs open. Your browser is running smoothly!`);
    }

    // Category distribution insights
    const topCategory = categoryBreakdown.reduce((prev: {category: string; count: number; percentage: number}, current: {category: string; count: number; percentage: number}) => 
      current.count > prev.count ? current : prev
    );
    
    if (topCategory.count > tabs.length * 0.4) {
      insights.push(`You spend most of your time on "${topCategory.category}" category, accounting for ${topCategory.percentage}%.`);
    }

    // Domain diversity insights
    const uniqueDomains = new Set(tabs.map(tab => tab.domain)).size;
    if (uniqueDomains < tabs.length * 0.3) {
      insights.push(`You visit relatively few websites, only ${uniqueDomains} different domains.`);
    } else if (uniqueDomains > tabs.length * 0.8) {
      insights.push(`You visit a wide variety of websites, with ${uniqueDomains} different domains.`);
    }

    // Time distribution insights
    const now = Date.now();
    const recentTabs = tabs.filter(tab => now - tab.timestamp < 3600000); // 1 hour
    if (recentTabs.length > tabs.length * 0.5) {
      insights.push(`You've been very active recently, with ${recentTabs.length} tabs opened in the past hour.`);
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(tabs: TabData[], groups: TabGroup): string[] {
    const recommendations: string[] = [];
    
    // Tab management recommendations
    if (tabs.length > 15) {
      recommendations.push('Consider bookmarking important pages and closing unused tabs.');
    }

    // Category-specific recommendations
    if (groups['Work & Study'] && groups['Work & Study'].length > 5) {
      recommendations.push('You have many work-related tabs. Consider using browser work profiles to separate them.');
    }

    if (groups['Entertainment'] && groups['Entertainment'].length > 3) {
      recommendations.push('You have many entertainment tabs. Consider setting time limits or using focus mode.');
    }

    // Performance recommendations
    const heavySites = tabs.filter(tab => 
      ['youtube.com', 'netflix.com', 'twitch.tv'].some(site => tab.domain.includes(site))
    );
    
    if (heavySites.length > 2) {
      recommendations.push('Multiple video streaming sites detected. Consider closing unused video tabs to save memory.');
    }

    // Security recommendations
    const suspiciousDomains = tabs.filter(tab => 
      !tab.domain.includes('.') || 
      tab.domain.length < 4 ||
      tab.url.includes('http://') // Non-HTTPS
    );
    
    if (suspiciousDomains.length > 0) {
      recommendations.push('Some suspicious websites detected. Consider checking the security of these tabs.');
    }

    return recommendations;
  }

  /**
   * Get category information
   */
  getCategories(): AICategory[] {
    return this.categories;
  }

  /**
   * Analyze tab content and extract keywords
   */
  extractKeywords(tab: TabData): string[] {
    const text = `${tab.title} ${tab.content}`.toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    
    // Simple keyword extraction (in real applications, more complex NLP algorithms can be used)
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Check if it's a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'can', 'may', 'might', 'must', 'shall', 'a', 'an', 'the', 'and', 'or', 'but'
    ];
    return stopWords.includes(word.toLowerCase());
  }
}

export const aiService = new AIService();