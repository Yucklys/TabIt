function IconParkRight() {
  return (
    <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-park:right">
          <path d="M9.5 6L15.5 12L9.5 18" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function GroupingMode() {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  return (
    <button 
      onClick={handleGetStarted}
      className="absolute bg-[rgba(236,236,240,0.5)] h-[49px] left-[26px] rounded-[200px] top-[500px] w-[361px] cursor-pointer hover:bg-[rgba(224,224,224,0.63)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2" 
      data-name="Grouping Mode"
      aria-label="Get Started with Tabit"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-37.5px)] not-italic text-[14px] text-black text-nowrap top-[calc(50%-10.5px)] whitespace-pre">Get Started!</p>
    </button>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#ff4f4f] h-[21px] left-[211px] rounded-[6px] top-[142px] w-[28px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#ffab04] h-[38px] left-[179px] rounded-[6px] top-[125px] w-[28px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#0486ff] h-[34px] left-[211px] rounded-[6px] top-[104px] w-[28px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-[#03b151] h-[16px] left-[179px] rounded-[6px] top-[104px] w-[28px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[179px] top-[104px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function FreeForm() {
  return (
    <div className="absolute h-[589px] left-0 overflow-clip top-0 w-[420px]" data-name="Free_form">
      <GroupingMode />
      <p className="absolute font-['Arial:Italic',_sans-serif] italic leading-[20px] left-[68px] text-[12px] text-black text-nowrap top-[229px] whitespace-pre">Turn your chaotic browser into clear, focused spaces.</p>
      <p className="absolute font-['Roboto:Bold',_sans-serif] font-bold leading-[20px] left-[105px] text-[#6c6c6c] text-[14px] text-nowrap top-[204px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Your AI-Powered Tab Organizer
      </p>
      <p className="absolute font-['Arial:Italic',_sans-serif] h-[80px] italic leading-[20px] left-[209px] text-[#575757] text-[14px] text-center top-[263px] translate-x-[-50%] w-[224px]">Powered by AI semantic understanding and adaptive learning, Tabit organizes tabs by topic and intent.</p>
      <Group />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[188px] not-italic text-[16px] text-black text-nowrap top-[170px] whitespace-pre">Tabit</p>
    </div>
  );
}

export default function OnboardingIntro() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Onboarding Intro">
      <FreeForm />
    </div>
  );
}