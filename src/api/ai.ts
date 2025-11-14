import { getCustomPrompt, getCustomGroups, getTabRange } from './storage';

const schema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "CategoryName": { "type": "string" },
      "indices": {
        "type": "array",
        "items": { "type": "number" }
      }
    },
  },
}

export const initSession = async () => {
  return await LanguageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: `You are a browser tab categorization assistant. Analyze tabs and group them into meaningful categories.

        Requirements:
        - CategoryName: 1-2 words only.
        - Each tab belongs to exactly one category, all tab index must appear only once.
        - Each category must have at least one tab.`
      }
    ],
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });
};


/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Supports both string and structured message array formats
 */
export const prompt = async (input: LanguageModelMessage[], promptText: string): Promise<string> => {
  const availability = await LanguageModel.availability();
  if (availability === 'unavailable') {
    return 'Prompt API is not available';
  }
  const session = await initSession();

  await session.append(input);
  const result = await session.prompt(promptText, {
    responseConstraint: schema
  });
  
  return result;
};

/**
 * Generate custom instructions prompt message
 */
const createCustomInstructionsMessage = (customPrompt: string): LanguageModelMessage | null => {
  if (!customPrompt || !customPrompt.trim()) {
    return null;
  }
  return {
    role: "user",
    content: [
      {
        type: 'text',
        value: `CUSTOM INSTRUCTIONS:
${customPrompt}`
      }
    ]
  };
};

/**
 * Generate preferred categories prompt message
 */
const createPreferredCategoriesMessage = (customGroups: string[]): LanguageModelMessage | null => {
  if (customGroups.length === 0) {
    return null;
  }
  return {
    role: "user",
    content: [
      {
        type: 'text',
        value: `REQUIRED CATEGORIES:
${customGroups.join(', ')}. You MUST ONLY use these exact category names. Do not create any new categories - all tabs must be assigned to one of these categories.`
      }
    ]
  };
};

/**
 * Generate task instruction content
 */
const createPrompt = (tabsInfo: string, tabIndices: number[]): string => {
  return `Analyze these browser tabs and group them:
${tabsInfo}

CRITICAL: You must categorize ALL ${tabIndices.length} tabs listed above. 
Required tab indices: ${tabIndices.join(', ')}
Every single one of these indices MUST appear exactly once in your response.
Do not skip or omit any tab indices.`;
};

/**
 * Parse AI response and retrieve categories from the structured response
 */
const parseAIResponse = (response: string): Array<{CategoryName: string, indices: [number, ...number[]]}> => {
  const parsed = JSON.parse(response);
  return parsed;
};

/**
 * Generate user message with constraints and context
 */
const createConstraintsMessage = (
  tabRange: [number, number],
  existingGroups: string[]
): LanguageModelMessage => {
  let content = `CATEGORY SIZE CONSTRAINTS: [${tabRange[0]}, ${tabRange[1]}]
Each category must have at least ${tabRange[0]} tabs and at most ${tabRange[1]} tabs.
Merge small categories together to meet the minimum tab count.`;

  if (existingGroups.length > 0) {
    content += `

EXISTING CATEGORIES:
${existingGroups.join(', ')}`;
  }

  return {
    role: "user",
    content: [
      {
        type: 'text',
        value: content
      }
    ]
  };
};

/**
 * Batch categorize multiple tabs at once
 */
export const categorizeTabsBatch = async (
  tabs: Array<{index: number, title: string, url: string}>, 
  existingGroups: string[]
): Promise<Array<{CategoryName: string, indices: [number, ...number[]]}>> => {
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
  // System context is now set in initialPrompts during session creation
  const messages: LanguageModelMessage[] = [];
  
  // Add custom instructions message if provided
  const customInstructionsMsg = createCustomInstructionsMessage(customPrompt);
  if (customInstructionsMsg) {
    messages.push(customInstructionsMsg);
  }
  
  // Add preferred categories message if provided
  const preferredCategoriesMsg = createPreferredCategoriesMessage(customGroups);
  if (preferredCategoriesMsg) {
    messages.push(preferredCategoriesMsg);
  }
  
  // Add constraints message (user input)
  const constraintsMsg = createConstraintsMessage(tabRange, existingGroups);
  messages.push(constraintsMsg);

  // ============================================
  // Send structured prompt
  // ============================================
  const tabIndices = tabs.map(tab => tab.index);
  const promptText = createPrompt(tabsInfo, tabIndices);
  const response = await prompt(messages, promptText);

  try {
    return parseAIResponse(response);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', response);
    console.error('Parse error:', error);
    
    // Fallback: assign "General" to all tabs using actual indices
    const allIndices = tabs.map(tab => tab.index);
    return [{CategoryName: 'General', indices: allIndices as [number, ...number[]]}];
  }
};



