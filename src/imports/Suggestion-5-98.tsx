function More() {
  return (
    <div className="absolute h-[12.182px] left-[284px] top-[4px] w-[2.727px]" data-name="More">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
        <g id="More">
          <circle cx="1.36364" cy="1.36364" fill="var(--fill-0, #D9D9D9)" id="Ellipse 2" r="1.36364" />
          <circle cx="1.36371" cy="6.09093" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="1.36364" />
          <circle cx="1.36371" cy="10.8182" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="1.36364" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 5">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">{`Group 1: Entertainment `}</p>
      <More />
    </div>
  );
}

function Paragraph() {
  return <div className="h-[59px] shrink-0 w-[305px]" data-name="Paragraph" />;
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[35.2px] top-[7.2px] w-[305px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function PromptSelection() {
  return (
    <div className="h-[75px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75px] relative w-full">
        <Container />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[62px] left-[33px] top-[147px] w-[354px]" data-name="Container">
      <Card />
    </div>
  );
}

function More1() {
  return (
    <div className="h-[12.182px] relative shrink-0 w-[2.727px]" data-name="More">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
        <g id="More">
          <circle cx="1.36364" cy="1.36364" fill="var(--fill-0, #D9D9D9)" id="Ellipse 2" r="1.36364" />
          <circle cx="1.36371" cy="6.09093" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="1.36364" />
          <circle cx="1.36371" cy="10.8182" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="1.36364" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[190px] h-[20px] items-center left-[35.2px] top-[14.2px] w-[305px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Group 2: News</p>
      <More1 />
    </div>
  );
}

function PromptSelection1() {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[49px] relative w-full">
        <Container2 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[74px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[-4px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[70px] left-[33px] top-[223px] w-[354px]" data-name="Container">
      <Card1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px mr-[-2.727px] relative shrink-0" data-name="Heading 5">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-0 not-italic text-[14px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">Group 3: Shopping</p>
    </div>
  );
}

function More2() {
  return (
    <div className="h-[12.182px] mr-[-2.727px] relative shrink-0 w-[2.727px]" data-name="More">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
        <g id="More">
          <circle cx="1.36364" cy="1.36364" fill="var(--fill-0, #D9D9D9)" id="Ellipse 2" r="1.36364" />
          <circle cx="1.36371" cy="6.09093" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="1.36364" />
          <circle cx="1.36371" cy="10.8182" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="1.36364" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute box-border content-stretch flex h-[20px] items-center left-[35.2px] pl-0 pr-[2.727px] py-0 top-[0.2px] w-[287px]" data-name="Container">
      <Heading1 />
      <More2 />
    </div>
  );
}

function PromptSelection2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <Container4 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[44px] items-center left-[33px] pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[307px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection2 />
    </div>
  );
}

function Container5() {
  return <div className="absolute h-[102px] left-[33px] top-[460.99px] w-[354px]" data-name="Container" />;
}

function Container6() {
  return <div className="absolute h-[130px] left-[33px] top-[574.99px] w-[354px]" data-name="Container" />;
}

function Card3() {
  return (
    <div className="absolute bg-[#ff4f4f] left-[45px] rounded-[6px] size-[28px] top-[162px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-[#ffab04] h-[46px] left-[45px] rounded-[6px] top-[235px] w-[28px]" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[46px] items-center justify-center overflow-clip p-[0.8px] relative rounded-[inherit] w-[28px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-center text-white w-[20px]">10</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-[#0486ff] h-[19px] left-[46px] rounded-[6px] top-[320px] w-[28px]" data-name="Card">
      <div className="box-border content-stretch flex flex-col h-[19px] items-center justify-center overflow-clip p-[0.8px] relative rounded-[inherit] w-[28px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white whitespace-pre">1</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function IconParkRight() {
  return <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right" />;
}

function GroupingMode() {
  return (
    <div className="absolute bg-[#8c8c8c] h-[49px] left-1/2 rounded-[200px] top-[461px] translate-x-[-50%] w-[354px]" data-name="Grouping Mode">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-55px)] not-italic text-[14px] text-nowrap text-white top-[16px] whitespace-pre">Confirm Grouping</p>
    </div>
  );
}

function GroupingMode1() {
  return (
    <div className="absolute bg-[rgba(236,236,240,0.5)] h-[35px] left-[33px] rounded-[200px] top-[528px] w-[354px]" data-name="Grouping Mode">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-33px)] not-italic text-[14px] text-neutral-950 text-nowrap top-[7px] whitespace-pre">Customize</p>
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-[#ff4f4f] h-[6.763px] left-[36.3px] rounded-[1.932px] top-[35.24px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-[#ffab04] h-[12.237px] left-[26px] rounded-[1.932px] top-[29.76px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card8() {
  return (
    <div className="absolute bg-[#0486ff] h-[10.949px] left-[36.3px] rounded-[1.932px] top-[23px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card9() {
  return (
    <div className="absolute bg-[#03b151] h-[5.153px] left-[26px] rounded-[1.932px] top-[23px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[26px] top-[23px]">
      <Card6 />
      <Card7 />
      <Card8 />
      <Card9 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[26px] top-[22px]">
      <Group />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[53px] not-italic text-[16px] text-black text-nowrap top-[22px] whitespace-pre">Tabit</p>
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

function Component() {
  return (
    <div className="absolute bg-[#f3f3f5] box-border content-stretch flex gap-[10px] items-center justify-center left-[106px] px-[7px] py-0 rounded-[12px] top-[20px]" data-name="Component 1">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Mode: Smart</p>
      <GridiconsDropdown />
    </div>
  );
}

function FreeForm() {
  return (
    <div className="h-[589px] overflow-clip relative shrink-0 w-[420px]" data-name="Free_form">
      <Container1 />
      <Container3 />
      <Card2 />
      <Container5 />
      <Container6 />
      <Card3 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[56px] not-italic text-[12px] text-white top-[167px] w-[6px]">5</p>
      <Card4 />
      <Card5 />
      <GroupingMode />
      <GroupingMode1 />
      <Group1 />
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[47px] not-italic text-[14px] text-neutral-950 top-[83px] w-[318px]">
        <p className="mb-0">Tab Groups</p>
        <p className="text-[#717182]">3 groups active</p>
      </div>
      <Component />
    </div>
  );
}

function DefaultPageAiSuggestedGroup() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[10px] items-center left-0 rounded-[16px] top-0" data-name="Default Page-AI Suggested Group">
      <FreeForm />
    </div>
  );
}

export default function Suggestion() {
  return (
    <div className="relative size-full" data-name="suggestion">
      <DefaultPageAiSuggestedGroup />
    </div>
  );
}