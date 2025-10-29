import { useState, useEffect } from "react";
import { LayoutGroup } from "motion/react";
import OnBoardingStep1 from "./imports/OnBoardingStep1-4-261";
import OnBoardingStep2 from "./imports/OnBoardingStep2";
import OnBoardingStep3 from "./imports/OnBoardingStep31";
import GeneratingGroupsFrame1 from "./imports/GeneratingGroups-4-3173";
import GeneratingGroupsFrame2 from "./imports/GeneratingGroups-4-3185";
import GeneratingGroupsComplete from "./imports/GeneratingGroups-4-3179";
import Suggestion from "./imports/Suggestion";
import SuggestionFinal from "./imports/Suggestion-5-98-interactive";
import CustomizeInteractive from "./components/CustomizeInteractive";
import { getUserSettings, saveUserSettings } from "./api/storage";
import { oneTimeGrouping } from "./mode/oneTime";
import { smartGrouping } from "./mode/smart";
import { aggressiveGrouping } from "./mode/aggressive";
import { getAllTabGroups, addTabsToExistingGroup, createTabGroup } from "./api/tabGroups";

export default function App() {
  const [currentStep, setCurrentStep] = useState(7); // Default to 7, will be set to 1 if startup event occurs
  const [loadingFrame, setLoadingFrame] = useState(1);
  const [selectedMode, setSelectedMode] = useState("smart");
  const [categorizedResult, setCategorizedResult] = useState<{ [category: string]: [number, ...number[]] } | null>(null);

  // Check for startup event and load user settings on mount
  useEffect(() => {
    const checkStartupAndLoadSettings = async () => {
      try {
        // Listen for startup event
        chrome.runtime.onStartup.addListener(() => {
          setCurrentStep(1);
        });

        const settings = await getUserSettings();
        setSelectedMode(settings.selectedMode || "smart");
      } catch (error) {
        console.error("Failed to load user settings:", error);
      }
    };
    checkStartupAndLoadSettings();
  }, []);

  // Listen for categorization completion in session storage
  useEffect(() => {
    const handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'session' && changes.categorizationStatus) {
        const status = changes.categorizationStatus.newValue;
        
        if ((status === 'completed' || status === 'no-tabs') && changes.categorizedResult) {
          setCategorizedResult(changes.categorizedResult.newValue as { [category: string]: [number, ...number[]] });
          setCurrentStep(5); // Jump to suggestion step
        } else if (status === 'error') {
          console.error('Categorization failed:', changes.categorizationError?.newValue);
          // Handle error state
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const startAIGrouping = async () => {
    console.log("Starting AI categorization...");
    
    // Save current settings (customPrompt and customGroups are already saved by CustomizeInteractive)
    await saveUserSettings({
      selectedMode: selectedMode as 'onetime' | 'smart' | 'aggressive'
    });
    
    setCurrentStep(4);
    setLoadingFrame(1);
      
    // Clear previous results and start categorization
    await chrome.storage.session.set({ categorizationStatus: 'processing' });
      
    try {
      // Execute the appropriate categorization function
      switch(selectedMode) {
        case 'onetime':
          await oneTimeGrouping();
          break;
        case 'smart':
          await smartGrouping();
          break;
        case 'aggressive':
          await aggressiveGrouping();
          break;
      }
    } catch (error) {
      console.error("Error during categorization:", error);
    }
  };

  const handleStep3Complete = async () => {
    console.log("Step 3 completed, showing loading animation...");
    await startAIGrouping();
  };

  const handleViewResults = () => {
    console.log("View results clicked, showing suggestion page");
    setCurrentStep(6);
  };

  const handleModeChange = async (mode: string) => {
    setSelectedMode(mode);
    await saveUserSettings({ selectedMode: mode as 'onetime' | 'smart' | 'aggressive' });
  };

  const handleConfirmGrouping = async (
    modifiedNames?: { [category: string]: string },
    modifiedColors?: { [category: string]: chrome.tabGroups.Color }
  ) => {
    console.log("Confirm Grouping clicked, creating tab groups...");
    console.log("Modified names received:", modifiedNames);
    console.log("Modified colors received:", modifiedColors);
    
    if (categorizedResult) {
      try {
        // Always check for existing groups to avoid duplicates (for all modes)
        const existingGroups = await getAllTabGroups();
        const existingGroupNames = new Set(existingGroups.map(g => g.title).filter(Boolean));
        
        console.log('Checking for existing groups:', Array.from(existingGroupNames));
        
        for (const [category, tabIndices] of Object.entries(categorizedResult)) {
          if (tabIndices.length > 0) {
            // Use modified name if provided, otherwise use original category
            const originalCategory = category;
            const groupName = modifiedNames?.[category] || category;
            const color = modifiedColors?.[category];
            
            console.log(`Processing category: "${originalCategory}" -> final name: "${groupName}"`);
            
            // Check if group with this name already exists in Chrome
            const existingGroup = existingGroups.find(g => g.title === groupName);
            
            if (existingGroup) {
              // Group already exists in Chrome, merge tabs into it
              console.log(`✓ Group "${groupName}" already exists in Chrome (ID: ${existingGroup.id}), merging ${tabIndices.length} tabs into it`);
              await addTabsToExistingGroup(existingGroup.id, tabIndices, color);
            } else {
              // No existing group found, create new one
              console.log(`✗ Group "${groupName}" doesn't exist in Chrome, creating new group with ${tabIndices.length} tabs`);
              await createTabGroup(tabIndices, groupName, color);
            }
          }
        }
        
        console.log("Tab groups created successfully");
        setCurrentStep(7);
      } catch (error) {
        console.error("Error creating tab groups:", error);
        // Handle error state
      }
    }
  };

  const handleCustomize = () => {
    console.log("Customize clicked, navigating to customize page");
    setCurrentStep(8);
  };

  const handleCustomizeComplete = async () => {
    console.log("Customize completed, starting AI categorization...");
    
    // Settings are already saved in storage by CustomizeInteractive's handleGetStarted
    // Just start the AI grouping process
    await startAIGrouping();
  };

  // Animate through loading frames with 300ms delays (but stay in step 4 until AI completes)
  useEffect(() => {
    if (currentStep === 4) {
      if (loadingFrame === 1) {
        const timer = setTimeout(() => {
          setLoadingFrame(2);
        }, 300);
        return () => clearTimeout(timer);
      } else if (loadingFrame === 2) {
        const timer = setTimeout(() => {
          setLoadingFrame(1); // Loop back to frame 1 to keep animating
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, loadingFrame]);

  return (
    <LayoutGroup>
      {currentStep === 1 && <OnBoardingStep1 onNext={handleNextStep} />}
      {currentStep === 2 && <OnBoardingStep2 onNext={handleNextStep} />}
      {currentStep === 3 && <OnBoardingStep3 onNext={handleStep3Complete} />}
      {currentStep === 4 && loadingFrame === 1 && <GeneratingGroupsFrame1 selectedMode={selectedMode} onModeChange={handleModeChange} />}
      {currentStep === 4 && loadingFrame === 2 && <GeneratingGroupsFrame2 selectedMode={selectedMode} onModeChange={handleModeChange} />}
      {currentStep === 5 && <GeneratingGroupsComplete onNext={handleViewResults} selectedMode={selectedMode} onModeChange={handleModeChange} />}
      {currentStep === 6 && <Suggestion selectedMode={selectedMode} onModeChange={handleModeChange} onConfirm={handleConfirmGrouping} onCustomize={handleCustomize} categorizedResult={categorizedResult || {}} />}
      {currentStep === 7 && <SuggestionFinal selectedMode={selectedMode} onModeChange={handleModeChange} onCustomize={handleCustomize} categorizedResult={categorizedResult || {}} />}
      {currentStep === 8 && <CustomizeInteractive 
        selectedMode={selectedMode} 
        onModeChange={handleModeChange} 
        onNext={handleCustomizeComplete}
      />}
    </LayoutGroup>
  );
}
