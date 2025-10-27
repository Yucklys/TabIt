import { useState } from "react";
import svgPaths from "./svg-pk7zmsgwke";
import imgImage3 from "figma:asset/c8cf831e401baf9df094bfc573e49eb5cbf4431d.png";

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

function Group1() {
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
          <circle cx="12" cy="12" r="12" fill="#0486FF"/>
          <path d="M18.4452 8.202C18.5013 8.14417 18.5453 8.07562 18.5743 8.00044C18.6034 7.92527 18.617 7.845 18.6144 7.76445C18.6117 7.68389 18.5929 7.6047 18.559 7.53158C18.525 7.45847 18.4767 7.39294 18.4169 7.3389C18.3571 7.28487 18.2871 7.24343 18.2109 7.21708C18.1347 7.19072 18.054 7.17998 17.9736 7.18549C17.8932 7.19101 17.8147 7.21267 17.7429 7.24918C17.671 7.28569 17.6073 7.3363 17.5554 7.398L10.368 15.3402L6.414 11.5656C6.29895 11.4556 6.14493 11.3959 5.98582 11.3995C5.82672 11.4031 5.67556 11.4697 5.5656 11.5848C5.45564 11.6999 5.39589 11.8539 5.39949 12.013C5.40309 12.1721 5.46975 12.3232 5.5848 12.4332L9.9852 16.6332L10.431 17.0592L10.8444 16.602L18.4452 8.202Z" fill="white"/>
        </svg>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="#0486FF"/>
          <path d="M18.4452 8.202C18.5013 8.14417 18.5453 8.07562 18.5743 8.00044C18.6034 7.92527 18.617 7.845 18.6144 7.76445C18.6117 7.68389 18.5929 7.6047 18.559 7.53158C18.525 7.45847 18.4767 7.39294 18.4169 7.3389C18.3571 7.28487 18.2871 7.24343 18.2109 7.21708C18.1347 7.19072 18.054 7.17998 17.9736 7.18549C17.8932 7.19101 17.8147 7.21267 17.7429 7.24918C17.671 7.28569 17.6073 7.3363 17.5554 7.398L10.368 15.3402L6.414 11.5656C6.29895 11.4556 6.14493 11.3959 5.98582 11.3995C5.82672 11.4031 5.67556 11.4697 5.5656 11.5848C5.45564 11.6999 5.39589 11.8539 5.39949 12.013C5.40309 12.1721 5.46975 12.3232 5.5848 12.4332L9.9852 16.6332L10.431 17.0592L10.8444 16.602L18.4452 8.202Z" fill="white"/>
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

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Group1 />
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

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[9px] items-end relative shrink-0 w-full">
      <Frame7 />
      <Frame1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
      <Frame8 />
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 w-[351px]">The suggested maximum number of tabs per group is 10. You can use the slider to set your preferred minimum and maximum within the range of 1–10.</p>
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

function Group2() {
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

function Frame3({ minValue }: { minValue: number }) {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <Card5 minValue={minValue} />
      <Group2 />
    </div>
  );
}

function Frame4({ minValue }: { minValue: number }) {
  return (
    <div className="h-[88px] mb-[-39px] relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[88px] items-start px-[12px] py-[15px] relative w-full">
          <Container2 />
          <Frame3 minValue={minValue} />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
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

function Frame6({ minValue }: { minValue: number }) {
  return (
    <div className="box-border content-stretch flex flex-col items-end justify-center pb-[39px] pt-0 px-0 relative shrink-0 w-[354px]">
      <Frame4 minValue={minValue} />
      <Frame5 />
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

function Frame10({ minValue, onGetStarted }: { minValue: number; onGetStarted: () => void }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-center left-[24px] top-[21px] w-[368px]">
      <Frame9 />
      <div className="h-[121px] relative shrink-0 w-[380px]" data-name="image 3">
        <img alt="Slider demonstration showing min and max range from 1 to 10" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
      <Frame6 minValue={minValue} />
      <GroupingMode onClick={onGetStarted} />
    </div>
  );
}

export default function OnBoardingStep({ onNext }: { onNext?: () => void }) {
  const [minValue] = useState(1);

  const handleGetStarted = () => {
    console.log("Get Started clicked", { minValue, maxValue: 10 });
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="OnBoarding Step3 -1">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[52px] not-italic text-[12px] text-white top-[174px] w-[6px]">{minValue}</p>
      <Frame10 minValue={minValue} onGetStarted={handleGetStarted} />
    </div>
  );
}
