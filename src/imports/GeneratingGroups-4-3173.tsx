import { motion } from "motion/react";
import { ModeDropdown } from "../components/ModeDropdown";

/**
 * Frame 1: Loading animation - all dots gray
 */
function Loading({ className }: { className?: string }) {
  const transition = {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1], // Gentle curve
  };

  return (
    <div className={className} data-name="loading">
      <motion.div
        layoutId="card-red"
        className="absolute bg-[#ff4f4f] bottom-1/4 left-0 right-[76.27%] rounded-[6px] top-[44.12%]"
        data-name="Card"
        transition={transition}
      >
        <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </motion.div>
      <motion.div
        layoutId="card-orange"
        className="absolute bg-[#ffab04] bottom-[35.29%] left-[25.42%] right-[50.85%] rounded-[6px] top-0"
        data-name="Card"
        transition={transition}
      >
        <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </motion.div>
      <motion.div
        layoutId="card-blue"
        className="absolute bg-[#0486ff] bottom-0 left-[50.85%] right-[25.42%] rounded-[6px] top-[45.59%]"
        data-name="Card"
        transition={transition}
      >
        <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </motion.div>
      <motion.div
        layoutId="card-green"
        className="absolute bg-[#03b151] bottom-[16.18%] left-[76.27%] right-0 rounded-[6px] top-[60.29%]"
        data-name="Card"
        transition={transition}
      >
        <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </motion.div>
    </div>
  );
}

function Container() {
  return <div className="absolute h-[102px] left-[33px] top-[460.99px] w-[354px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute h-[130px] left-[33px] top-[574.99px] w-[354px]" data-name="Container" />;
}

function GroupingMode() {
  return (
    <div className="absolute bg-[rgba(236,236,240,0.5)] h-[49px] left-[33px] rounded-[200px] top-[514px] w-[354px]" data-name="Grouping Mode">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-48px)] not-italic text-[14px] text-neutral-950 text-nowrap top-[14px] whitespace-pre">Get Started!</p>
    </div>
  );
}

function FreeForm() {
  return (
    <div className="absolute h-[589px] left-0 overflow-clip top-0 w-[420px]" data-name="Free_form">
      <Container />
      <Container1 />
      <Loading className="absolute h-[68px] left-[151px] top-[193px] w-[118px]" />
      <GroupingMode />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-60px)] not-italic text-[#717182] text-[14px] top-[284px] w-[120px]">Generating Groups</p>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[22px] relative w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 22">
        <g id="Group 427319135">
          <circle cx="3" cy="3" fill="var(--fill-0, #D9D9D9)" id="Ellipse 2" r="3" />
          <circle cx="3" cy="11" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="3" />
          <circle cx="3" cy="19" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="3" />
        </g>
      </svg>
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

function Group1() {
  return (
    <div className="absolute contents left-[26px] top-[23px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[26px] top-[22px]">
      <Group1 />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[53px] not-italic text-[16px] text-black text-nowrap top-[22px] whitespace-pre">Tabit</p>
    </div>
  );
}

export default function GeneratingGroups({ selectedMode = "smart", onModeChange }: { selectedMode?: string; onModeChange?: (mode: string) => void }) {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Generating Groups">
      <FreeForm />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[198px] top-[314px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "6", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <Group />
        </div>
      </div>
      <Group2 />
      <ModeDropdown 
        selectedMode={selectedMode}
        onModeChange={onModeChange || (() => {})}
        className="absolute left-[106px] top-[20px]"
      />
    </div>
  );
}
