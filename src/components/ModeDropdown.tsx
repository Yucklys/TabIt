import { useState, useRef, useEffect } from "react";

const GROUPING_MODES = [
  { value: "onetime", label: "One-Time" },
  { value: "smart", label: "Smart" },
  { value: "aggressive", label: "Aggressive" },
];

interface ModeDropdownProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  className?: string;
  disabled?: boolean;
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

export function ModeDropdown({ selectedMode, onModeChange, className = "", disabled = false }: ModeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = GROUPING_MODES.find((m) => m.value === selectedMode)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    if (disabled) return;
    onModeChange(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-[#f3f3f5] box-border content-stretch flex gap-[10px] items-center justify-center px-[7px] py-0 rounded-[12px] transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#e8e8ea]'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select grouping mode"
        type="button"
        disabled={disabled}
      >
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">
          Mode: {selectedLabel}
        </p>
        <GridiconsDropdown />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-[6px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] border border-slate-100 overflow-hidden z-10 min-w-[132px]">
          <div className="p-[5px]">
            {GROUPING_MODES.map((mode) => {
              const isSelected = selectedMode === mode.value;
              
              return (
                <button
                  key={mode.value}
                  onClick={() => handleSelect(mode.value)}
                  className={`
                    w-full rounded-[10px] transition-all duration-200
                    ${isSelected 
                      ? "bg-[#4285f4] hover:bg-[#3b78e7]" 
                      : "bg-white hover:bg-slate-50"
                    }
                  `}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                >
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] w-full">
                      <p 
                        className={`
                          basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] 
                          min-h-px min-w-px not-italic text-[14px] text-left
                          ${isSelected 
                            ? "text-white opacity-100" 
                            : "text-slate-700 opacity-[0.68] hover:opacity-100"
                          }
                        `}
                      >
                        {mode.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
