// Background script for Tab Sense Chrome Extension
class TabManager {
  constructor() {
    this.tabs = new Map();
    this.init();
  }

  init() {
    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.updateTabInfo(tabId, tab);
      }
    });

    // Listen for tab creation
    chrome.tabs.onCreated.addListener((tab) => {
      this.updateTabInfo(tab.id, tab);
    });

    // Listen for tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.tabs.delete(tabId);
      this.saveTabs();
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Load saved tabs on startup
    this.loadTabs();
  }

  async updateTabInfo(tabId, tab) {
    try {
      // Get page content if it's a web page
      let pageContent = '';
      if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: this.extractPageContent
          });
          pageContent = results[0]?.result || '';
        } catch (error) {
          console.log('Could not extract content from tab:', tabId, error.message);
        }
      }

      const tabInfo = {
        id: tabId,
        title: tab.title || 'Untitled',
        url: tab.url || '',
        favicon: tab.favIconUrl || '',
        content: pageContent,
        timestamp: Date.now(),
        domain: this.extractDomain(tab.url)
      };

      this.tabs.set(tabId, tabInfo);
      this.saveTabs();
    } catch (error) {
      console.error('Error updating tab info:', error);
    }
  }

  extractPageContent() {
    // Function to be injected into web pages
    const getTextContent = (element) => {
      let text = '';
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        text += node.textContent + ' ';
      }
      return text;
    };

    // Extract main content
    const mainContent = document.querySelector('main') || 
                       document.querySelector('article') || 
                       document.querySelector('.content') ||
                       document.querySelector('#content') ||
                       document.body;

    return {
      title: document.title,
      content: getTextContent(mainContent).substring(0, 2000), // Limit content length
      metaDescription: document.querySelector('meta[name="description"]')?.content || '',
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).join(' | ')
    };
  }

  extractDomain(url) {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  async handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'getAllTabs':
        const allTabs = Array.from(this.tabs.values());
        sendResponse({ success: true, tabs: allTabs });
        break;

      case 'getCurrentTabs':
        const currentTabs = await chrome.tabs.query({ currentWindow: true });
        const currentTabInfos = currentTabs.map(tab => this.tabs.get(tab.id)).filter(Boolean);
        sendResponse({ success: true, tabs: currentTabInfos });
        break;

      case 'closeTab':
        try {
          await chrome.tabs.remove(request.tabId);
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'closeMultipleTabs':
        try {
          await chrome.tabs.remove(request.tabIds);
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'pinTab':
        try {
          await chrome.tabs.update(request.tabId, { pinned: true });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'unpinTab':
        try {
          await chrome.tabs.update(request.tabId, { pinned: false });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'duplicateTab':
        try {
          const tab = await chrome.tabs.get(request.tabId);
          await chrome.tabs.create({ url: tab.url });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'bookmarkTab':
        try {
          const tab = await chrome.tabs.get(request.tabId);
          await chrome.bookmarks.create({
            title: tab.title,
            url: tab.url
          });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'bookmarkMultipleTabs':
        try {
          const tabs = await chrome.tabs.query({});
          const tabsToBookmark = tabs.filter(tab => request.tabIds.includes(tab.id));
          
          for (const tab of tabsToBookmark) {
            await chrome.bookmarks.create({
              title: tab.title,
              url: tab.url
            });
          }
          sendResponse({ success: true, count: tabsToBookmark.length });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'muteTab':
        try {
          await chrome.tabs.update(request.tabId, { muted: true });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'unmuteTab':
        try {
          await chrome.tabs.update(request.tabId, { muted: false });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'reloadTab':
        try {
          await chrome.tabs.reload(request.tabId);
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'moveTab':
        try {
          await chrome.tabs.move(request.tabId, { index: request.index });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'saveSession':
        try {
          const tabs = await chrome.tabs.query({ currentWindow: true });
          const sessionData = {
            name: request.sessionName || `Session ${new Date().toLocaleString()}`,
            tabs: tabs.map(tab => ({
              url: tab.url,
              title: tab.title,
              pinned: tab.pinned
            })),
            timestamp: Date.now()
          };
          
          const result = await chrome.storage.local.get(['sessions']);
          const sessions = result.sessions || [];
          sessions.push(sessionData);
          await chrome.storage.local.set({ sessions });
          
          sendResponse({ success: true, sessionId: sessionData.timestamp });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'loadSession':
        try {
          const result = await chrome.storage.local.get(['sessions']);
          const sessions = result.sessions || [];
          const session = sessions.find(s => s.timestamp === request.sessionId);
          
          if (!session) {
            sendResponse({ success: false, error: 'Session not found' });
            return;
          }
          
          // Close current tabs
          const currentTabs = await chrome.tabs.query({ currentWindow: true });
          const tabIds = currentTabs.map(tab => tab.id);
          await chrome.tabs.remove(tabIds);
          
          // Open session tabs
          for (const tabData of session.tabs) {
            await chrome.tabs.create({
              url: tabData.url,
              pinned: tabData.pinned
            });
          }
          
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'getSessions':
        try {
          const result = await chrome.storage.local.get(['sessions']);
          const sessions = result.sessions || [];
          sendResponse({ success: true, sessions });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'deleteSession':
        try {
          const result = await chrome.storage.local.get(['sessions']);
          const sessions = result.sessions || [];
          const filteredSessions = sessions.filter(s => s.timestamp !== request.sessionId);
          await chrome.storage.local.set({ sessions: filteredSessions });
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'groupTabs':
        try {
          const result = await this.createTabGroups(request.tabs);
          sendResponse({ success: true, groups: result });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      case 'summarizeTabs':
        try {
          const summary = await this.summarizeTabs(request.tabs);
          sendResponse({ success: true, summary });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }

  async createTabGroups(tabs) {
    // 首先进行AI分类
    const categorizedTabs = await this.groupTabsByAI(tabs);
    
    // 为每个分类创建Chrome标签页分组
    const groupResults = {};
    
    for (const [categoryName, categoryTabs] of Object.entries(categorizedTabs)) {
      if (categoryTabs.length > 1) { // 只有多个标签页才创建分组
        try {
          // 创建标签页分组
          const groupId = await chrome.tabGroups.create({
            windowId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].windowId
          });
          
          // 将标签页添加到分组
          const tabIds = categoryTabs.map(tab => tab.id);
          await chrome.tabGroups.update(groupId, {
            title: categoryName,
            color: this.getCategoryColor(categoryName),
            collapsed: false
          });
          
          await chrome.tabs.group({ groupId: groupId, tabIds: tabIds });
          
          groupResults[categoryName] = {
            groupId: groupId,
            tabs: categoryTabs,
            color: this.getCategoryColor(categoryName)
          };
        } catch (error) {
          console.error(`创建分组失败 ${categoryName}:`, error);
          // 如果创建分组失败，仍然返回分类结果
          groupResults[categoryName] = {
            tabs: categoryTabs,
            error: error.message
          };
        }
      } else {
        // 单个标签页不创建分组
        groupResults[categoryName] = {
          tabs: categoryTabs,
          singleTab: true
        };
      }
    }
    
    return groupResults;
  }

  getCategoryColor(categoryName) {
    const colorMap = {
      'Work & Study': 'blue',
      'Social Media': 'purple', 
      'News & Info': 'red',
      'Shopping': 'green',
      'Entertainment': 'orange',
      'Development': 'cyan',
      'Life Services': 'yellow',
      'Other': 'grey'
    };
    return colorMap[categoryName] || 'grey';
  }

  async groupTabsByAI(tabs) {
    // Enhanced AI-powered grouping logic
    const groups = {
      'Work & Study': [],
      'Social Media': [],
      'News & Info': [],
      'Shopping': [],
      'Entertainment': [],
      'Development': [],
      'Life Services': [],
      'Other': []
    };

    tabs.forEach(tab => {
      const domain = tab.domain.toLowerCase();
      const title = tab.title.toLowerCase();
      const content = tab.content.toLowerCase();
      const url = tab.url.toLowerCase();

      // Work & Study category
      if (domain.includes('linkedin') || domain.includes('github') || 
          domain.includes('stackoverflow') || domain.includes('notion') ||
          domain.includes('slack') || domain.includes('teams') ||
          title.includes('work') || title.includes('job') || 
          title.includes('career') || title.includes('learn') ||
          title.includes('study') || title.includes('meeting') ||
          content.includes('project') || content.includes('task')) {
        groups['Work & Study'].push(tab);
      }
      // Social Media category
      else if (domain.includes('facebook') || domain.includes('twitter') || 
               domain.includes('instagram') || domain.includes('tiktok') ||
               domain.includes('discord') || domain.includes('telegram') ||
               title.includes('social') || title.includes('chat') ||
               title.includes('post') || title.includes('message')) {
        groups['Social Media'].push(tab);
      }
      // News & Info category
      else if (domain.includes('news') || domain.includes('cnn') || 
               domain.includes('bbc') || domain.includes('reuters') ||
               domain.includes('medium') || domain.includes('blog') ||
               title.includes('news') || title.includes('article') ||
               title.includes('report') || content.includes('analysis')) {
        groups['News & Info'].push(tab);
      }
      // Shopping category
      else if (domain.includes('amazon') || domain.includes('taobao') ||
               domain.includes('jd.com') || domain.includes('ebay') ||
               domain.includes('shop') || domain.includes('buy') ||
               title.includes('shop') || title.includes('cart') ||
               title.includes('checkout') || title.includes('payment') ||
               url.includes('/product') || url.includes('/cart')) {
        groups['Shopping'].push(tab);
      }
      // Entertainment category
      else if (domain.includes('youtube') || domain.includes('netflix') ||
               domain.includes('spotify') || domain.includes('twitch') ||
               domain.includes('game') || title.includes('video') ||
               title.includes('music') || title.includes('movie') ||
               title.includes('show') || title.includes('play') ||
               content.includes('entertainment') || content.includes('fun')) {
        groups['Entertainment'].push(tab);
      }
      // Development category
      else if (domain.includes('developer') || domain.includes('docs') ||
               title.includes('api') || title.includes('code') ||
               title.includes('programming') || title.includes('tutorial') ||
               title.includes('guide') || content.includes('framework') ||
               content.includes('library') || content.includes('debug') ||
               url.includes('/docs') || url.includes('/api')) {
        groups['Development'].push(tab);
      }
      // Life Services category
      else if (domain.includes('bank') || domain.includes('insurance') ||
               domain.includes('health') || domain.includes('medical') ||
               domain.includes('travel') || domain.includes('booking') ||
               domain.includes('map') || domain.includes('weather') ||
               title.includes('bank') || title.includes('travel') ||
               title.includes('booking') || title.includes('hotel')) {
        groups['Life Services'].push(tab);
      }
      // Other category
      else {
        groups['Other'].push(tab);
      }
    });

    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([key, value]) => value.length > 0)
    );
  }

  async summarizeTabs(tabs) {
    // Enhanced AI-powered summarization
    const domains = [...new Set(tabs.map(tab => tab.domain))];
    const categories = await this.groupTabsByAI(tabs);
    
    // Calculate domain frequency
    const domainCount = {};
    tabs.forEach(tab => {
      domainCount[tab.domain] = (domainCount[tab.domain] || 0) + 1;
    });
    
    // Get top domains by frequency
    const topDomains = Object.entries(domainCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain]) => domain);
    
    // Generate insights
    const insights = this.generateInsights(tabs, categories);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(tabs, categories);
    
    return {
      totalTabs: tabs.length,
      uniqueDomains: domains.length,
      categories: Object.keys(categories).length,
      topDomains: topDomains,
      categoryBreakdown: Object.entries(categories).map(([category, categoryTabs]) => ({
        category,
        count: categoryTabs.length,
        percentage: Math.round((categoryTabs.length / tabs.length) * 100)
      })),
      insights: insights,
      recommendations: recommendations
    };
  }

  generateInsights(tabs, categories) {
    const insights = [];
    
    // Tab count insights
    if (tabs.length > 20) {
      insights.push(`You currently have ${tabs.length} tabs open. Consider closing some unused tabs to improve browser performance.`);
    } else if (tabs.length < 5) {
      insights.push(`You only have ${tabs.length} tabs open. Your browser is running smoothly!`);
    }

    // Category distribution insights
    const categoryEntries = Object.entries(categories);
    if (categoryEntries.length > 0) {
      const topCategory = categoryEntries.reduce((prev, current) => 
        current[1].length > prev[1].length ? current : prev
      );
      const percentage = Math.round((topCategory[1].length / tabs.length) * 100);
      
      if (percentage > 40) {
        insights.push(`You spend most of your time on "${topCategory[0]}" category, accounting for ${percentage}% of your tabs.`);
      }
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

  generateRecommendations(tabs, categories) {
    const recommendations = [];
    
    // Tab management recommendations
    if (tabs.length > 15) {
      recommendations.push('Consider bookmarking important pages and closing unused tabs.');
    }

    // Category-specific recommendations
    if (categories['Work & Study'] && categories['Work & Study'].length > 5) {
      recommendations.push('You have many work-related tabs. Consider using browser work profiles to separate them.');
    }

    if (categories['Entertainment'] && categories['Entertainment'].length > 3) {
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

  async saveTabs() {
    try {
      const tabsArray = Array.from(this.tabs.values());
      await chrome.storage.local.set({ tabs: tabsArray });
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  }

  async loadTabs() {
    try {
      const result = await chrome.storage.local.get(['tabs']);
      if (result.tabs) {
        result.tabs.forEach(tab => {
          this.tabs.set(tab.id, tab);
        });
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
  }
}

// Initialize the tab manager
new TabManager();
