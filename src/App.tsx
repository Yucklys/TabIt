import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { getTabInfoList, getUngroupedTabs } from './api/tabs';

const fetchTabs = async () => {
  const tabs = await getUngroupedTabs();
  console.log('Found tabs:', tabs.length);
  
  const tabInfoList = getTabInfoList(tabs);
  console.log('Valid tabs:', tabInfoList.length);
  
  tabInfoList.forEach((tabInfo) => {
    console.log(`Tab ${tabInfo.index}:`, tabInfo);
  });
};

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetchTabs();
  }, [count]);

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>
        {count}
      </Button>
    </>
  )
}

export default App
