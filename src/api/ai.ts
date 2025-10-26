/**
 * Prompt API - Send natural language requests to Gemini Nano
 * Usage: const result = await prompt("your question here");
 */
export async function prompt(input: string): Promise<string> {
  const availability = await LanguageModel.availability();
  if (availability === 'unavailable') {
    return 'Prompt API is not available';
  }
  const session = await LanguageModel.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded * 100}%`);
      });
    },
  });
  const result = await session.prompt(input);
  session.destroy();
  
  return result;
}

// User custom prompt storage
let customPrompt: string = '';

export function setCustomPrompt(prompt: string): void {
  customPrompt = prompt;
  console.log('AI.ts: Custom prompt stored:', prompt || '(empty)');
}

export function getCustomPrompt(): string {
  return customPrompt;
}

export function clearCustomPrompt(): void {
  customPrompt = '';
}

/**
 * Batch categorize multiple tabs at once
 */
export async function categorizeTabsBatch(tabs: Array<{index: number, title: string, url: string}>): Promise<{ [index: number]: {category: string, confidence: number} }> {
  const tabsInfo = tabs.map((tab, localIndex) => `${localIndex}: ${tab.title} (${tab.url})`).join('\n');
  
  // Log custom prompt usage
  if (customPrompt) {
    console.log('Using custom prompt:', customPrompt);
  }
  
  
  const promptText = `${customPrompt ? `CRITICAL: Follow this instruction exactly: ${customPrompt}

` : ''}Analyze these browser tabs and group them.

Rules:
1. Group tabs from the SAME website together
2. Use category names as specified
3. Apply any custom grouping instructions provided

Return JSON format: {"0": {"category": "CategoryName", "confidence": 0.9}}

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
    
    // Find JSON object in the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', response);
    console.error('Parse error:', error);
    
    // Fallback: assign "General" to all tabs using local indices
    const fallback: { [index: number]: {category: string, confidence: number} } = {};
    tabs.forEach((_, localIndex) => fallback[localIndex] = {category: 'General', confidence: 0.5});
    return fallback;
  }
}



