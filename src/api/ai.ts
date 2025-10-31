import { getCustomPrompt, getCustomGroups, getTabRange } from './storage';

let globalSession: LanguageModel | null = null;

export async function initSession() {
  if (!globalSession) {
    globalSession = await LanguageModel.create({
      topK: 5,
      temperature: 0.9,
      expectedOutputs: [{ type: "text", languages: ['en'] }],
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
  const availability = await LanguageModel.availability({
    expectedOutputs: [{ type: "text", languages: ['en'] }]
  });
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
export async function categorizeTabsBatch(tabs: Array<{ index: number; title: string; url: string; }>, existingGroups: string[]): Promise<Array<{CategoryName: string, indices: [number, ...number[]]}>> {
  const tabsInfo = tabs.map((tab) => `${tab.index}: ${tab.title} (${tab.url})`).join('\n');
  
  const customPrompt = await getCustomPrompt();
  const customGroups = await getCustomGroups();
  const customTabRange = await getTabRange();
  
  // Log usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
  }
  if (customGroups.length > 0) {
    console.log('Using custom groups:', customGroups);
  }
  console.log('Using tab range:', customTabRange);
  
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
${customGroups.join(', ')}. PRIORITIZE USING THESE CATEGORY NAMES when tabs match them.
`;
  }

  promptText += `The number of tabs in each category will be given in the format [n,m]. The first number n means the
  category should have at least n tabs. The second number m means the category should have at most m tabs.
  Consider merge the small categories together to meet the minimum tab count.

  NUMBER OF TABS IN EACH CATEGORY: [${customTabRange}]
`
  
  if (existingGroups.length > 0) {
    promptText += `EXISTING CATEGORIES:
${existingGroups.join(', ')}`
  }
  
  // Main instruction
  promptText += `Analyze these browser tabs and group them.
  The CategoryName should be in one or two words. The indices are the index of the tabs, each tab is mapped to only one category. A category should have at least one tab in it.
  DO NOT GIVE ANY EXPLAINATION TO YOUR RESPONSE. JUST RETURN THE JSON FORMAT CATEGORY RESULTS.
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


