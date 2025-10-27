import svgPaths from "./svg-o6apl1yuol";

function Heading() {
  return (
    <div className="h-[20px] relative shrink-0 w-[246px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[246px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">
          <span className="font-['Arial:Regular',_sans-serif] not-italic">Suggested Number of Tabs Per Group</span>{" "}
        </p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.33%_0.78%_8.33%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <g id="Vector"></g>
          <path d={svgPaths.p33b2a200} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteQuestionLine() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="mingcute:question-line">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border relative size-[16px]">
        <Group />
      </div>
    </div>
  );
}

function TitleDefineGroupingRules() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Title Define Grouping Rules">
      <Heading />
      <MingcuteQuestionLine />
    </div>
  );
}

function Group3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[287px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 287 20">
        <g id="Group 427319140">
          <g id="slider">
            <rect fill="white" height="8" transform="translate(5 6)" width="282" />
            <path d={svgPaths.p300c9c00} fill="var(--fill-0, #F1F5F9)" id="area" />
            <rect fill="var(--fill-0, #4285F4)" height="8" id="progress" rx="4" width="141" x="5" y="6" />
          </g>
          <circle cx="144" cy="10" fill="var(--fill-0, white)" id="indicator" r="9" stroke="var(--stroke-0, #4285F4)" strokeWidth="2" />
          <circle cx="10" cy="10" fill="var(--fill-0, white)" id="indicator_2" r="9" stroke="var(--stroke-0, #4285F4)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[5px] items-center ml-0 mt-0 relative">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#060606] text-[14px] w-[27px]">{`Min `}</p>
      <Group3 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[292px] not-italic text-[#060606] text-[14px] top-0 w-[27px]">{`Max `}</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[11px] mt-[23px] place-items-start relative">
      <Frame2 />
      <p className="[grid-area:1_/_1] font-['Arial:Regular',_sans-serif] leading-[20px] ml-[38px] mt-[26px] not-italic relative text-[14px] text-black text-nowrap whitespace-pre">1</p>
      <p className="[grid-area:1_/_1] font-['Arial:Regular',_sans-serif] leading-[20px] ml-[172px] mt-[26px] not-italic relative text-[14px] text-black text-nowrap whitespace-pre">6</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] flex h-[79px] items-center justify-center ml-0 mt-0 relative w-[356px]">
        <div className="flex-none scale-y-[-100%]">
          <div className="h-[79px] relative rounded-[12px] w-[356px]">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
          </div>
        </div>
      </div>
      <Group5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-end left-[31px] top-[330.99px] w-[357px]">
      <TitleDefineGroupingRules />
      <Group6 />
    </div>
  );
}

function FreeForm() {
  return <div className="absolute h-[589px] left-0 top-0 w-[420px]" data-name="Free_form" />;
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[15.988px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Additional Rules (Optional):</p>
    </div>
  );
}

function Textarea() {
  return (
    <div className="h-[85px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[85px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] w-[330px]">e.g., Keep social media tabs separate, merge all news sites</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[32px] top-[198px] w-[356px]" data-name="Container">
      <PrimitiveLabel />
      <Textarea />
    </div>
  );
}

function Frame() {
  return <div className="absolute h-[50px] left-[16px] top-[513px] w-[69px]" />;
}

function Card() {
  return (
    <div className="absolute bg-[#ff4f4f] h-[6.763px] left-[36.3px] rounded-[1.932px] top-[35.24px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#ffab04] h-[12.237px] left-[26px] rounded-[1.932px] top-[29.76px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#0486ff] h-[10.949px] left-[36.3px] rounded-[1.932px] top-[23px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-[#03b151] h-[5.153px] left-[26px] rounded-[1.932px] top-[23px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[26px] top-[23px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[26px] top-[22px]">
      <Group2 />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[53px] not-italic text-[16px] text-black text-nowrap top-[22px] whitespace-pre">Tabit</p>
    </div>
  );
}

function GroupingMode() {
  return (
    <div className="absolute bg-[rgba(236,236,240,0.5)] h-[49px] left-[31px] rounded-[200px] top-[513px] w-[357px]" data-name="Grouping Mode">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-37.5px)] not-italic text-[14px] text-black text-nowrap top-[14px] whitespace-pre">Get Started!</p>
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

function Frame1() {
  return (
    <div className="absolute bg-[#f3f3f5] box-border content-stretch flex gap-[10px] items-center justify-center left-[106px] px-[7px] py-0 rounded-[12px] top-[20px]">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Mode: Smart</p>
      <GridiconsDropdown />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="absolute h-[15.988px] left-0 top-[0.01px] w-[356px]" data-name="Primitive.label">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-0.01px] whitespace-pre">Choose or Enter Categories</p>
    </div>
  );
}

function GridiconsDropdown1() {
  return (
    <div className="relative size-[24px]" data-name="gridicons:dropdown">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="gridicons:dropdown">
          <path d="M7 10L12 15L17 10H7Z" fill="var(--fill-0, #E5E5E5)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#4285f4] box-border content-stretch flex h-[27.988px] items-center justify-center left-[10px] px-[12px] py-[6px] rounded-[10px] top-[12px] w-[105.75px]" data-name="Button">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white w-[76px]">Entertainment</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#4285f4] box-border content-stretch flex h-[27.988px] items-start left-[122.75px] px-[12px] py-[6px] rounded-[10px] top-[12px] w-[75.1px]" data-name="Button">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Research</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#4285f4] box-border content-stretch flex h-[27.988px] items-start left-[204.85px] px-[12px] py-[6px] rounded-[10px] top-[12px] w-[54.65px]" data-name="Button">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[12px] text-white">Work</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#4285f4] box-border content-stretch flex h-[28px] items-start left-[290px] px-0 py-[6px] rounded-[10px] top-[12.01px] w-[29px]" data-name="Button">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[12px] text-center text-white">3</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[20.83%_12.5%_20.78%_12.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 8">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p35757300} fill="var(--fill-0, #717182)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p342ed3b0} fill="var(--fill-0, #717182)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MiEnter() {
  return (
    <div className="absolute left-[314px] size-[13px] top-[61.01px]" data-name="mi:enter">
      <Group1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[10px] top-[96px]">
      <div className="bg-[#d9d9d9] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[73.188px]">Social Media</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[10px] top-[192px]">
      <div className="bg-[#d9d9d9] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[73.188px]">Shopping</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[10px] top-[128px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[96px]">Entertainment</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[10px] top-[160px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[96px]">Research</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[135px] top-[96px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[73.188px]">News</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[135px] top-[192px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[73.188px]">Email</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[135px] top-[128px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[96px]">Documentation</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[135px] top-[160px]">
      <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-950 w-[96px]">Work</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-white h-[250px] left-0 rounded-[8px] top-[24px] w-[356px]" data-name="Input">
      <div className="h-[250px] overflow-clip relative rounded-[inherit] w-[356px]">
        <div className="absolute flex items-center justify-center left-[321px] size-[24px] top-[13.99px]">
          <div className="flex-none scale-y-[-100%]">
            <GridiconsDropdown1 />
          </div>
        </div>
        <Button />
        <Button1 />
        <Button2 />
        <Button3 />
        <div className="absolute bg-[#ececf0] h-[30px] left-[10px] rounded-[5px] top-[52.99px] w-[328px]" />
        <p className="absolute font-['Aref_Ruqaa:Regular',_sans-serif] leading-[16px] left-[270px] not-italic text-[12px] text-black text-nowrap top-[22.01px] whitespace-pre">...</p>
        <MiEnter />
        <Frame4 />
        <Frame7 />
        <Frame5 />
        <Frame6 />
        <Frame8 />
        <Frame9 />
        <Frame10 />
        <Frame11 />
        <div className="absolute bg-[#d9d9d9] h-[98px] left-[333px] rounded-[12px] top-[91px] w-[4px]" />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[274px] left-0 top-0 w-[356px]" data-name="Container">
      <PrimitiveLabel1 />
      <Input />
    </div>
  );
}

function PromptTemplate() {
  return (
    <div className="absolute h-[274px] left-[32px] overflow-clip top-[93px] w-[356px]" data-name="PromptTemplate">
      <Container1 />
    </div>
  );
}

export default function Customize() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="customize">
      <Frame3 />
      <FreeForm />
      <Container />
      <Frame />
      <Group4 />
      <GroupingMode />
      <Frame1 />
      <PromptTemplate />
    </div>
  );
}