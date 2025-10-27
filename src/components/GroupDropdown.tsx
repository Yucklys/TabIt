import { useState, useRef, useEffect } from "react";

interface GroupDropdownProps {
  groupId: number;
  onRename?: () => void;
  onChangeColor?: () => void;
  onUngroup?: () => void;
  className?: string;
}

export function GroupDropdown({ 
  groupId, 
  onRename, 
  onChangeColor, 
  onUngroup,
  className = "" 
}: GroupDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action: () => void | undefined) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} ref={dropdownRef}>
      {/* Three dots button */}
      <button
        onClick={handleToggle}
        className="cursor-pointer hover:opacity-70 transition-opacity duration-200 focus:outline-none flex items-center justify-center"
        aria-label="Group options"
        type="button"
      >
        <div className="h-[12.182px] w-[2.727px]" data-name="More">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
            <g id="More">
              <circle cx="1.36364" cy="1.36364" fill="#D9D9D9" id="Ellipse 2" r="1.36364" />
              <circle cx="1.36371" cy="6.09093" fill="#D9D9D9" id="Ellipse 3" r="1.36364" />
              <circle cx="1.36371" cy="10.8182" fill="#D9D9D9" id="Ellipse 4" r="1.36364" />
            </g>
          </svg>
        </div>
      </button>

      {/* Dropdown menu - matching ModeDropdown style */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-[6px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] border border-slate-100 overflow-hidden z-50 min-w-[140px]">
          <div className="p-[5px]">
            <button
              onClick={() => handleItemClick(onRename)}
              className="w-full rounded-[10px] transition-all duration-200 bg-white hover:bg-[#4285f4] group"
              type="button"
            >
              <div className="flex flex-row items-center size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] w-full">
                  <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic text-[14px] text-left text-slate-700 opacity-[0.68] group-hover:text-white group-hover:opacity-100">
                    Rename
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleItemClick(onChangeColor)}
              className="w-full rounded-[10px] transition-all duration-200 bg-white hover:bg-[#4285f4] group"
              type="button"
            >
              <div className="flex flex-row items-center size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] w-full">
                  <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic text-[14px] text-left text-slate-700 opacity-[0.68] group-hover:text-white group-hover:opacity-100">
                    Change Color
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleItemClick(onUngroup)}
              className="w-full rounded-[10px] transition-all duration-200 bg-white hover:bg-[#4285f4] group"
              type="button"
            >
              <div className="flex flex-row items-center size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center pl-[14px] pr-[8px] py-[6px] w-full">
                  <p className="basis-0 font-['Inter:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic text-[14px] text-left text-[#FF4F4F] group-hover:text-white group-hover:opacity-100">
                    Ungroup
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
