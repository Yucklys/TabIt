import { useState, useEffect } from 'react'
import './App.css'

interface Tab {
  id: number;
  title: string;
  url: string;
  favicon: string;
  content: string;
  timestamp: number;
  domain: string;
}

interface TabGroup {
  [key: string]: {
    groupId?: number;
    tabs: Tab[];
    color?: string;
    singleTab?: boolean;
    error?: string;
  };
}

interface TabSummary {
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

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [groupedTabs, setGroupedTabs] = useState<TabGroup>({});
  const [summary, setSummary] = useState<TabSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'groups' | 'summary'>('list');

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      setLoading(true);
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentTabs' });
      if (response.success) {
        setTabs(response.tabs);
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupTabs = async () => {
    try {
      setLoading(true);
      const response = await chrome.runtime.sendMessage({ 
        action: 'groupTabs', 
        tabs: tabs 
      });
      if (response.success) {
        setGroupedTabs(response.groups);
        setActiveView('groups');
      }
    } catch (error) {
      console.error('Error grouping tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  const summarizeTabs = async () => {
    try {
      setLoading(true);
      const response = await chrome.runtime.sendMessage({ 
        action: 'summarizeTabs', 
        tabs: tabs 
      });
      if (response.success) {
        setSummary(response.summary);
        setActiveView('summary');
      }
    } catch (error) {
      console.error('Error summarizing tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeTab = async (tabId: number) => {
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'closeTab', 
        tabId: tabId 
      });
      if (response.success) {
        setTabs(tabs.filter(tab => tab.id !== tabId));
      }
    } catch (error) {
      console.error('Error closing tab:', error);
    }
  };

  const openTab = (url: string) => {
    chrome.tabs.create({ url });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Tab Sense</h1>
        <p>AI-Powered Tab Manager</p>
      </header>

      <nav className="nav">
        <button 
          className={activeView === 'list' ? 'active' : ''}
          onClick={() => setActiveView('list')}
        >
          Tab List
        </button>
        <button 
          className={activeView === 'groups' ? 'active' : ''}
          onClick={groupTabs}
        >
          AI Groups
        </button>
        <button 
          className={activeView === 'summary' ? 'active' : ''}
          onClick={summarizeTabs}
        >
          AI Summary
        </button>
      </nav>

      <main className="main">
        {activeView === 'list' && (
          <div className="tab-list">
            <div className="tab-list-header">
              <h2>Current Tabs ({tabs.length})</h2>
              <button onClick={loadTabs} className="refresh-btn">
                Refresh
              </button>
            </div>
            {tabs.length === 0 ? (
              <div className="empty-state">
                <p>No tabs found</p>
              </div>
            ) : (
              <div className="tabs">
                {tabs.map((tab) => (
                  <div key={tab.id} className="tab-item">
                    <div className="tab-favicon">
                      <img 
                        src={tab.favicon || getFaviconUrl(tab.url)} 
                        alt="" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="tab-content">
                      <h3 className="tab-title" title={tab.title}>
                        {tab.title}
                      </h3>
                      <p className="tab-url" title={tab.url}>
                        {tab.domain}
                      </p>
                      <p className="tab-time">
                        {formatTimestamp(tab.timestamp)}
                      </p>
                    </div>
                    <div className="tab-actions">
                      <button 
                        className="open-btn"
                        onClick={() => openTab(tab.url)}
                        title="Open Tab"
                      >
                        ↗
                      </button>
                      <button 
                        className="close-btn"
                        onClick={() => closeTab(tab.id)}
                        title="Close Tab"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'groups' && (
          <div className="tab-groups">
            <h2>AI Smart Groups</h2>
            {Object.keys(groupedTabs).length === 0 ? (
              <div className="empty-state">
                <p>Click "AI Groups" button to start grouping</p>
              </div>
            ) : (
              <div className="groups">
                {Object.entries(groupedTabs).map(([category, groupData]) => (
                  <div key={category} className="group">
                    <h3 className="group-title">
                      {category} ({groupData.tabs.length})
                      {groupData.groupId && (
                        <span className="group-status">✓ Group Created</span>
                      )}
                      {groupData.singleTab && (
                        <span className="group-status">Single Tab</span>
                      )}
                      {groupData.error && (
                        <span className="group-status error">Failed</span>
                      )}
                    </h3>
                    <div className="group-tabs">
                      {groupData.tabs.map((tab) => (
                        <div key={tab.id} className="group-tab-item">
                          <div className="tab-favicon">
                            <img 
                              src={tab.favicon || getFaviconUrl(tab.url)} 
                              alt="" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="tab-content">
                            <h4 className="tab-title" title={tab.title}>
                              {tab.title}
                            </h4>
                            <p className="tab-url" title={tab.url}>
                              {tab.domain}
                            </p>
                          </div>
                          <div className="tab-actions">
                            <button 
                              className="open-btn"
                              onClick={() => openTab(tab.url)}
                              title="Open Tab"
                            >
                              ↗
                            </button>
                            <button 
                              className="close-btn"
                              onClick={() => closeTab(tab.id)}
                              title="Close Tab"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'summary' && (
          <div className="tab-summary">
            <h2>AI Smart Summary</h2>
            {!summary ? (
              <div className="empty-state">
                <p>Click "AI Summary" button to start analysis</p>
              </div>
            ) : (
              <div className="summary-content">
                <div className="summary-stats">
                  <div className="stat">
                    <div className="stat-number">{summary.totalTabs}</div>
                    <div className="stat-label">Total Tabs</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{summary.uniqueDomains}</div>
                    <div className="stat-label">Unique Sites</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{summary.categories}</div>
                    <div className="stat-label">Categories</div>
                  </div>
                </div>

                <div className="summary-sections">
                  <div className="summary-section">
                    <h3>Top Sites</h3>
                    <div className="domain-list">
                      {summary.topDomains.map((domain, index) => (
                        <div key={domain} className="domain-item">
                          <span className="domain-rank">#{index + 1}</span>
                          <span className="domain-name">{domain}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="summary-section">
                    <h3>Category Breakdown</h3>
                    <div className="category-list">
                      {summary.categoryBreakdown.map((category) => (
                        <div key={category.category} className="category-item">
                          <span className="category-name">{category.category}</span>
                          <span className="category-count">{category.count} ({category.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {summary.insights.length > 0 && (
                    <div className="summary-section">
                      <h3>AI Insights</h3>
                      <div className="insights-list">
                        {summary.insights.map((insight, index) => (
                          <div key={index} className="insight-item">
                            <span className="insight-icon">💡</span>
                            <span className="insight-text">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {summary.recommendations.length > 0 && (
                    <div className="summary-section">
                      <h3>AI Recommendations</h3>
                      <div className="recommendations-list">
                        {summary.recommendations.map((recommendation, index) => (
                          <div key={index} className="recommendation-item">
                            <span className="recommendation-icon">🎯</span>
                            <span className="recommendation-text">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App
