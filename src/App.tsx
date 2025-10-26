import { useState } from 'react';
import { oneTimeGrouping } from './mode/oneTime';
import { smartGrouping } from './mode/smart';
import { aggressiveGrouping } from './mode/aggressive';

export default function App() {
  const [customPrompt, setCustomPrompt] = useState('');
  const [mode, setMode] = useState<'one-time' | 'smart' | 'aggressive'>('one-time');

  const handleGroup = async () => {
    // Set custom prompt
    setCustomPrompt(customPrompt);
    if (customPrompt) {
      console.log('Custom prompt set:', customPrompt);
    }
    
    switch(mode) {
      case 'one-time':
        await oneTimeGrouping();
        break;
      case 'smart':
        await smartGrouping();
        break;
      case 'aggressive':
        await aggressiveGrouping();
        break;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2>TabSense</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Grouping Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'one-time' | 'smart' | 'aggressive')} style={{ marginLeft: '10px', padding: '5px' }}>
          <option value="one-time">One-Time Grouping</option>
          <option value="smart">Smart Grouping</option>
          <option value="aggressive">Aggressive Grouping</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Custom Prompt (optional):</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g., Group by project names"
          style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          rows={2}
        />
      </div>

      <button 
        onClick={handleGroup}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Group Tabs
      </button>
    </div>
  );
}
