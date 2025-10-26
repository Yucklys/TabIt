import { useState } from 'react';

export default function App() {
  const [customPrompt, setCustomPrompt] = useState('');
  const [mode, setMode] = useState<'one-time' | 'smart' | 'aggressive'>('one-time');

  const handleGroup = async () => {
    const api = await import('./api');
    
    // Set custom prompt
    api.setCustomPrompt(customPrompt);
    if (customPrompt) {
      console.log('Custom prompt set:', customPrompt);
    }
    
    switch(mode) {
      case 'one-time':
        await api.oneTimeGrouping();
        break;
      case 'smart':
        await api.smartGrouping();
        break;
      case 'aggressive':
        await api.aggressiveGrouping();
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
