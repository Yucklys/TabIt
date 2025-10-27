import { useState } from "react";
import svgPaths from "./svg-8cg8uxzz0c";

const GROUPING_MODES = [
  { value: "smart", label: "Smart" },
  { value: "onetime", label: "One-time" },
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
      className="absolute bg-[#4285f4] h-[49px] left-[24px] rounded-[200px] top-[503px] w-[361px] cursor-pointer hover:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2" 
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

function GridiconsDropdown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="gridicons:dropdown">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="gridicons:dropdown">
          <path d="M7 10L12 15L17 10H7Z" fill="var(--fill-0, #717182)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame10({ selectedMode, isDropdownOpen, onToggle, onModeChange }: { 
  selectedMode: string; 
  isDropdownOpen: boolean; 
  onToggle: () => void;
  onModeChange: (mode: string) => void;
}) {
  const selectedLabel = GROUPING_MODES.find((m) => m.value === selectedMode)?.label;
  
  return (
    <div className="absolute left-[141px] top-[137px]">
      <button
        onClick={onToggle}
        className="bg-[#f3f3f5] box-border content-stretch flex gap-[10px] items-center justify-center px-[7px] py-0 rounded-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#e5e5e7] transition-colors duration-200"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-label="Select grouping mode"
        type="button"
      >
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Mode: {selectedLabel}</p>
        <GridiconsDropdown />
      </button>
      {isDropdownOpen && (
        <ul
          className="absolute top-full left-0 mt-1 bg-white rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] py-2 min-w-full z-10"
          role="listbox"
        >
          {GROUPING_MODES.map((mode) => (
            <li key={mode.value}>
              <button
                className="w-full px-4 py-2 text-left font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-black text-nowrap hover:bg-[#f3f3f5] cursor-pointer transition-colors duration-200"
                onClick={() => onModeChange(mode.value)}
                role="option"
                aria-selected={selectedMode === mode.value}
                type="button"
              >
                {mode.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute h-[297px] left-[41px] top-[179px] w-[332px]">
      <div className="absolute inset-[-2.86%_-3.76%_-5.55%_-3.76%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 357 322">
          <g filter="url(#filter0_d_3_154)" id="Group 427319145">
            <g filter="url(#filter1_d_3_154)" id="Rectangle 6559">
              <path d={svgPaths.p31c65f80} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2617a000} stroke="var(--stroke-0, #F1F5F9)" strokeWidth="0.479675" />
            </g>
            <path d="M28.4797 105.48H335.48" id="Vector 21" stroke="var(--stroke-0, #F1F5F9)" strokeWidth="3" />
            <path d="M28.4797 208.48H335.48" id="Vector 22" stroke="var(--stroke-0, #F1F5F9)" strokeWidth="3" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="321.959" id="filter0_d_3_154" width="356.959" x="-4.47035e-07" y="-4.47035e-07">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_154" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_154" mode="normal" result="shape" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="303.715" id="filter1_d_3_154" width="338.715" x="9.12195" y="7.04065">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1.9187" />
              <feGaussianBlur stdDeviation="1.43902" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_154" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_154" mode="normal" result="shape" />
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

function Frame5() {
  return (
    <div className="absolute h-[56px] left-[58px] top-[192px] w-[300px]">
      <Frame2 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[299px]">Group your tabs once. Future tabs won’t be auto-grouped. Example: Click once → Tabs neatly grouped by topic.</p>
    </div>
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
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[18.508px] left-[10px] text-[10px] text-nowrap text-white top-[-1px] whitespace-pre">Recommend</p>
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

function Frame8() {
  return (
    <div className="absolute h-[75px] left-[56px] top-[290px] w-[300px]">
      <Frame14 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[290px]">AI groups new tabs based on your existing categories, without changing them. Example: New “Sports” tabs will join your “Sports” group automatically.</p>
    </div>
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

function Frame12() {
  return (
    <div className="absolute h-[75px] left-[56px] top-[385px] w-[300px]">
      <Frame11 />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[normal] left-0 text-[#686868] text-[12px] top-[19px] w-[299px]">Give AI full control. It may reorganize all tabs for better grouping. Example: Tabs under “Sports” might move into a new “NBA” group.</p>
    </div>
  );
}

function FreeForm({ selectedMode, isDropdownOpen, onToggleDropdown, onModeChange, onNextClick }: {
  selectedMode: string;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
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
      <Frame10 
        selectedMode={selectedMode} 
        isDropdownOpen={isDropdownOpen} 
        onToggle={onToggleDropdown}
        onModeChange={onModeChange}
      />
      <Group2 />
      <Frame5 />
      <Frame8 />
      <Frame12 />
    </div>
  );
}

export default function OnBoardingStep() {
  const [selectedMode, setSelectedMode] = useState("smart");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setIsDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNextClick = () => {
    console.log("Next clicked with mode:", selectedMode);
  };

  return (
    <div className="bg-white relative rounded-[18px] size-full" data-name="OnBoarding Step1">
      <FreeForm 
        selectedMode={selectedMode}
        isDropdownOpen={isDropdownOpen}
        onToggleDropdown={handleToggleDropdown}
        onModeChange={handleModeChange}
        onNextClick={handleNextClick}
      />
    </div>
  );
}