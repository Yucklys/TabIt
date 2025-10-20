import { useState, useEffect } from 'react'
import './App.css'

// ==================== Chrome AI API Types ====================
// Based on https://developer.chrome.com/docs/ai/prompt-api
// and https://developer.chrome.com/docs/ai/summarizer-api

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface AICreateMonitor {
  addEventListener(type: 'downloadprogress', listener: (event: DownloadProgressEvent) => void): void;
}

interface SummarizerOptions {
  sharedContext?: string;
  type?: 'key-points' | 'tldr' | 'teaser' | 'headline';
  format?: 'markdown' | 'plain-text';
  length?: 'short' | 'medium' | 'long';
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

interface AISummarizer {
  summarize(text: string, options?: { context?: string; signal?: AbortSignal }): Promise<string>;
  summarizeStreaming(text: string, options?: { context?: string; signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
}

interface LanguageModel {
  prompt(input: string, options?: { signal?: AbortSignal; responseConstraint?: unknown }): Promise<string>;
  promptStreaming(input: string, options?: { signal?: AbortSignal; responseConstraint?: unknown }): ReadableStream<string>;
  destroy(): void;
  clone(): Promise<LanguageModel>;
  append(input: string): Promise<void>;
  inputUsage: number;
  inputQuota: number;
}

declare global {
  interface Window {
    ai?: {
      languageModel?: {
        availability(): Promise<'readily' | 'after-download' | 'no'>;
        create(options?: { signal?: AbortSignal }): Promise<LanguageModel>;
        params(): Promise<{
          defaultTemperature: number;
          maxTemperature: number;
          defaultTopK: number;
          maxTopK: number;
        }>;
      };
    };
    Summarizer?: {
      availability(): Promise<'readily' | 'after-download' | 'no'>;
      create(options?: SummarizerOptions): Promise<AISummarizer>;
    };
  }
}

function App() {
  // AI API States
  const [activeTab, setActiveTab] = useState<'prompt' | 'summarizer'>('prompt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Prompt API States
  const [promptInput, setPromptInput] = useState('');
  const [promptResult, setPromptResult] = useState('');
  const [promptSession, setPromptSession] = useState<LanguageModel | null>(null);
  const [useStreaming, setUseStreaming] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);

  // Summarizer API States
  const [summarizerType, setSummarizerType] = useState<'key-points' | 'tldr' | 'teaser' | 'headline'>('key-points');
  const [summarizerLength, setSummarizerLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summarizerFormat, setSummarizerFormat] = useState<'markdown' | 'plain-text'>('markdown');
  const [sharedContext, setSharedContext] = useState('This is a scientific article');
  const [inputText, setInputText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');

  useEffect(() => {
    // Initialize prompt session
    initializePromptSession();
  }, []);

  // ==================== Prompt API Functions ====================

  const initializePromptSession = async () => {
    try {
      console.log('Initializing Prompt API session...');
      console.log('window.ai exists:', !!window.ai);
      console.log('window.ai.languageModel exists:', !!window.ai?.languageModel);
      
      if (window.ai?.languageModel) {
        const availability = await window.ai.languageModel.availability();
        console.log('Prompt API availability:', availability);
        
        if (availability !== 'no') {
          const session = await window.ai.languageModel.create();
          console.log('Prompt session created:', session);
          setPromptSession(session);
        } else {
          console.log('Prompt API not available');
        }
      } else {
        console.log('Prompt API not found in window.ai');
      }
    } catch (error) {
      console.error('Failed to initialize prompt session:', error);
    }
  };

  const executePrompt = async () => {
    if (!promptInput.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPromptResult('');
      setDownloadProgress(0);

      if (!promptSession) {
        setError('Prompt API session not available. Please enable chrome://flags/#prompt-api-for-gemini-nano');
        return;
      }

      if (useStreaming) {
        // Streaming prompt
        const stream = promptSession.promptStreaming(promptInput);
        let fullResult = '';
        const reader = stream.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullResult = value;
            setPromptResult(fullResult);
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Non-streaming prompt
        const result = await promptSession.prompt(promptInput);
        setPromptResult(result);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Prompt execution failed: ${errorMessage}`);
      console.error('Prompt error:', error);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  const clearPromptSession = () => {
    if (promptSession) {
      promptSession.destroy();
      setPromptSession(null);
      setPromptResult('');
      initializePromptSession();
    }
  };

  // ==================== Summarizer API Functions ====================

  const summarizeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSummaryResult('');
      setDownloadProgress(0);

      // Check availability first
      const availability = await window.Summarizer?.availability();
      if (availability === 'no') {
        setError('Summarizer API is unavailable. Please enable chrome://flags/#summarization-api-for-gemini-nano');
        return;
      }

      // Create summarizer with exact options from Google docs
      const summarizer = await window.Summarizer!.create({
        sharedContext: sharedContext,
        type: summarizerType,
        format: summarizerFormat,
        length: summarizerLength,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            setDownloadProgress(progress);
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        }
      });

      // Batch summarization with context
      const summary = await summarizer.summarize(inputText, {
        context: 'This article is intended for a tech-savvy audience.'
      });

      setSummaryResult(summary);
      summarizer.destroy();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Summarization failed: ${errorMessage}`);
      console.error('Summarizer error:', error);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  const summarizeTextStreaming = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSummaryResult('');
      setDownloadProgress(0);

      const availability = await window.Summarizer?.availability();
      if (availability === 'no') {
        setError('Summarizer API is unavailable. Please enable chrome://flags/#summarization-api-for-gemini-nano');
        return;
      }

      const summarizer = await window.Summarizer!.create({
        sharedContext: sharedContext,
        type: summarizerType,
        format: summarizerFormat,
        length: summarizerLength,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            setDownloadProgress(progress);
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        }
      });

      // Streaming summarization
      const stream = summarizer.summarizeStreaming(inputText, {
        context: 'This article is intended for junior developers.'
      });
      
      let fullSummary = '';
      const reader = stream.getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullSummary = value;
          setSummaryResult(fullSummary);
        }
      } finally {
        reader.releaseLock();
      }
      
      summarizer.destroy();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Streaming summarization failed: ${errorMessage}`);
      console.error('Streaming error:', error);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  // Sample texts
  const samplePrompt = 'Write a short poem about artificial intelligence and its impact on daily life.';
  const sampleText = `Artificial Intelligence (AI) has revolutionized the way we interact with technology. From voice assistants like Siri and Alexa to recommendation systems on Netflix and Amazon, AI is everywhere in our daily lives. Machine learning algorithms can now recognize images, translate languages, and even create art. However, with these advances come important questions about privacy, ethics, and the future of work. As AI systems become more sophisticated, we must ensure they are developed responsibly and used for the benefit of all humanity.`;

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="download-progress">
              <p>Downloading Gemini Nano: {downloadProgress.toFixed(0)}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${downloadProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Chrome AI APIs</h1>
        <p>Based on <a href="https://developer.chrome.com/docs/ai/prompt-api" target="_blank" rel="noopener noreferrer">Prompt API</a> and <a href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank" rel="noopener noreferrer">Summarizer API</a></p>
      </header>

      <nav className="nav">
        <button 
          className={activeTab === 'prompt' ? 'active' : ''}
          onClick={() => setActiveTab('prompt')}
        >
          🤖 Prompt API
        </button>
        <button 
          className={activeTab === 'summarizer' ? 'active' : ''}
          onClick={() => setActiveTab('summarizer')}
        >
          📝 Summarizer API
        </button>
      </nav>

      <main className="main">
        {/* Left Column */}
        <div className="left-column">
          {activeTab === 'prompt' && (
            <>
              {/* Prompt API Configuration */}
              <div className="config-section">
                <h2>Prompt API Configuration</h2>
                <div className="config-grid">
                  <div className="config-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={useStreaming}
                        onChange={(e) => setUseStreaming(e.target.checked)}
                      />
                      Use Streaming
                    </label>
                  </div>
                  <div className="config-item">
                    <label>Temperature: {temperature}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="config-item">
                    <label>Top-K: {topK}</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={topK}
                      onChange={(e) => setTopK(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="input-section">
                <h2>Prompt Input</h2>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter your prompt here..."
                  rows={6}
                  className="text-input"
                />
                <div className="sample-text">
                  <button onClick={() => setPromptInput(samplePrompt)} className="sample-btn">
                    Use Sample Prompt
                  </button>
                </div>
              </div>

              {/* Prompt Actions */}
              <div className="actions-section">
                <button 
                  onClick={executePrompt} 
                  className="action-btn primary" 
                  disabled={!promptInput.trim()}
                >
                  🚀 Execute Prompt
                </button>
                <button 
                  onClick={clearPromptSession} 
                  className="action-btn secondary"
                >
                  🔄 New Session
                </button>
              </div>
            </>
          )}

          {activeTab === 'summarizer' && (
            <>
              {/* Summarizer Configuration */}
              <div className="config-section">
                <h2>Summarizer Configuration</h2>
                <div className="config-grid">
                  <div className="config-item">
                    <label>Type:</label>
                    <select value={summarizerType} onChange={(e) => setSummarizerType(e.target.value as typeof summarizerType)}>
                      <option value="key-points">Key Points</option>
                      <option value="tldr">TL;DR</option>
                      <option value="teaser">Teaser</option>
                      <option value="headline">Headline</option>
                    </select>
                  </div>
                  <div className="config-item">
                    <label>Length:</label>
                    <select value={summarizerLength} onChange={(e) => setSummarizerLength(e.target.value as typeof summarizerLength)}>
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div className="config-item">
                    <label>Format:</label>
                    <select value={summarizerFormat} onChange={(e) => setSummarizerFormat(e.target.value as typeof summarizerFormat)}>
                      <option value="markdown">Markdown</option>
                      <option value="plain-text">Plain Text</option>
                    </select>
                  </div>
                </div>
                <div className="config-item">
                  <label>Shared Context:</label>
                  <input
                    type="text"
                    value={sharedContext}
                    onChange={(e) => setSharedContext(e.target.value)}
                    placeholder="Additional context for the summarizer"
                  />
                </div>
              </div>

              {/* Text Input */}
              <div className="input-section">
                <h2>Text to Summarize</h2>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to summarize..."
                  rows={8}
                  className="text-input"
                />
                <div className="sample-text">
                  <button onClick={() => setInputText(sampleText)} className="sample-btn">
                    Use Sample Text
                  </button>
                </div>
              </div>

              {/* Summarizer Actions */}
              <div className="actions-section">
                <button 
                  onClick={summarizeText} 
                  className="action-btn primary" 
                  disabled={!inputText.trim()}
                >
                  📝 Batch Summarize
                </button>
                <button 
                  onClick={summarizeTextStreaming} 
                  className="action-btn secondary" 
                  disabled={!inputText.trim()}
                >
                  🌊 Streaming Summarize
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="right-column">
          {/* Error Display */}
          {error && (
            <div className="error-section">
              <h3>Error</h3>
              <div className="error-message">{error}</div>
            </div>
          )}

          {/* Prompt Result Display */}
          {activeTab === 'prompt' && promptResult && (
            <div className="result-section">
              <h2>Prompt Result</h2>
              <div className="result-content">
                {promptResult}
              </div>
            </div>
          )}

          {/* Summary Result Display */}
          {activeTab === 'summarizer' && summaryResult && (
            <div className="result-section">
              <h2>Summary Result</h2>
              <div className="result-content">
                {summaryResult}
              </div>
            </div>
          )}

          {/* Documentation Reference */}
          <div className="docs-section">
            <h2>Documentation Reference</h2>
            {activeTab === 'prompt' && (
              <div>
                <p>This implementation follows the <a href="https://developer.chrome.com/docs/ai/prompt-api" target="_blank" rel="noopener noreferrer">Chrome Prompt API documentation</a>.</p>
                <div className="docs-table">
                  <h3>Prompt API Features</h3>
                  <ul>
                    <li><strong>Non-streaming:</strong> Get complete response at once</li>
                    <li><strong>Streaming:</strong> Show partial results as they arrive</li>
                    <li><strong>Session Management:</strong> Maintain conversation context</li>
                    <li><strong>Temperature Control:</strong> Adjust creativity (0-1)</li>
                    <li><strong>Top-K Sampling:</strong> Control response diversity</li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'summarizer' && (
              <div>
                <p>This implementation follows the <a href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank" rel="noopener noreferrer">Chrome Summarizer API documentation</a>.</p>
                <div className="docs-table">
                  <h3>Summary Types & Lengths</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Short</th>
                        <th>Medium</th>
                        <th>Long</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>tldr</strong></td>
                        <td>1 sentence</td>
                        <td>3 sentences</td>
                        <td>5 sentences</td>
                      </tr>
                      <tr>
                        <td><strong>teaser</strong></td>
                        <td>1 sentence</td>
                        <td>3 sentences</td>
                        <td>5 sentences</td>
                      </tr>
                      <tr>
                        <td><strong>key-points</strong></td>
                        <td>3 bullet points</td>
                        <td>5 bullet points</td>
                        <td>7 bullet points</td>
                      </tr>
                      <tr>
                        <td><strong>headline</strong></td>
                        <td>12 words</td>
                        <td>17 words</td>
                        <td>22 words</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App