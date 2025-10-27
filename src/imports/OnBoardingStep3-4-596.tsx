import { useState } from "react";
import svgPaths from "./svg-cetafguzgh";

function Card() {
  return (
    <div className="[grid-area:1_/_1] bg-[#ff4f4f] h-[6.763px] ml-[10.305px] mt-[12.237px] relative rounded-[1.932px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_1] bg-[#ffab04] h-[12.237px] ml-0 mt-[6.763px] relative rounded-[1.932px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card2() {
  return (
    <div className="[grid-area:1_/_1] bg-[#0486ff] h-[10.949px] ml-[10.305px] mt-0 relative rounded-[1.932px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card3() {
  return (
    <div className="[grid-area:1_/_1] bg-[#03b151] h-[5.153px] ml-0 mt-0 relative rounded-[1.932px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-px place-items-start relative">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group />
      <p className="[grid-area:1_/_1] font-['Audiowide:Regular',_sans-serif] leading-[20px] ml-[27px] mt-0 not-italic relative text-[16px] text-black text-nowrap whitespace-pre">Tabit</p>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#0486ff] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[48px] items-center left-0 top-0">
      <div className="relative shrink-0 size-[24px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path clipRule="evenodd" d={svgPaths.p31faca00} fill="var(--fill-0, #0486FF)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path clipRule="evenodd" d={svgPaths.p31faca00} fill="var(--fill-0, #0486FF)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <Container />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[168px]">
      <div className="absolute h-0 left-[12px] top-[12px] w-[143.5px]">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 2">
            <path d="M0 1H143.5" id="Vector 20" stroke="var(--stroke-0, #838383)" strokeDasharray="4 4" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Frame />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Group2 />
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Arial:Regular',_sans-serif] gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-[15px] text-black text-nowrap whitespace-pre">
      <p className="relative shrink-0">Step 3:</p>
      <p className="relative shrink-0">Suggested Number of Tabs</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-end relative shrink-0 w-full">
      <Frame11 />
      <Frame1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
      <Frame12 />
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 w-[351px]">The suggested maximum number of tabs per group is 10. You can use the slider to set your preferred minimum and maximum within the range of 1–10.</p>
    </div>
  );
}

function Group1({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  const minPercent = ((minValue - 1) / 9) * 100;
  const maxPercent = ((maxValue - 1) / 9) * 100;

  return (
    <div className="h-[20px] relative shrink-0 w-[255px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 255 20">
        <g id="Group 427319140">
          <g id="slider">
            <rect fill="white" height="8" transform="translate(5 6)" width="250" />
            <path d={svgPaths.p300c9c00} fill="var(--fill-0, #F1F5F9)" id="area" />
            <rect 
              fill="var(--fill-0, #4285F4)" 
              height="8" 
              id="progress" 
              rx="4" 
              width={`${(maxPercent - minPercent) * 250 / 100}`}
              x={5 + (minPercent * 250 / 100)}
              y="6" 
            />
          </g>
          <circle 
            cx={5 + (maxPercent * 250 / 100)} 
            cy="10" 
            fill="var(--fill-0, white)" 
            id="indicator" 
            r="9" 
            stroke="var(--stroke-0, #4285F4)" 
            strokeWidth="2" 
          />
          <circle 
            cx={5 + (minPercent * 250 / 100)} 
            cy="10" 
            fill="var(--fill-0, white)" 
            id="indicator_2" 
            r="9" 
            stroke="var(--stroke-0, #4285F4)" 
            strokeWidth="2" 
          />
        </g>
      </svg>
      
      {/* Invisible range inputs for interaction */}
      <input
        type="range"
        min="1"
        max="10"
        value={minValue}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (val < maxValue) {
            onMinChange(val);
          }
        }}
        className="absolute w-[255px] h-[20px] opacity-0 cursor-pointer z-20"
        style={{ top: 0, left: 0 }}
        aria-label="Minimum tabs"
      />
      <input
        type="range"
        min="1"
        max="10"
        value={maxValue}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (val > minValue) {
            onMaxChange(val);
          }
        }}
        className="absolute w-[255px] h-[20px] opacity-0 cursor-pointer z-20"
        style={{ top: 0, left: 0 }}
        aria-label="Maximum tabs"
      />
    </div>
  );
}

function Frame3({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[5px] items-center ml-0 mt-0 relative">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#060606] text-[14px] w-[27px]">{`Min `}</p>
      <Group1 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] ml-[5px] not-italic relative shrink-0 text-[#060606] text-[14px] w-[27px]">{`Max `}</p>
    </div>
  );
}

function Group3({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[11px] mt-[23px] place-items-start relative">
      <Frame3 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
      <p className="[grid-area:1_/_1] font-['Arial:Regular',_sans-serif] leading-[20px] ml-[38px] mt-[26px] not-italic relative text-[14px] text-black text-nowrap whitespace-pre">{minValue}</p>
      <p className="[grid-area:1_/_1] font-['Arial:Regular',_sans-serif] leading-[20px] ml-[249px] mt-[26px] not-italic relative text-[14px] text-black text-nowrap whitespace-pre">{maxValue}</p>
    </div>
  );
}

function Group4({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] flex h-[79px] items-center justify-center ml-0 mt-0 relative w-[356px]">
        <div className="flex-none scale-y-[-100%]">
          <div className="bg-white h-[79px] relative rounded-[5px] w-[356px]">
            <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[5px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>
      <Group3 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
    </div>
  );
}

function Frame4({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7px] items-end mb-[-37px] relative shrink-0 w-full">
      <Group4 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[69px] mb-[-37px] relative shrink-0 w-[54px]">
      <div className="absolute bottom-0 left-[-7.41%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58 69">
          <g id="Frame 427319156">
            <g filter="url(#filter0_d_4_609)" id="Vector">
              <path d={svgPaths.p37b2c380} fill="var(--fill-0, white)" />
              <path d={svgPaths.p3f0993f0} stroke="var(--stroke-0, #9C9C9C)" />
            </g>
            <path d={svgPaths.p315ad270} fill="var(--fill-0, #4285F4)" id="Vector_2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="54" id="filter0_d_4_609" width="51" x="-9.64218e-08" y="1.16698e-06">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_609" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_609" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame6({ minValue, maxValue, onMinChange, onMaxChange }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-col items-center pb-[37px] pt-0 px-0 relative shrink-0 w-[356px]">
      <Frame4 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
      <Frame5 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 5">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">{`Group 1: Entertainment `}</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[75px] items-start left-[35.2px] opacity-[0.26] top-[0.2px] w-[305px]" data-name="Container">
      <Heading />
      <p className="font-['Arial:Italic',_sans-serif] italic leading-[19.5px] relative shrink-0 text-[12px] text-[rgba(113,113,130,0.7)] w-[295px]">{`"Tabs focused on media, streaming, and leisure content. Includes following ......"`}</p>
    </div>
  );
}

function PromptSelection() {
  return (
    <div className="h-[75px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75px] relative w-full">
        <Container1 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[88px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[0.01px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[88px] left-0 top-0 w-[354px]" data-name="Container">
      <Card4 />
    </div>
  );
}

function Card5({ minValue }: { minValue: number }) {
  return (
    <div className="bg-[#ff4f4f] relative rounded-[6px] shrink-0 size-[28px]" data-name="Card">
      <div className="box-border content-stretch flex flex-col items-center justify-center overflow-clip p-[0.8px] relative rounded-[inherit] size-[28px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-white w-[6px]">{minValue}</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Group5() {
  return (
    <div className="h-[30px] relative shrink-0 w-[15px]">
      <div className="absolute bottom-0 left-0 right-0 top-[-3.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 31">
          <g id="Group 427319148">
            <path d={svgPaths.p395b7800} fill="var(--fill-0, #4285F4)" id="Vector" stroke="var(--stroke-0, #4285F4)" />
            <line id="Line 1" stroke="var(--stroke-0, #4285F4)" x2="15" y1="0.5" y2="0.5" />
            <line id="Line 2" stroke="var(--stroke-0, #4285F4)" x2="15" y1="30.5" y2="30.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame7({ minValue }: { minValue: number }) {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <Card5 minValue={minValue} />
      <Group5 />
    </div>
  );
}

function Frame8({ minValue }: { minValue: number }) {
  return (
    <div className="h-[88px] mb-[-39px] relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[88px] items-start px-[12px] py-[15px] relative w-full">
          <Container2 />
          <Frame7 minValue={minValue} />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="box-border content-end flex flex-wrap gap-[2px] items-end mb-[-39px] relative shrink-0 w-[327px]">
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "94.5", "--transform-inner-height": "25.984375" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[26px] relative w-[94.5px]">
            <div className="absolute bottom-[-1.44%] left-0 right-[-2.92%] top-[-1.44%]" style={{ "--stroke-0": "rgba(66, 133, 244, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 27">
                <path d={svgPaths.p23dfcc80} fill="var(--stroke-0, #4285F4)" id="Line 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 w-[262px]">{`The length represents the span of the group `}</p>
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 w-[231px]">The number indicates the total tab count</p>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[21px] top-[11.5px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "61", "--transform-inner-height": "4.984375" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[5px] relative w-[61px]">
            <div className="absolute bottom-[-7.5%] left-0 right-[-4.53%] top-[-7.5%]" style={{ "--fill-0": "rgba(66, 133, 244, 1)", "--stroke-0": "rgba(66, 133, 244, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 6">
                <path d={svgPaths.p3864ba80} fill="var(--stroke-0, #4285F4)" id="Line 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame10({ minValue }: { minValue: number }) {
  return (
    <div className="box-border content-stretch flex flex-col items-end justify-center pb-[39px] pt-0 px-0 relative shrink-0 w-[354px]">
      <Frame8 minValue={minValue} />
      <Frame9 />
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
      className="bg-[#4285f4] h-[49px] relative rounded-[200px] shrink-0 w-full cursor-pointer hover:bg-[#3b78e7] active:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2"
      data-name="Grouping Mode"
      aria-label="Get started with Tabit"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-36px)] not-italic text-[14px] text-nowrap text-white top-[calc(50%-10.5px)] whitespace-pre">Get Started</p>
    </button>
  );
}

function Frame14({ minValue, maxValue, onMinChange, onMaxChange, onGetStarted }: {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onGetStarted: () => void;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-center left-[24px] top-[21px] w-[368px]">
      <Frame13 />
      <Frame6 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
      <Frame10 minValue={minValue} />
      <GroupingMode onClick={onGetStarted} />
    </div>
  );
}

export default function OnBoardingStep({ onNext }: { onNext?: () => void }) {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(10);

  const handleGetStarted = () => {
    console.log("Get Started clicked", { minValue, maxValue });
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="OnBoarding Step3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[52px] not-italic text-[12px] text-white top-[174px] w-[6px]">{minValue}</p>
      <Frame14 
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={setMinValue}
        onMaxChange={setMaxValue}
        onGetStarted={handleGetStarted}
      />
    </div>
  );
}
