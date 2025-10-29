/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModeDropdown } from "../components/ModeDropdown";
import { GroupDropdown } from "../components/GroupDropdown";
import { getAllTabGroupsWithCounts } from "../api/tabGroups";
import { handleRenameGroup } from "../api/renameTabGroup";
import { handleChangeGroupColor } from "../api/recolorTabGroup";
import { handleUngroup } from "../api/ungroupTabs";
import { useState, useEffect, useRef } from "react";

function More({ groupId }: { groupId: number }) {
  const handleGroupAction = (action: string) => {
    console.log(`Group ${groupId}: ${action}`);
  };

  return (
    <GroupDropdown
      groupId={groupId}
      onRename={() => handleGroupAction("rename")}
      onChangeColor={() => handleGroupAction("change color")}
      onUngroup={() => handleGroupAction("ungroup")}
      className=""
    />
  );
}

function Heading() {
  return (
    <div className="h-[20px] relative shrink-0 w-full flex items-center justify-between pr-[30px]" data-name="Heading 5">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">{`Group 1: Entertainment `}</p>
      <More groupId={1} />
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
  return <More groupId={2} />;
}

function Container2({ title }: { title: string }) {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center justify-between left-[35.2px] top-[14.2px] w-[305px] pr-[30px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">{title}</p>
      <More1 />
    </div>
  );
}

function PromptSelection1({ title }: { title: string }) {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="PromptSelection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[49px] relative w-full">
        <Container2 title={title} />
      </div>
    </div>
  );
}

function Card1({ title }: { title: string }) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[74px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-[-4px] w-[354px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PromptSelection1 title={title} />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[70px] left-[33px] top-[223px] w-[354px]" data-name="Container" />
  );
}

function Heading1() {
  return (
    <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap whitespace-pre">Group 3: Shopping</p>
  );
}

function More2() {
  return <More groupId={3} />;
}

function Container4() {
  return (
    <div className="absolute box-border content-stretch flex h-[20px] items-center justify-between left-[35.2px] pl-0 pr-[30px] py-0 top-[0.2px] w-[305px]" data-name="Container">
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
  return (
    <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function GroupingMode({ style }: { style?: React.CSSProperties }) {
  return (
    <button
      className="absolute bg-[#8c8c8c] h-[49px] left-[33px] rounded-[200px] w-[354px] cursor-not-allowed opacity-50"
      data-name="Grouping Mode"
      disabled
      type="button"
      style={style}
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-55px)] not-italic text-[14px] text-nowrap text-white top-[16px] whitespace-pre">Confirm Grouping</p>
    </button>
  );
}

function GroupingMode1({ onClick, style }: { onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      className="absolute bg-[rgba(236,236,240,0.5)] h-[35px] left-[33px] rounded-[200px] w-[354px] cursor-pointer hover:bg-[rgba(236,236,240,0.7)] transition-colors duration-200"
      data-name="Grouping Mode"
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

function FreeForm({ selectedMode = "smart", onModeChange, onCustomize, categorizedResult }: {
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  onCustomize?: () => void;
  categorizedResult: { [category: string]: [number, ...number[]] };
}) {
  // Fetch tab groups with counts from API
  const [actualGroups, setActualGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [tabCounts, setTabCounts] = useState<{ [groupId: number]: number }>({});
  
  // Inline rename state
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editingInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingGroupId && editingInputRef.current) {
      editingInputRef.current.focus();
      editingInputRef.current.select();
    }
  }, [editingGroupId]);

  useEffect(() => {
    const loadTabGroups = async () => {
      const groupsWithCounts = await getAllTabGroupsWithCounts();
      setActualGroups(groupsWithCounts.map(g => g.group));
      const counts: { [groupId: number]: number } = {};
      groupsWithCounts.forEach(({ group, count }) => {
        counts[group.id] = count;
      });
      setTabCounts(counts);
    };
    loadTabGroups();

    // Listen to Chrome tab group events
    const handleUpdated = () => {
      console.log('Tab group updated');
      loadTabGroups();
    };

    const handleRemoved = () => {
      console.log('Tab group removed');
      loadTabGroups();
    };

    chrome.tabGroups.onUpdated.addListener(handleUpdated);
    chrome.tabGroups.onRemoved.addListener(handleRemoved);

    return () => {
      chrome.tabGroups.onUpdated.removeListener(handleUpdated);
      chrome.tabGroups.onRemoved.removeListener(handleRemoved);
    };
  }, []);

  const handleGroupAction = async (groupId: number, action: string) => {
    console.log(`Group ${groupId}: ${action}`);
    
    try {
      switch (action) {
        case 'rename': {
          // Start inline editing
          const group = actualGroups.find(g => g.id === groupId);
          if (group) {
            setEditingGroupId(groupId);
            setEditingName(group.title || "");
          }
          break;
        }
          
        case 'change color': {
          // Use API to handle color change
          const currentGroup = actualGroups.find(g => g.id === groupId);
          if (currentGroup) {
            const result = await handleChangeGroupColor(groupId, currentGroup.color as chrome.tabGroups.Color | undefined);
            if (result.success) {
              // Refresh groups - done automatically via event listeners
            }
          }
          break;
        }
          
        case 'ungroup': {
          // Use API to handle ungroup
          const result = await handleUngroup(groupId);
          if (result.success && result.groups) {
            setActualGroups(result.groups.map(g => g.group));
            const counts: { [gid: number]: number } = {};
            result.groups.forEach(({ group, count }) => {
              counts[group.id] = count;
            });
            setTabCounts(counts);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error handling group action:', error);
    }
  };

  const handleSaveRename = async (groupId: number) => {
    if (editingName.trim()) {
      const result = await handleRenameGroup(groupId, editingName.trim());
      if (result.success) {
        setEditingGroupId(null);
        setEditingName("");
      }
    } else {
      // Cancel if empty
      setEditingGroupId(null);
      setEditingName("");
    }
  };

  const handleCancelRename = () => {
    setEditingGroupId(null);
    setEditingName("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, groupId: number) => {
    if (e.key === 'Enter') {
      handleSaveRename(groupId);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const categories = Object.keys(categorizedResult);
  const colors = ['#ff4f4f', '#ffab04', '#0486ff', '#03b151', '#9b59b6', '#e67e22'];
  
  // Use actual groups if available
  const displayGroups = actualGroups.length > 0 ? actualGroups : [];

  // Calculate button position based on number of groups
  const numGroups = displayGroups.length > 0 ? displayGroups.length : categories.length;
  const buttonsTop = 147 + (numGroups * 76) + 20; // After all groups + margin

  return (
    <div className="h-[589px] overflow-y-auto relative shrink-0 w-[420px]" data-name="Free_form">
      {/* Header - fixed */}
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[47px] not-italic text-[14px] text-neutral-950 top-[83px] w-[318px]">
        <p className="mb-0">Tab Groups</p>
        <p className="text-[#717182]">{displayGroups.length > 0 ? displayGroups.length : categories.length} groups active</p>
      </div>
      
      {/* Render actual tab groups if available */}
      {displayGroups.length > 0 ? (
        displayGroups.map((group, index) => {
          const topPosition = 147 + (index * 76);
          const color = colors[index % colors.length];
          
          return (
            <div 
              key={group.id} 
              className="absolute" 
              style={{ top: `${topPosition}px`, left: '33px', width: '354px' }}
            >
              <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]">
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[52px] top-[19px] w-[305px]">
                  <div className="h-[20px] relative w-full flex items-center justify-between pr-[30px]">
                    {editingGroupId === group.id ? (
                      <input
                        ref={editingInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, group.id)}
                        onBlur={() => handleSaveRename(group.id)}
                        className="flex-1 font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 px-1 border border-blue-500 rounded focus:outline-none"
                        style={{ background: 'white' }}
                      />
                    ) : (
                      <>
                        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 text-nowrap whitespace-pre">
                          {group.title || `Group ${index + 1}`}
                        </p>
                        <GroupDropdown 
                          groupId={group.id}
                          onRename={() => handleGroupAction(group.id, "rename")}
                          onChangeColor={() => handleGroupAction(group.id, "change color")}
                          onUngroup={() => handleGroupAction(group.id, "ungroup")}
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
                style={{ backgroundColor: color }}
              >
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6px]" />
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[12px] text-center text-white z-10">
                  {tabCounts[group.id] || 0}
                </p>
              </div>
            </div>
          );
        })
      ) : categories.length > 0 ? (
        categories.map((category, index) => {
          const tabCount = categorizedResult[category].length;
          const topPosition = 147 + (index * 76); // Space groups vertically
          const color = colors[index % colors.length];
          
          return (
            <div key={category} className="absolute" style={{ top: `${topPosition}px`, left: '33px', width: '354px' }}>
              <div className="absolute bg-white box-border content-stretch flex flex-col h-[58px] items-center left-0 pb-[0.8px] pl-[12.8px] pr-[0.8px] pt-[12.8px] rounded-[14px] top-0 w-[354px]">
                <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
                <div className="absolute content-stretch flex flex-col gap-[2px] h-[22px] items-start left-[52px] top-[19px] w-[305px]">
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
                className="absolute rounded-[6px] left-[12px] top-[19px] w-[28px] h-[28px] flex items-center justify-center overflow-hidden"
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
      
      {/* Buttons - positioned after all groups */}
      <GroupingMode style={{ top: `${buttonsTop}px` }} />
      <GroupingMode1 onClick={onCustomize} style={{ top: `${buttonsTop + 67}px` }} />
      
      {/* Fixed elements */}
      <Group1 />
      <ModeDropdown
        selectedMode={selectedMode}
        onModeChange={onModeChange || (() => {})}
        className="absolute left-[106px] top-[20px]"
        disabled={true}
      />
    </div>
  );
}

function DefaultPageAiSuggestedGroup({ selectedMode, onModeChange, onCustomize, categorizedResult }: {
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  onCustomize?: () => void;
  categorizedResult: { [category: string]: [number, ...number[]] };
}) {
  return (
    <div className="absolute bg-white content-stretch flex gap-[10px] items-center left-0 rounded-[16px] top-0" data-name="Default Page-AI Suggested Group">
      <FreeForm selectedMode={selectedMode} onModeChange={onModeChange} onCustomize={onCustomize} categorizedResult={categorizedResult} />
    </div>
  );
}

export default function SuggestionFinal({ selectedMode = "smart", onModeChange, onCustomize, categorizedResult = {} }: {
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  onCustomize?: () => void;
  categorizedResult?: { [category: string]: [number, ...number[]] };
}) {
  return (
    <div className="relative size-full" data-name="suggestion">
      <DefaultPageAiSuggestedGroup selectedMode={selectedMode} onModeChange={onModeChange} onCustomize={onCustomize} categorizedResult={categorizedResult} />
    </div>
  );
}
