import svgPaths from "./svg-0ck11ki2su";
import { ModeDropdown } from "../components/ModeDropdown";
import { GroupDropdown } from "../components/GroupDropdown";

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.33%_0.78%_8.73%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Group">
          <g id="Vector"></g>
          <path d={svgPaths.p3d8e2800} fill="var(--fill-0, #525252)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteAiFill() {
  return (
    <div className="absolute left-0 size-[24px] top-[4px]" data-name="mingcute:ai-fill">
      <Group />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start justify-center left-[35px] top-[4px] w-[318px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow h-[16px] leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-neutral-950">AI Suggested Group</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[24px] left-[33px] top-[83px] w-[354px]">
      <MingcuteAiFill />
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[68px] top-[110px] w-[354px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[12px]">Choose the pre-made grouping for quick setup</p>
    </div>
  );
}

function Heading({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="h-[20px] relative shrink-0 w-full flex items-center justify-between pr-[30px]" data-name="Heading 5">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">{`Group 1: Entertainment `}</p>
      <GroupDropdown 
        groupId={1}
        onRename={onRename}
        onChangeColor={onChangeColor}
        onUngroup={onUngroup}
        className=""
      />
    </div>
  );
}

function Paragraph2() {
  return <div className="h-[59px] shrink-0 w-[305px]" data-name="Paragraph" />;
}

function Container({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[35.2px] top-[7.2px] w-[305px]" data-name="Container">
      <Heading onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
      <Paragraph2 />
    </div>
  );
}

function PromptSelection({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="h-[75px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75px] relative w-full">
        <Container onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
      </div>
    </div>
  );
}

function Card({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
    </div>
  );
}

function Container1({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute h-[62px] left-[33px] top-[147px] w-[354px]" data-name="Container">
      <Card onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
    </div>
  );
}

function Container2({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[20px] items-start left-[35.2px] top-[14.2px] w-[305px]" data-name="Container">
      <div className="h-[20px] relative w-full flex items-center justify-between pr-[30px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">Group 2: News</p>
        <GroupDropdown 
          groupId={2}
          onRename={onRename}
          onChangeColor={onChangeColor}
          onUngroup={onUngroup}
          className=""
        />
      </div>
    </div>
  );
}

function PromptSelection1({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[49px] relative w-full">
        <Container2 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
      </div>
    </div>
  );
}

function Card1({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[74px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[-4px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection1 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
    </div>
  );
}

function Container3({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute h-[70px] left-[33px] top-[223px] w-[354px]" data-name="Container">
      <Card1 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
    </div>
  );
}

function Heading1({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="h-[20px] relative shrink-0 w-full flex items-center justify-between pr-[30px]" data-name="Heading 5">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">Group 3: Shopping</p>
      <GroupDropdown 
        groupId={3}
        onRename={onRename}
        onChangeColor={onChangeColor}
        onUngroup={onUngroup}
        className=""
      />
    </div>
  );
}

function Container4({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-start left-[35.2px] top-[0.2px] w-[304.8px]" data-name="Container">
      <Heading1 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
    </div>
  );
}

function PromptSelection2({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <Container4 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
      </div>
    </div>
  );
}

function Card2({ onRename, onChangeColor, onUngroup }: {
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
}) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[44px] items-center left-[33px] pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[307px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection2 onRename={onRename} onChangeColor={onChangeColor} onUngroup={onUngroup} />
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

function GroupingMode({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-[#4285f4] h-[49px] w-full rounded-[200px] cursor-pointer hover:bg-[#3b78e7] active:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2 mb-[10px]"
      data-name="Grouping Mode"
      aria-label="Confirm grouping"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <div className="absolute left-[15px] size-[24px] top-[12px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-center not-italic text-[14px] text-nowrap text-white whitespace-pre">Confirm Grouping</p>
    </button>
  );
}

function GroupingMode1({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-[rgba(236,236,240,0.5)] h-[35px] w-full rounded-[200px] cursor-pointer hover:bg-[rgba(236,236,240,0.7)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#717182] focus:ring-offset-2"
      data-name="Grouping Mode"
      aria-label="Customize grouping"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] text-center not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">Customize</p>
    </button>
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

function Group1() {
  return (
    <div className="absolute contents left-[26px] top-[23px]">
      <Card6 />
      <Card7 />
      <Card8 />
      <Card9 />
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

function FreeForm({ selectedMode, onModeChange, onConfirm, onCustomize, categorizedResult }: { 
  selectedMode: string; 
  onModeChange: (mode: string) => void;
  onConfirm: () => void;
  onCustomize: () => void;
  categorizedResult: { [category: string]: [number, ...number[]] };
}) {
  const handleGroupAction = (groupId: number, action: string) => {
    console.log(`Group ${groupId}: ${action}`);
  };

  const categories = Object.keys(categorizedResult);
  const colors = ['#ff4f4f', '#ffab04', '#0486ff', '#03b151', '#9b59b6', '#e67e22'];

  return (
    <div className="h-[589px] overflow-y-auto relative shrink-0 w-[420px]" data-name="Free_form">
      <Frame />
      <Paragraph1 />
      
      {/* Dynamic group rendering */}
      {categories.length > 0 ? (
        categories.map((category, index) => {
          const tabCount = categorizedResult[category].length;
          const topPosition = 147 + (index * 76); // Space groups vertically
          const color = colors[index % colors.length];
          
          return (
            <div key={category} className="absolute" style={{ top: `${topPosition}px`, left: '33px', width: '354px' }}>
              <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]">
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[35.2px] top-[19px] w-[305px]">
                  <div className="h-[20px] relative w-full flex items-center justify-between pr-[30px]">
                    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 text-nowrap whitespace-pre">
                      Group {index + 1}: {category}
                    </p>
                    <GroupDropdown 
                      groupId={index + 1}
                      onRename={() => handleGroupAction(index + 1, "rename")}
                      onChangeColor={() => handleGroupAction(index + 1, "change color")}
                      onUngroup={() => handleGroupAction(index + 1, "ungroup")}
                      className=""
                    />
                  </div>
                </div>
              </div>
              {/* Color indicator with tab count */}
              <div 
                className="absolute rounded-[6px] left-[12px] top-[19px] w-[20px] h-[20px] flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[12px] text-center text-white z-10">
                  {tabCount}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="absolute left-[33px] top-[147px] w-[354px] text-center text-[#717182] text-[14px]">
          No groups found
        </div>
      )}
      
      {/* Buttons - dynamically positioned after groups */}
      <div className="absolute left-0 w-full" style={{ top: `${147 + (categories.length * 76) + 20}px` }}>
        <div className="relative px-[33px] pb-[40px]">
          <GroupingMode onClick={onConfirm} />
          <GroupingMode1 onClick={onCustomize} />
        </div>
      </div>
      
      <Group2 />
      <ModeDropdown 
        selectedMode={selectedMode}
        onModeChange={onModeChange}
        className="absolute left-[106px] top-[20px]"
      />
    </div>
  );
}

export default function Suggestion({ 
  selectedMode = "smart", 
  onModeChange, 
  onConfirm, 
  onCustomize,
  categorizedResult = {}
}: { 
  selectedMode?: string; 
  onModeChange?: (mode: string) => void;
  onConfirm?: () => void;
  onCustomize?: () => void;
  categorizedResult?: { [category: string]: [number, ...number[]] };
}) {
  const handleConfirm = () => {
    console.log("Confirm Grouping clicked");
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCustomize = () => {
    console.log("Customize clicked");
    if (onCustomize) {
      onCustomize();
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full overflow-hidden" data-name="suggestion">
      <FreeForm 
        selectedMode={selectedMode}
        onModeChange={onModeChange || (() => {})}
        onConfirm={handleConfirm}
        onCustomize={handleCustomize}
        categorizedResult={categorizedResult}
      />
    </div>
  );
}
