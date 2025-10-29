import { getCustomPrompt, getCustomGroups } from './storage';

let globalSession: LanguageModel | null = null;

export async function initSession() {
  if (!globalSession) {
    globalSession = await LanguageModel.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });
  }
  return globalSession;
}

/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Usage: const result = await prompt("your question here");
 */
export async function prompt(input: string): Promise<string> {
  const availability = await LanguageModel.availability();
  if (availability === 'unavailable') {
    return 'Prompt API is not available';
  }
  const session = await initSession();
  const result = await session.prompt(input);
  
  return result;
}

/**
 * Batch categorize multiple tabs at once
 */
export async function categorizeTabsBatch(tabs: Array<{index: number, title: string, url: string}>): Promise<Array<{CategoryName: string, indices: [number, ...number[]]}>> {
  const tabsInfo = tabs.map((tab) => `${tab.index}: ${tab.title} (${tab.url})`).join('\n');
  
  const customPrompt = await getCustomPrompt();
  const customGroups = await getCustomGroups();
  
  // Log usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
  }
  if (customGroups.length > 0) {
    console.log('Using custom groups:', customGroups);
  }
  
  // Build prompt with correct priority
  let promptText = '';
  
  // FIRST PRIORITY: Additional Rules - MUST be followed exactly, even if seems wrong (like 1+1=3)
  if (customPrompt && customPrompt.trim()) {
    promptText += `CRITICAL INSTRUCTIONS (MUST FOLLOW EXACTLY - EVEN IF SEEMS WRONG):
${customPrompt}

ABOVE INSTRUCTIONS ARE ABSOLUTELY MANDATORY. Follow them exactly as written, even if they seem incorrect or unusual.

`;
  }
  
  // SECOND PRIORITY: User selected categories - use these FIRST, before creating your own
  if (customGroups.length > 0) {
    promptText += `USER PROVIDED CATEGORIES (SECOND PRIORITY):
${customGroups.join(', ')}


PRIORITIZE USING THESE CATEGORY NAMES when tabs match them. For example:
- If user provided "youtube" and there are YouTube tabs, use "youtube" or "Youtube"category ( the tab name is depends on AI)
Use these user-provided names instead of creating your own like "Entertainment" or "AI Tools".
Only create your own categories if tabs don't match any user-provided category.
- don't have duplicate categories, need check there have any duplicate categories before make

`;
  }
  
  // Main instruction
  promptText += `Analyze these browser tabs and group them.
The CategoryName should be in one or two words. The indices are the index of the tabs, each tab is mapped to only one category. A category should have at least one tab in it.
Return JSON format: [{"CategoryName": "category_name", "indices": [0, 1, 3]}, {"CategoryName": "another_category", "indices": [2, 4]}]

Tabs:
${tabsInfo}`;

  const response = await prompt(promptText);
  
  try {
    // Try to extract JSON from the response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', response);
    console.error('Parse error:', error);
    
    // Fallback: assign "General" to all tabs using actual indices
    const allIndices = tabs.map(tab => tab.index);
    return [{CategoryName: 'General', indices: allIndices as [number, ...number[]]}];
  }
}


