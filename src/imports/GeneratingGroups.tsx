function Container() {
  return <div className="absolute h-[102px] left-[33px] top-[460.99px] w-[354px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute h-[130px] left-[33px] top-[574.99px] w-[354px]" data-name="Container" />;
}

function GroupingMode() {
  return (
    <div className="absolute bg-[#4285f4] h-[49px] left-[33px] rounded-[200px] top-[514px] w-[354px]" data-name="Grouping Mode">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-69px)] not-italic text-[14px] text-nowrap text-white top-[14px] whitespace-pre">See Grouping Results</p>
    </div>
  );
}

function FreeForm() {
  return (
    <div className="absolute h-[589px] left-0 overflow-clip top-0 w-[420px]" data-name="Free_form">
      <Container />
      <Container1 />
      <GroupingMode />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-1/2 not-italic text-[14px] text-black text-center top-[284px] translate-x-[-50%] w-[66px]">🎉Complete!</p>
    </div>
  );
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

function Group() {
  return (
    <div className="absolute contents left-[26px] top-[23px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
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

function Frame() {
  return (
    <div className="absolute bg-[#f3f3f5] box-border content-stretch flex gap-[10px] items-center justify-center left-[106px] px-[7px] py-0 rounded-[12px] top-[20px]">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Mode: Smart</p>
      <GridiconsDropdown />
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-[#ff4f4f] bottom-[16.18%] left-0 right-[76.27%] rounded-[6px] top-[14.71%]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-[#ffab04] inset-[60.29%_50.85%_-5.88%_25.42%] rounded-[6px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-[#0486ff] relative rounded-[6px] size-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-[#03b151] bottom-[16.18%] left-[76.27%] right-0 rounded-[6px] top-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute h-[68px] left-[151px] top-[193px] w-[118px]" data-name="loading">
      <Card4 />
      <Card5 />
      <div className="absolute flex inset-[44.12%_25.42%_26.47%_50.85%] items-center justify-center">
        <div className="flex-none h-[20px] scale-y-[-100%] w-[28px]">
          <Card6 />
        </div>
      </div>
      <Card7 />
    </div>
  );
}

export default function GeneratingGroups() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Generating Groups">
      <FreeForm />
      <Group1 />
      <Frame />
      <Loading />
    </div>
  );
}