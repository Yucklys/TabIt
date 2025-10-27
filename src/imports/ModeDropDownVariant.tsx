function MenuItem() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] relative w-full">
          <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic opacity-[0.68] relative shrink-0 text-[14px] text-slate-700">One-Time</p>
        </div>
      </div>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] relative w-full">
          <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic opacity-[0.68] relative shrink-0 text-[14px] text-slate-700">Smart</p>
        </div>
      </div>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] relative w-full">
          <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic opacity-[0.68] relative shrink-0 text-[14px] text-slate-700">Aggressive</p>
        </div>
      </div>
    </div>
  );
}

function TopSection() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="top section">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start p-[5px] relative w-full">
          <MenuItem />
          <MenuItem1 />
          <MenuItem2 />
        </div>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="h-0 relative shrink-0 w-[256px]" data-name="section 1">
      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
          <g id="section 1">
            <rect fill="white" height="0" transform="translate(0 1)" width="256" />
            <line id="Line 1" stroke="var(--stroke-0, #F1F5F9)" x2="256" y1="0.5" y2="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SectionItems() {
  return (
    <div className="h-0 relative shrink-0 w-[256px]" data-name="section items">
      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 1">
          <g id="section 1">
            <rect fill="white" height="0" transform="translate(0 1)" width="256" />
            <line id="Line 1" stroke="var(--stroke-0, #F1F5F9)" x2="256" y1="0.5" y2="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[132px]">
      <TopSection />
      <Section />
      {[...Array(2).keys()].map((_, i) => (
        <SectionItems key={i} />
      ))}
    </div>
  );
}

function ModeDropDown() {
  return (
    <div className="relative rounded-[6px] shrink-0" data-name="Mode Drop Down">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit]">
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-slate-100 border-solid inset-[-1px] pointer-events-none rounded-[7px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)]" />
    </div>
  );
}

export default function ModeDropDownVariant() {
  return (
    <div className="content-stretch flex items-start relative size-full" data-name="Mode Drop Down Variant">
      <ModeDropDown />
    </div>
  );
}