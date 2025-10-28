import { useState, useRef, useEffect } from "react";
import svgPaths from "../imports/svg-8cbxbja4km";
import { ModeDropdown } from "./ModeDropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Slider } from "./ui/slider";
import { setCustomPrompt, setCustomGroups, setTabRange as saveTabRange, getTabRange } from "../api/storage";

interface Tag {
  id: string;
  label: string;
  active: boolean;
}

const defaultTags: Tag[] = [
  { id: "social-media", label: "Social Media", active: false },
  { id: "entertainment", label: "Entertainment", active: false },
  { id: "research", label: "Research", active: false },
  { id: "shopping", label: "Shopping", active: false },
  { id: "news", label: "News", active: false },
  { id: "documentation", label: "Documentation", active: false },
  { id: "work", label: "Work", active: false },
  { id: "email", label: "Email", active: false },
];

export default function CustomizeInteractive({
  selectedMode = "smart",
  onModeChange,
  onNext,
}: {
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  onNext?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [inputValue, setInputValue] = useState("");
  const [tabRange, setTabRange] = useState([1, 6]);
  const [additionalRules, setAdditionalRules] = useState("");
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Import storage functions
        const storage = await import('../api/storage');
        const getCustomPrompt = storage.getCustomPrompt;
        const getCustomGroups = storage.getCustomGroups;
        
        // Load saved data
        const savedPrompt = await getCustomPrompt();
        const savedGroups = await getCustomGroups();
        const savedTabRange = await getTabRange();
        
        console.log('Loaded from storage:');
        console.log('- Saved prompt:', savedPrompt);
        console.log('- Saved groups:', savedGroups);
        console.log('- Saved tab range:', savedTabRange);
        
        // Set additional rules
        if (savedPrompt) {
          setAdditionalRules(savedPrompt);
        }
        
        // Set tab range
        if (savedTabRange) {
          setTabRange(savedTabRange);
        }
        
        // Set active tags based on saved groups
        if (savedGroups && savedGroups.length > 0) {
          setTags(prevTags => {
            // First, update existing tags
            const updatedTags = prevTags.map(tag => ({
              ...tag,
              active: savedGroups.includes(tag.label)
            }));
            
            // Find new groups that don't exist in default tags
            const existingLabels = prevTags.map(t => t.label);
            const newGroups = savedGroups.filter(label => !existingLabels.includes(label));
            
            // Add new groups
            const newTags = newGroups.map((groupLabel, index) => ({
              id: `tag-${Date.now()}-${index}`,
              label: groupLabel,
              active: true,
            }));
            
            // Add new tags to selection order
            if (newTags.length > 0) {
              setSelectionOrder(prev => [...newTags.map(t => t.id), ...prev]);
            }
            
            return [...newTags, ...updatedTags];
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const activeTags = tags.filter((tag) => tag.active);
  const inactiveTags = tags.filter((tag) => !tag.active);

  // Get the first 3 selected tags in order of selection
  // But if first tag exceeds 10 characters, only show 2 tags
  const orderedSelectedTags = selectionOrder
    .filter((id) => tags.find((t) => t.id === id && t.active))
    .map((id) => tags.find((t) => t.id === id)!)
    .filter(Boolean);
  
  const maxDisplayTags = orderedSelectedTags.length > 0 && orderedSelectedTags[0].label.length > 10 ? 2 : 3;
  const topDisplayTags = orderedSelectedTags.slice(0, maxDisplayTags);

  const toggleTag = (id: string) => {
    setTags((prev) => {
      const tag = prev.find((t) => t.id === id);
      if (!tag) return prev;

      // If activating, add to selection order
      if (!tag.active) {
        setSelectionOrder((order) => [...order, id]);
      } else {
        // If deactivating, remove from selection order
        setSelectionOrder((order) => order.filter((tagId) => tagId !== id));
      }

      return prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    });
  };

  // Delete a custom tag (not default ones)
  const deleteTag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling when clicking delete
    setTags((prev) => prev.filter(t => t.id !== id));
    setSelectionOrder((order) => order.filter(tagId => tagId !== id));
  };

  // Check if a tag is a custom one (not in default tags)
  const isCustomTag = (tagId: string) => {
    return !defaultTags.find(t => t.id === tagId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        label: inputValue.trim(),
        active: true,
      };
      // Add new tag at the beginning of the list
      setTags((prev) => [newTag, ...prev]);
      // Add to selection order
      setSelectionOrder((order) => [...order, newTag.id]);
      setInputValue("");
    }
  };

  // Track if initial load is complete
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Mark initial load as complete after first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 1000); // Wait 1 second after mount
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-save tags to storage whenever tags change (after initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    
    const saveTags = async () => {
      const activeTagLabels = tags.filter(t => t.active).map(t => t.label);
      await setCustomGroups(activeTagLabels);
      console.log('Auto-saved tags to storage:', activeTagLabels);
    };
    
    saveTags();
  }, [tags, isInitialLoadComplete]);

  // Auto-save additional rules to storage whenever it changes (after initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    
    const saveRules = async () => {
      await setCustomPrompt(additionalRules);
      if (additionalRules) {
        console.log('Auto-saved additional rules to storage:', additionalRules);
      }
    };
    
    saveRules();
  }, [additionalRules, isInitialLoadComplete]);

  // Auto-save tab range to storage whenever it changes (after initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    
  const saveRange = async () => {
    const range: [number, number] = [tabRange[0], tabRange[1]];
    await saveTabRange(range);
    console.log('Auto-saved tab range to storage:', range);
  };
    
    saveRange();
  }, [tabRange, isInitialLoadComplete]);

  // Save to storage when clicking Get Started
  const handleGetStarted = async () => {
    // Get all active tags (selected categories)
    const selectedCategories = tags.filter(t => t.active).map(t => t.label);
    
    // Save the additional rules (custom prompt) to storage
    await setCustomPrompt(additionalRules);
    
    // Save the selected categories to storage
    await setCustomGroups(selectedCategories);
    
    console.log('Saved to storage:');
    console.log('- Additional Rules:', additionalRules);
    console.log('- Selected Categories:', selectedCategories);
    
    // Call the onNext callback
    if (onNext) {
      onNext();
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const renderCollapsedState = () => {
    const remainingCount = Math.max(0, activeTags.length - topDisplayTags.length);

    return (
      <div
        className="absolute bg-white h-[52px] left-0 rounded-[8px] top-[24px] w-[356px] cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="h-[52px] overflow-clip relative rounded-[inherit] w-[356px]">
          <div className="absolute flex items-center justify-center left-[321px] size-[24px] top-[13.99px]">
            <GridiconsDropdown1 />
          </div>
          <div className="absolute left-[10px] top-[12px] flex flex-wrap gap-[7px] w-[300px]">
            {topDisplayTags.map((tag) => (
              <div
                key={tag.id}
                className="bg-[#4285f4] box-border content-stretch flex h-[27.988px] items-center justify-center px-[12px] py-[6px] rounded-[10px]"
              >
                <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-white text-nowrap">
                  {tag.label}
                </p>
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="bg-[#4285f4] box-border content-stretch flex h-[28px] items-center justify-center px-0 py-[6px] rounded-[10px] w-[29px]">
                <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-center text-white">
                  {remainingCount}
                </p>
              </div>
            )}
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      </div>
    );
  };

  const renderExpandedState = () => {
    return (
      <div className="absolute bg-white h-[250px] left-0 rounded-[8px] top-[24px] w-[356px] z-50">
        <div className="h-[250px] overflow-hidden relative rounded-[inherit] w-[356px]">
          <div
            className="absolute flex items-center justify-center left-[321px] size-[24px] top-[13.99px] cursor-pointer"
            onClick={() => setIsExpanded(false)}
          >
            <div className="flex-none scale-y-[-100%]">
              <GridiconsDropdown1 />
            </div>
          </div>

          {/* Selected tags at top */}
          <div className="absolute left-[10px] top-[12px] flex flex-wrap gap-[7px] w-[300px]">
            {topDisplayTags.map((tag) => (
              <div
                key={tag.id}
                className="bg-[#4285f4] box-border content-stretch flex h-[27.988px] items-center justify-center px-[12px] py-[6px] rounded-[10px]"
              >
                <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-white text-nowrap">
                  {tag.label}
                </p>
              </div>
            ))}
            {activeTags.length > topDisplayTags.length && (
              <div className="bg-[#4285f4] box-border content-stretch flex h-[28px] items-center justify-center px-0 py-[6px] rounded-[10px] w-[29px]">
                <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-center text-white">
                  {activeTags.length - topDisplayTags.length}
                </p>
              </div>
            )}
          </div>

          {/* Input field */}
          <div className="absolute bg-[#ececf0] h-[30px] left-[10px] rounded-[5px] top-[52.99px] w-[328px] flex items-center px-[8px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to add new category..."
              className="bg-transparent w-full outline-none font-['Arial:Regular',_sans-serif] text-[12px] text-black placeholder:text-[#717182]"
            />
          </div>

          <MiEnter onClick={() => {
            if (inputValue.trim()) {
              const newTag: Tag = {
                id: `tag-${Date.now()}`,
                label: inputValue.trim(),
                active: true,
              };
              setTags((prev) => [newTag, ...prev]);
              setSelectionOrder((order) => [...order, newTag.id]);
              setInputValue("");
            }
          }} />

          {/* Scrollable tag list */}
          <div className="absolute left-[10px] top-[91px] w-[333px] h-[150px] overflow-y-auto pr-[8px]">
            <div className="grid grid-cols-2 gap-x-[10px] gap-y-[8px]">
              {/* Active tags first */}
              {activeTags.map((tag) => (
                <div
                  key={tag.id}
                  className="content-stretch flex gap-[9px] items-center hover:opacity-80 relative group"
                >
                  <div 
                    className="cursor-pointer flex gap-[9px] items-center"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <div className="bg-[#4285f4] rounded-[7px] shrink-0 size-[24px]" />
                    <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-neutral-950">
                      {tag.label}
                    </p>
                  </div>
                  {isCustomTag(tag.id) && (
                    <button
                      onClick={(e) => deleteTag(tag.id, e)}
                      className="absolute right-0 size-[16px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-100 rounded-[4px]"
                      title="Delete this category"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {/* Inactive tags */}
              {inactiveTags.map((tag) => (
                <div
                  key={tag.id}
                  className="content-stretch flex gap-[9px] items-center hover:opacity-80 relative group"
                >
                  <div 
                    className="cursor-pointer flex gap-[9px] items-center"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <div className="bg-[#d9d9d9] rounded-[7px] shrink-0 size-[24px]" />
                    <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] text-[12px] text-neutral-950">
                      {tag.label}
                    </p>
                  </div>
                  {isCustomTag(tag.id) && (
                    <button
                      onClick={(e) => deleteTag(tag.id, e)}
                      className="absolute right-0 size-[16px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-100 rounded-[4px]"
                      title="Delete this category"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      </div>
    );
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full">
      {/* Logo and Brand */}
      <div className="absolute left-[26px] top-[22px]">
        <div className="relative">
          <div className="absolute bg-[#ff4f4f] h-[6.763px] left-[10.3px] rounded-[1.932px] top-[12.24px] w-[9.017px]">
            <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
          </div>
          <div className="absolute bg-[#ffab04] h-[12.237px] left-0 rounded-[1.932px] top-[6.76px] w-[9.017px]">
            <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
          </div>
          <div className="absolute bg-[#0486ff] h-[10.949px] left-[10.3px] rounded-[1.932px] top-0 w-[9.017px]">
            <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
          </div>
          <div className="absolute bg-[#03b151] h-[5.153px] left-0 rounded-[1.932px] top-0 w-[9.017px]">
            <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
          </div>
          <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[27px] not-italic text-[16px] text-black text-nowrap top-0 whitespace-pre">
            Tabit
          </p>
        </div>
      </div>

      {/* Mode Dropdown */}
      <div className="absolute left-[106px] top-[20px]">
        <ModeDropdown selectedMode={selectedMode} onModeChange={onModeChange || (() => {})} />
      </div>

      {/* Tag Selector */}
      <div className="absolute h-[274px] left-[32px] overflow-visible top-[93px] w-[356px]">
        <div className="h-[274px] w-[356px] relative">
          <div className="absolute h-[15.988px] left-0 top-[0.01px] w-[356px]">
            <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-0.01px] whitespace-pre">
              Choose or Enter Categories
            </p>
          </div>
          {isExpanded ? renderExpandedState() : renderCollapsedState()}
        </div>
      </div>

      {/* Additional Rules */}
      <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[32px] top-[198px] w-[356px]">
        <div className="content-stretch flex gap-[8px] h-[15.988px] items-center relative shrink-0 w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
            Additional Rules (Optional)
          </p>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="relative shrink-0 size-[16px] cursor-help">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border relative size-[16px]">
                    <div className="absolute inset-[8.33%_8.33%_0.78%_8.33%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
                        <g>
                          <g></g>
                          <path d={svgPaths.p33b2a200} fill="black" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px]">
                <p>Add your custom grouping instructions. Descriptions only — this won't change the actual logic.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="h-[85px] relative rounded-[8px] shrink-0 w-full">
          <textarea
            value={additionalRules}
            onChange={(e) => setAdditionalRules(e.target.value)}
            placeholder="e.g., Keep social media tabs separate, merge all news sites"
            className="box-border content-stretch flex h-[85px] items-start px-[12px] py-[8px] w-full resize-none rounded-[8px] border-[0.8px] border-[rgba(0,0,0,0.2)] font-['Arial:Regular',_sans-serif] leading-[20px] text-[12px] placeholder:text-[#717182] outline-none focus:border-[rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {/* Slider Section */}
      <div className="absolute content-stretch flex flex-col gap-[7px] items-end left-[31px] top-[330.99px] w-[357px]">
        <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full">
          <div className="h-[20px] relative shrink-0 w-[246px]">
            <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1.2px] whitespace-pre">
              <span className="font-['Arial:Regular',_sans-serif] not-italic">Suggested Number of Tabs Per Group</span>
            </p>
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="relative shrink-0 size-[16px] cursor-help">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border relative size-[16px]">
                    <div className="absolute inset-[8.33%_8.33%_0.78%_8.33%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
                        <g>
                          <g></g>
                          <path d={svgPaths.p33b2a200} fill="black" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px]">
                <p>Set the minimum and maximum number of tabs that should be grouped together.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <div className="[grid-area:1_/_1] flex h-[79px] items-center justify-center ml-0 mt-0 relative w-[356px]">
            <div className="flex-none scale-y-[-100%]">
              <div className="h-[79px] relative rounded-[12px] w-[356px]">
                <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
              </div>
            </div>
          </div>
          <div className="[grid-area:1_/_1] w-[356px] flex items-center justify-center">
            <div className="w-full px-[27px] mt-[5px]">
              <div className="flex items-center justify-between mb-[6px]">
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[#060606] text-[14px]">
                  Min
                </p>
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[#060606] text-[14px]">
                  Max
                </p>
              </div>
              <div className="px-[5px]">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={tabRange}
                  onValueChange={setTabRange}
                  className="w-full [&_[data-slot=slider-track]]:bg-[#F1F5F9] [&_[data-slot=slider-range]]:bg-[#4285F4] [&_[data-slot=slider-thumb]]:border-[#4285F4] [&_[data-slot=slider-thumb]]:border-2"
                />
              </div>
              <div className="flex justify-between mt-[6px] px-[5px]">
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-black">
                  {tabRange[0]}
                </p>
                <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic text-[14px] text-black">
                  {tabRange[1]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div
        className="absolute bg-[rgba(236,236,240,0.5)] h-[49px] left-[31px] rounded-[200px] top-[513px] w-[357px] cursor-pointer hover:bg-[rgba(236,236,240,0.7)] transition-colors"
        onClick={handleGetStarted}
      >
        <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.28)] border-solid inset-0 pointer-events-none rounded-[200px]" />
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-37.5px)] not-italic text-[14px] text-black text-nowrap top-[14px] whitespace-pre">
          Get Started!
        </p>
      </div>
    </div>
  );
}

function GridiconsDropdown1() {
  return (
    <div className="relative size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d="M7 10L12 15L17 10H7Z" fill="#E5E5E5" />
        </g>
      </svg>
    </div>
  );
}

function MiEnter({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      className="absolute left-[314px] size-[13px] top-[61.01px] cursor-pointer hover:opacity-70 transition-opacity"
      onClick={onClick}
    >
      <div className="absolute inset-[20.83%_12.5%_20.78%_12.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 8">
          <g>
            <path
              clipRule="evenodd"
              d={svgPaths.p35757300}
              fill="#717182"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d={svgPaths.p342ed3b0}
              fill="#717182"
              fillRule="evenodd"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
