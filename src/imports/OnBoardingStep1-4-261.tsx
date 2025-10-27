import { useState } from "react";
import svgPaths from "./svg-4v5h4tf2ts";
import { ModeDropdown } from "../components/ModeDropdown";

const GROUPING_MODES = [
  { value: "onetime", label: "One-time" },
  { value: "smart", label: "Smart" },
  { value: "aggressive", label: "Aggressive" },
];

function Frame() {
  return (
    <div className="absolute content-stretch flex font-['Arial:Regular',_sans-serif] gap-[8px] items-center leading-[normal] left-[169px] not-italic text-[15px] text-black text-nowrap top-[54px] whitespace-pre">
      <p className="relative shrink-0">Step 1:</p>
      <p className="relative shrink-0">Choose Grouping Mode</p>
    </div>
  );
}

function IconParkRight() {
  return (
    <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-park:right">
          <path d="M9.5 6L15.5 12L9.5 18" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function GroupingMode({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute bg-[#4285f4] h-[49px] left-[24px] rounded-[200px] top-[503px] w-[361px] cursor-pointer hover:bg-[#3b78e7] active:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2" 
      data-name="Grouping Mode"
      aria-label="Proceed to next step"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-14.5px)] not-italic text-[14px] text-nowrap text-white top-[calc(50%-10.5px)] whitespace-pre">Next</p>
    </button>
  );
}

function Container() {
  return (
    <div className="bg-[#0486ff] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">1</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#9c9c9c] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">2</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#9c9c9c] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex gap-[48px] items-center left-0 top-0">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[24px] left-[219px] top-[21px] w-[168px]">
      <div className="absolute h-0 left-[12px] top-[12px] w-[143.5px]">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 2">
            <path d="M0 1H143.5" id="Vector 20" stroke="var(--stroke-0, #838383)" strokeDasharray="4 4" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Frame3 />
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#ff4f4f] h-[6.763px] left-[36.3px] rounded-[1.932px] top-[37.24px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#ffab04] h-[12.237px] left-[26px] rounded-[1.932px] top-[31.76px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#0486ff] h-[10.949px] left-[36.3px] rounded-[1.932px] top-[25px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-[#03b151] h-[5.153px] left-[26px] rounded-[1.932px] top-[25px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[26px] top-[25px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[26px] top-[24px]">
      <Group />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[53px] not-italic text-[16px] text-black text-nowrap top-[24px] whitespace-pre">Tabit</p>
    </div>
  );
}



function Group2() {
  return (
    <div className="absolute h-[297px] left-[41px] top-[179px] w-[332px]">
      <div className="absolute inset-[-0.48%_-1.01%_-1.78%_-1.01%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 339 304">
          <g id="Group 427319145">
            <g filter="url(#filter0_d_4_265)" id="Rectangle 6559">
              <path d={svgPaths.p1519bf80} fill="var(--fill-0, white)" />
              <path d={svgPaths.pbdcecc0} stroke="var(--stroke-0, #F1F5F9)" strokeWidth="0.479675" />
            </g>
            <path d="M19.3577 98.439H326.358" id="Vector 21" stroke="var(--stroke-0, #F1F5F9)" strokeWidth="3" />
            <path d="M19.3577 201.439H326.358" id="Vector 22" stroke="var(--stroke-0, #F1F5F9)" strokeWidth="3" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="303.715" id="filter0_d_4_265" width="338.715" x="2.98023e-08" y="2.98023e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.9187" />
              <feGaussianBlur stdDeviation="1.43902" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_265" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_265" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[18.508px] relative shrink-0 w-[98.985px]" data-name="Label">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18.508px] left-0 not-italic text-[12px] text-neutral-950 text-nowrap top-[-1.11px] whitespace-pre">One-time Grouping</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12.03px] items-center relative shrink-0">
      <Label />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex gap-[3.702px] items-center left-0 top-0">
      <Frame1 />
    </div>
  );
}

function Frame5({ selectedMode, onModeChange }: { selectedMode: string; onModeChange: (mode: string) => void }) {
  return (
    <label htmlFor="mode-onetime" className="absolute h-[56px] left-[58px] top-[192px] w-[300px] cursor-pointer block">
      <Frame2 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[299px]">Group your tabs once. Future tabs won't be auto-grouped. Example: Click once → Tabs neatly grouped by topic.</p>
      <input
        type="radio"
        id="mode-onetime"
        name="grouping-mode"
        value="onetime"
        checked={selectedMode === "onetime"}
        onChange={() => onModeChange("onetime")}
        className="sr-only"
      />
    </label>
  );
}

function Label1() {
  return (
    <div className="h-[18.508px] relative shrink-0 w-[98.985px]" data-name="Label">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18.508px] left-0 not-italic text-[12px] text-neutral-950 text-nowrap top-[-1.11px] whitespace-pre">Smart Grouping</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[12.03px] items-center relative shrink-0">
      <Label1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[3.702px] items-center relative shrink-0 w-[93px]">
      <Frame6 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[19px] relative shrink-0 w-[77px]">
      <div className="absolute bg-[#0486ff] h-[13px] left-0 rounded-[20px] top-[2px] w-[77px]" />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[18.508px] left-[10px] text-[10px] text-nowrap text-white top-[0px] whitespace-pre">Recommend</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex items-end left-0 top-0">
      <Frame7 />
      <Frame13 />
    </div>
  );
}

function Frame8({ selectedMode, onModeChange }: { selectedMode: string; onModeChange: (mode: string) => void }) {
  return (
    <label htmlFor="mode-smart" className="absolute h-[75px] left-[56px] top-[290px] w-[300px] cursor-pointer block">
      <Frame14 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[290px]">AI groups new tabs based on your existing categories, without changing them. Example: New "Sports" tabs will join your "Sports" group automatically.</p>
      <input
        type="radio"
        id="mode-smart"
        name="grouping-mode"
        value="smart"
        checked={selectedMode === "smart"}
        onChange={() => onModeChange("smart")}
        className="sr-only"
      />
    </label>
  );
}

function Label2() {
  return (
    <div className="h-[19px] relative shrink-0 w-[137px]" data-name="Label">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18.508px] left-0 not-italic text-[12px] text-neutral-950 text-nowrap top-[-1.11px] whitespace-pre">Aggressive Grouping</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[12.03px] items-center relative shrink-0">
      <Label2 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex gap-[3.702px] items-center left-0 top-0">
      <Frame9 />
    </div>
  );
}

function Frame12({ selectedMode, onModeChange }: { selectedMode: string; onModeChange: (mode: string) => void }) {
  return (
    <label htmlFor="mode-aggressive" className="absolute h-[75px] left-[56px] top-[385px] w-[300px] cursor-pointer block">
      <Frame11 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[299px]">Give AI full control. It may reorganize all tabs for better grouping. Example: Tabs under "Sports" might move into a new "NBA" group.</p>
      <input
        type="radio"
        id="mode-aggressive"
        name="grouping-mode"
        value="aggressive"
        checked={selectedMode === "aggressive"}
        onChange={() => onModeChange("aggressive")}
        className="sr-only"
      />
    </label>
  );
}

function FreeForm({ selectedMode, onModeChange, onNextClick }: {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  onNextClick: () => void;
}) {
  return (
    <div className="absolute h-[589px] left-0 overflow-clip top-0 w-[420px]" data-name="Free_form">
      <Frame />
      <GroupingMode onClick={onNextClick} />
      <Frame4 />
      <Group1 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18px] left-[26px] not-italic text-[12px] text-black text-nowrap top-[84px] whitespace-pre">
        Tabit starts with Smart Grouping — our recommended mode.
        <br aria-hidden="true" />
        You can change it from the dropdown menu.
      </p>
      <ModeDropdown 
        selectedMode={selectedMode}
        onModeChange={onModeChange}
        className="absolute left-[141px] top-[137px]"
      />
      <Group2 />
      <Frame5 selectedMode={selectedMode} onModeChange={onModeChange} />
      <Frame8 selectedMode={selectedMode} onModeChange={onModeChange} />
      <Frame12 selectedMode={selectedMode} onModeChange={onModeChange} />
    </div>
  );
}

export default function OnBoardingStep({ onNext }: { onNext?: () => void }) {
  const [selectedMode, setSelectedMode] = useState("smart");

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleNextClick = () => {
    console.log("Next clicked with mode:", selectedMode);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white relative rounded-[18px] size-full" data-name="OnBoarding Step1">
      <FreeForm 
        selectedMode={selectedMode}
        onModeChange={handleModeChange}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
