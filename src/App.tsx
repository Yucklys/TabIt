import { useEffect } from 'react'
import { categorizeAllTabsSmart } from './api';

export default function App() {
  useEffect(() => {
    // Automatically run categorization when the extension loads
    const runCategorization = async () => {
      try {
        await categorizeAllTabsSmart(); 
      } catch (error) {
        console.error('Error in TabSense extension:', error);
      }
    };

    runCategorization();
  }, []);

  // Return empty component - all output goes to console
  return null;
}
