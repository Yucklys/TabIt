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
  
  // Log custom prompt usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
    
  }
  
  const promptText = `${customPrompt ? `CRITICAL: Follow this instruction exactly: ${customPrompt}

` : ''}Analyze these browser tabs and group them.
The CategoryName should in one or two words. ${customGroups.length > 0 ? `You should prioritize these names: ${customGroups.join(', ')}, but you can come up with one yourself if needed.` : ''}
The indices are the index of the tabs, each tab is mapped to only one category.
A category should have at least one tab in it.
Return JSON format: [{"CategoryName": "Development", "indices": [0, 1, 3]}, {"CategoryName": "Entertainment", "indices": [2, 4]}]

Tabs:
${tabsInfo}`;

  console.log('Using custom prompt:', customPrompt);

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


