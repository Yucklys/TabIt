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

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingFrame, setLoadingFrame] = useState(1);
  const [selectedMode, setSelectedMode] = useState("smart");

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleStep3Complete = () => {
    console.log("Step 3 completed, showing loading animation...");
    // 800ms delay before showing loading animation (as per Figma interaction settings)
    setTimeout(() => {
      setCurrentStep(4);
      setLoadingFrame(1);
    }, 800);
  };

  const handleViewResults = () => {
    console.log("View results clicked, showing suggestion page");
    setCurrentStep(6);
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleConfirmGrouping = () => {
    console.log("Confirm Grouping clicked, showing final suggestion page");
    setCurrentStep(7);
  };

  const handleCustomize = () => {
    console.log("Customize clicked, navigating to customize page");
    setCurrentStep(8);
  };

  const handleCustomizeComplete = () => {
    console.log("Customize completed, showing loading animation...");
    setTimeout(() => {
      setCurrentStep(4);
      setLoadingFrame(1);
    }, 800);
  };

  // Animate through loading frames with 300ms delays
  useEffect(() => {
    if (currentStep === 4) {
      if (loadingFrame === 1) {
        const timer = setTimeout(() => {
          setLoadingFrame(2);
        }, 300);
        return () => clearTimeout(timer);
      } else if (loadingFrame === 2) {
        const timer = setTimeout(() => {
          setCurrentStep(5); // Show complete screen
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
      {currentStep === 6 && <Suggestion selectedMode={selectedMode} onModeChange={handleModeChange} onConfirm={handleConfirmGrouping} onCustomize={handleCustomize} />}
      {currentStep === 7 && <SuggestionFinal selectedMode={selectedMode} onModeChange={handleModeChange} onCustomize={handleCustomize} />}
      {currentStep === 8 && <CustomizeInteractive selectedMode={selectedMode} onModeChange={handleModeChange} onNext={handleCustomizeComplete} />}
    </LayoutGroup>
  );
}
