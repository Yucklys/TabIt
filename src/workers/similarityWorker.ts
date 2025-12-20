/**
 * Web Worker for parallel AI similarity scoring
 */

// Type declaration for Chrome AI API in Web Worker context
declare global {
  interface AI {
    languageModel: typeof LanguageModel;
  }

  interface WorkerGlobalScope {
    ai: AI;
  }
}

const similaritySchema = {
  "type": "object",
  "properties": {
    "similarity": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0
    }
  },
  "required": ["similarity"]
};

/**
 * Initialize AI session for similarity scoring
 */
async function initSimilaritySession() {
  return await (self as any as WorkerGlobalScope).ai.languageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: `You are a semantic similarity analyzer. Compare browser tab groups and rate their similarity.

Scoring guidelines:
- 1.0: Identical or extremely similar topics (e.g., same project documentation)
- 0.7-0.9: Related topics (e.g., frontend and backend of same project)
- 0.4-0.6: Loosely related (e.g., different programming topics)
- 0.1-0.3: Weakly related (e.g., both about technology but different domains)
- 0.0: Completely unrelated`
      }
    ],
    expectedOutputs: [{ "type": "text", "languages": ["en"]}]
  });
}

// Session initialized lazily on first use
let session: any = null;
let sessionPromise: Promise<any> | null = null;

/**
 * Ensure session is initialized (lazy initialization)
 */
async function ensureSession() {
  if (session) {
    return session;
  }

  if (!sessionPromise) {
    sessionPromise = initSimilaritySession().then(s => {
      session = s;
      console.log('Worker session initialized');
      return s;
    }).catch(error => {
      console.error('Failed to initialize worker session:', error);
      sessionPromise = null; // Allow retry
      throw error;
    });
  }

  return sessionPromise;
}

/**
 * Score similarity between two domain group summaries
 */
async function scoreSimilarity(summary1: string, summary2: string): Promise<number> {
  // Ensure session is initialized (lazy initialization)
  const activeSession = await ensureSession();

  const promptText = `Compare these two groups of browser tabs and rate their semantic similarity:

Group A:
${summary1}

Group B:
${summary2}

Consider:
- Are they related to the same project, topic, or task?
- Would a user likely want to work with both groups together?
- Do they serve similar purposes?

Return your similarity score (0.0 to 1.0).`;

  try {
    const response = await activeSession.prompt(promptText, {
      responseConstraint: similaritySchema
    });

    const parsed = JSON.parse(response);
    return Math.max(0.0, Math.min(1.0, parsed.similarity));
  } catch (error) {
    console.error('Error scoring similarity in worker:', error);
    return 0.0;
  }
}

// Handle messages from main thread
self.onmessage = async (e: MessageEvent) => {
  const { id, summary1, summary2 } = e.data;

  try {
    const similarity = await scoreSimilarity(summary1, summary2);
    self.postMessage({ id, similarity, success: true });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ id, similarity: 0.0, success: false, error: String(error) });
  }
};
