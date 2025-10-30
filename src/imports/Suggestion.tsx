/* eslint-disable @typescript-eslint/no-unused-vars */
import svgPaths from "./svg-0ck11ki2su";
import { ModeDropdown } from "../components/ModeDropdown";
import { GroupDropdown } from "../components/GroupDropdown";
import { AVAILABLE_COLORS } from "../api/recolorTabGroup";
import { useState, useEffect, useRef } from "react";

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

function IconParkRight() {
  return (
    <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const GroupingMode = ({ onClick, style }: { onClick: () => void; style?: React.CSSProperties }) => {
  return (
    <button
      className="absolute bg-[#4285f4] h-[49px] left-[33px] w-[354px] rounded-[200px] cursor-pointer hover:bg-[#3b78e7] active:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2 mb-[10px]"
      data-name="Grouping Mode"
      onClick={onClick}
      type="button"
      style={style}
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-55px)] not-italic text-[14px] text-nowrap text-white top-[16px] whitespace-pre">Confirm Grouping</p>
    </button>
  );
}


function GroupingMode1({ onClick, style }: { onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      className="absolute bg-[rgba(236,236,240,0.5)] h-[35px] left-[33px] rounded-[200px] w-[354px] cursor-pointer hover:bg-[rgba(236,236,240,0.7)] transition-colors duration-200"
      data-name="Grouping Mode"
      aria-label="Customize grouping"
      type="button"
      style={style}
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-33px)] not-italic text-[14px] text-neutral-950 text-nowrap top-[7px] whitespace-pre">Customize</p>
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
  onConfirm: (modifiedNames?: { [category: string]: string }, modifiedColors?: { [category: string]: chrome.tabGroups.Color }) => void;
  onCustomize: () => void;
  categorizedResult: { [category: string]: [number, ...number[]] };
}) {
  // Inline rename state
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editingInputRef = useRef<HTMLInputElement>(null);

  // Color picker state
  const [showingColorPickerFor, setShowingColorPickerFor] = useState<number | null>(null);

  // Store selected colors for each group
  const [selectedColors, setSelectedColors] = useState<{ [groupId: number]: chrome.tabGroups.Color }>({});

  // Function to initialize random colors for groups
  const initializeRandomColors = (categories: string[]) => {
    const initialColors: { [groupId: number]: chrome.tabGroups.Color } = {};

    categories.forEach((_, index) => {
      const groupId = index + 1;
      if (!selectedColors[groupId]) {
        const randomColor = AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)] as chrome.tabGroups.Color;
        initialColors[groupId] = randomColor;
      }
    });

    if (Object.keys(initialColors).length > 0) {
      setSelectedColors(prev => ({ ...prev, ...initialColors }));
    }
  };

  // Track deleted/removed groups
  const [removedGroups, setRemovedGroups] = useState<string[]>([]);

  // Track renamed groups
  const [renamedGroups, setRenamedGroups] = useState<{ [category: string]: string }>({});

  // Focus input when editing starts
  useEffect(() => {
    if (editingGroupId && editingInputRef.current) {
      editingInputRef.current.focus();
      editingInputRef.current.select();
    }
  }, [editingGroupId]);

  // Map Chrome color names to actual hex colors
  const colorMap: Record<string, string> = {
    'grey': '#9e9e9e',
    'blue': '#4285f4',
    'red': '#ea4335',
    'yellow': '#fbbc04',
    'green': '#34a853',
    'pink': '#fb8d9e',
    'purple': '#a142f4',
    'cyan': '#13b9fd',
    'orange': '#ff6d01'
  };

  const categories = Object.keys(categorizedResult);

  // Filter out removed groups
  const visibleCategories = categories.filter(category => !removedGroups.includes(category));

  // Initialize random colors for new groups
  initializeRandomColors(visibleCategories);

  const buttonTop = 147 + (visibleCategories.length * 76) + 20;

  const handleGroupAction = async (groupId: number, action: string, category: string) => {
    console.log(`Group ${groupId}: ${action}`);

    try {
      switch (action) {
        case 'rename': {
          // Start inline editing
          setEditingGroupId(groupId);
          setEditingName(category);
          break;
        }

        case 'change color': {
          // Show color picker
          setShowingColorPickerFor(groupId);
          break;
        }

        case 'ungroup': {
          // Remove the group from suggestions
          setRemovedGroups(prev => [...prev, category]);
          // Also clear any selected color for this group
          setSelectedColors(prev => {
            const newColors = { ...prev };
            delete newColors[groupId];
            return newColors;
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error handling group action:', error);
    }
  };

  const handleSaveRename = async (_groupId: number, category: string) => {
    if (editingName.trim()) {
      // Store the renamed category
      setRenamedGroups(prev => ({
        ...prev,
        [category]: editingName.trim()
      }));
      setEditingGroupId(null);
      setEditingName("");
    } else {
      setEditingGroupId(null);
      setEditingName("");
    }
  };

  const getDisplayName = (category: string) => {
    return renamedGroups[category] || category;
  };

  const handleCancelRename = () => {
    setEditingGroupId(null);
    setEditingName("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, groupId: number, category: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(groupId, category);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleSelectColor = async (groupId: number, color: chrome.tabGroups.Color) => {
    // Store color preference for display
    setSelectedColors(prev => ({
      ...prev,
      [groupId]: color
    }));
    setShowingColorPickerFor(null);
  };

  const getDisplayColor = (index: number) => {
    // Use selected color if available, otherwise use grey as fallback
    const groupId = index + 1;
    if (selectedColors[groupId]) {
      return colorMap[String(selectedColors[groupId])];
    }
    return colorMap['grey'];
  };

  // Handle confirm button click - collect all modifications
  const handleConfirmClick = () => {
    console.log('handleConfirmClick called, collecting modifications...');

    // Build modified names map (category -> newName)
    const modifiedNames: { [category: string]: string } = {};
    visibleCategories.forEach((category) => {
      if (renamedGroups[category]) {
        modifiedNames[category] = renamedGroups[category];
        console.log(`Renamed: ${category} -> ${renamedGroups[category]}`);
      }
    });

    // Build modified colors map (category -> chrome.tabGroups.Color)
    const modifiedColors: { [category: string]: chrome.tabGroups.Color } = {};
    visibleCategories.forEach((category, index) => {
      const groupId = index + 1;
      if (selectedColors[groupId]) {
        modifiedColors[category] = selectedColors[groupId];
        console.log(`Color changed: ${category} -> ${selectedColors[groupId]}`);
      }
    });

    console.log('Modified names:', modifiedNames);
    console.log('Modified colors:', modifiedColors);

    // Call onConfirm with the modified data
    onConfirm(modifiedNames, modifiedColors);
  };

  return (
    <div className="h-[589px] relative shrink-0 w-[420px]" data-name="Free_form">
      <Frame />
      <Paragraph1 />

      {/* Color picker modal */}
      {showingColorPickerFor !== null && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99998
            }}
            onClick={() => setShowingColorPickerFor(null)}
          />

          <div
            className="color-picker-container"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              padding: '16px',
              border: '1px solid #e5e7eb',
              zIndex: 99999,
              minWidth: '280px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#1f2937' }}>Select Color</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {AVAILABLE_COLORS.map((color) => {
                const colorValue = color as chrome.tabGroups.Color;
                return (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectColor(showingColorPickerFor, colorValue);
                    }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      border: '2px solid transparent',
                      backgroundColor: colorMap[color],
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = '2px solid #9ca3af'}
                    onMouseLeave={(e) => e.currentTarget.style.border = '2px solid transparent'}
                    title={color}
                  />
                );
              })}
            </div>
            <button
              onClick={() => setShowingColorPickerFor(null)}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#4b5563',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Dynamic group rendering */}
      {visibleCategories.length > 0 ? (
        visibleCategories.map((category, index) => {
          const tabCount = categorizedResult[category].length;
          const topPosition = 147 + (index * 76);

          return (
            <div key={category} className="absolute" style={{ top: `${topPosition}px`, left: '33px', width: '354px' }}>
              <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]">
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[52px] top-[19px] w-[305px]">
                  <div className="h-[20px] relative w-full flex items-center justify-between pr-[30px]">
                    {editingGroupId === index + 1 ? (
                      <input
                        ref={editingInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, index + 1, category)}
                        onBlur={() => handleSaveRename(index + 1, category)}
                        className="flex-1 font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 px-1 border border-blue-500 rounded focus:outline-none"
                        style={{ background: 'white' }}
                      />
                    ) : (
                      <>
                        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 text-nowrap whitespace-pre">
                          Group {index + 1}: {getDisplayName(category)}
                        </p>
                        <GroupDropdown
                          groupId={index + 1}
                          onRename={() => handleGroupAction(index + 1, "rename", category)}
                          onChangeColor={() => handleGroupAction(index + 1, "change color", category)}
                          onUngroup={() => handleGroupAction(index + 1, "ungroup", category)}
                          className=""
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Color indicator with tab count */}
              <div
                className="absolute rounded-[6px] left-[12px] top-[19px] w-[28px] h-[28px] flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: getDisplayColor(index) }}
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
      <GroupingMode onClick={handleConfirmClick} style={{ top: `${buttonTop}px` }} />
      <GroupingMode1 onClick={onCustomize} style={{ top: `${buttonTop + 67}px` }} />

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
  onConfirm?: (modifiedNames?: { [category: string]: string }, modifiedColors?: { [category: string]: chrome.tabGroups.Color }) => void;
  onCustomize?: () => void;
  categorizedResult?: { [category: string]: [number, ...number[]] };
}) {
  const handleConfirm = (
    modifiedNames?: { [category: string]: string },
    modifiedColors?: { [category: string]: chrome.tabGroups.Color }
  ) => {
    console.log("Confirm Grouping clicked");
    if (onConfirm) {
      onConfirm(modifiedNames, modifiedColors);
    }
  };

  const handleCustomize = () => {
    console.log("Customize clicked");
    if (onCustomize) {
      onCustomize();
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="suggestion">
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
