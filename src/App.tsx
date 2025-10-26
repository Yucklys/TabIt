import { useEffect } from 'react'
import { oneTimeGrouping } from './api';

export default function App() {
  useEffect(() => {
    // Run AI categorization + create tab groups automatically
    const runGrouping = async () => {
      try {
        await oneTimeGrouping(); // AI categorize + create tab groups
      } catch (error) {
        console.error('Error in TabSense extension:', error);
      }
    };

    runGrouping();
  }, []);

  // Return empty component - all output goes to console
  return null;
}
