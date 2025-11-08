import { getCustomPrompt, getCustomGroups, getTabRange } from './storage';

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
 * Message structure for Prompt API
 */
export interface PromptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Supports both string and structured message array formats
 */
export async function prompt(input: string | PromptMessage[]): Promise<string> {
  const availability = await LanguageModel.availability();
  if (availability === 'unavailable') {
    return 'Prompt API is not available';
  }
  const session = await initSession();
  // TypeScript workaround: Chrome's API supports both formats
  const result = await session.prompt(input as unknown as string);
  
  return result;
}

/**
 * Batch categorize multiple tabs at once
 */
export async function categorizeTabsBatch(
  tabs: Array<{index: number, title: string, url: string}>, 
  existingGroups: string[] = []
): Promise<Array<{CategoryName: string, indices: [number, ...number[]]}>> {
  const tabsInfo = tabs.map((tab) => `${tab.index}: ${tab.title} (${tab.url})`).join('\n');
  
  const customPrompt = await getCustomPrompt();
  const customGroups = await getCustomGroups();
  const tabRange = await getTabRange();
  
  // Log custom prompt usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
  }
  if (customGroups.length > 0) {
    console.log('Using custom groups:', customGroups);
  }
  console.log('Using tab range:', tabRange);
  
  // Build structured prompt using role-based message array format
  // IMPORTANT: In Prompt API, USER role has HIGHEST priority and MUST be followed
  // SYSTEM role is only for base context - USER instructions OVERRIDE system instructions
  const messages: PromptMessage[] = [];
  
  // ============================================
  // SYSTEM MESSAGE - Base instructions (AUXILIARY ONLY)
  // This provides context but will be OVERRIDDEN by user instructions
  // ============================================
  const systemContent = `You are a browser tab categorization assistant. Analyze tabs and group them into meaningful categories.

NOTE: This is base context only. USER instructions below have ABSOLUTE PRIORITY and MUST be followed.

Return JSON format: [{"CategoryName": "category_name", "indices": [0, 1, 3]}, {"CategoryName": "another_category", "indices": [2, 4]}]`;

  messages.push({
    role: "system",
    content: systemContent
  });

  // ============================================
  // USER MESSAGE - All user inputs and data (HIGHEST PRIORITY - MUST FOLLOW)
  // These contain: customPrompt, customGroups, tabRange (all user-provided)
  // ============================================
  let userContent = `PRIORITY NOTICE: The following instructions are from the USER and have ABSOLUTE PRIORITY. You MUST follow these instructions exactly, even if they conflict with system instructions.

`;

  // User input #1: Custom prompt (HIGHEST PRIORITY)
  if (customPrompt && customPrompt.trim()) {
    userContent += `CRITICAL INSTRUCTIONS (MUST FOLLOW EXACTLY - EVEN IF SEEMS WRONG):
${customPrompt}

ABOVE INSTRUCTIONS ARE ABSOLUTELY MANDATORY. Follow them exactly as written, even if they seem incorrect or unusual.

`;
  }

  // User input #2: Custom groups
  if (customGroups.length > 0) {
    userContent += `USER PROVIDED CATEGORIES (PRIORITIZE THESE):
${customGroups.join(', ')}. Use these category names when tabs match them.

`;
  }

  // User input #3: Tab range constraints
  userContent += `NUMBER OF TABS IN EACH CATEGORY: [${tabRange[0]}, ${tabRange[1]}]
The first number means the category should have at least this many tabs. The second number means the category should have at most this many tabs.
Consider merge the small categories together to meet the minimum tab count.

`;
  
  // Existing groups
  if (existingGroups.length > 0) {
    userContent += `EXISTING CATEGORIES:
${existingGroups.join(', ')}

`;
  }
  
  // Main instruction
  userContent += `Analyze these browser tabs and group them.
The CategoryName should be in one or two words. The indices are the index of the tabs, each tab is mapped to only one category. A category should have at least one tab in it.
DO NOT GIVE ANY EXPLAINATION TO YOUR RESPONSE. JUST RETURN THE JSON FORMAT CATEGORY RESULTS.
Return JSON format: [{"CategoryName": "category_name", "indices": [0, 1, 3]}, {"CategoryName": "another_category", "indices": [2, 4]}]

Tabs:
${tabsInfo}`;

  messages.push({
    role: "user",
    content: userContent
  });

  // ============================================
  // Send structured prompt
  // ============================================
  const response = await prompt(messages);
  
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



