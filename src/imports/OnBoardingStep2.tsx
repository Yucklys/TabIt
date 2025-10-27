import { useState } from "react";
import svgPaths from "./svg-hkjqton7vc";

const CATEGORIES = [
  { id: 1, label: "Work" },
  { id: 2, label: "Research" },
  { id: 3, label: "Social Media" },
  { id: 4, label: "Shopping" },
  { id: 5, label: "Entertainment" },
  { id: 6, label: "News" },
  { id: 7, label: "Documentation" },
];

function Frame1() {
  return (
    <div className="absolute content-stretch flex font-['Arial:Regular',_sans-serif] gap-[8px] items-center leading-[normal] left-[195px] not-italic text-[14px] text-black text-nowrap top-[59px] whitespace-pre">
      <p className="relative shrink-0">Step 2:</p>
      <p className="relative shrink-0">Suggested group rules</p>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#0486ff] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">2</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#9c9c9c] content-stretch flex items-center justify-center relative rounded-[2.68435e+07px] shrink-0 size-[24px]" data-name="Container">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[48px] items-center left-0 top-0">
      <div className="relative shrink-0 size-[24px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path clipRule="evenodd" d={svgPaths.p31faca00} fill="var(--fill-0, #0486FF)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <Container />
      <Container1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[24px] left-[224px] top-[21px] w-[168px]">
      <div className="absolute h-0 left-[12px] top-[12px] w-[143.5px]">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 2">
            <path d="M0 1H143.5" id="Vector 20" stroke="var(--stroke-0, #838383)" strokeDasharray="4 4" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Frame />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[7.529px] h-[15.047px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',_sans-serif] leading-[15.059px] not-italic relative shrink-0 text-[13.176px] text-neutral-950 text-nowrap whitespace-pre">{`Choose or Enter Categories: `}</p>
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="h-[33.882px] relative rounded-[7.529px] shrink-0 w-[335.059px]" data-name="Input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="box-border content-stretch flex h-[33.882px] items-center overflow-clip px-[11.294px] py-[3.765px] relative rounded-[inherit] w-[335.059px] font-['Arial:Regular',_sans-serif] leading-[normal] not-italic text-[#717182] text-[13.176px] bg-transparent"
        placeholder="Work, Sports"
        aria-label="Enter categories"
      />
      <div aria-hidden="true" className="absolute border-[0.753px] border-neutral-200 border-solid inset-0 pointer-events-none rounded-[7.529px]" />
    </div>
  );
}

function CategoryButton({ 
  category, 
  isSelected, 
  onClick, 
  position 
}: { 
  category: typeof CATEGORIES[0]; 
  isSelected: boolean; 
  onClick: () => void;
  position: { left: string; top: string; width: string };
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute box-border content-stretch flex h-[26.341px] items-start px-[11.294px] py-[5.647px] rounded-[2.52645e+07px] cursor-pointer transition-colors duration-200 ${
        isSelected ? "bg-[#0486ff] hover:bg-[#0374e6]" : "bg-[#ececf0] hover:bg-[#e0e0e2]"
      }`}
      style={{ left: position.left, top: position.top, width: position.width }}
      aria-pressed={isSelected}
      type="button"
    >
      <p className={`font-['Arial:Regular',_sans-serif] leading-[15.059px] not-italic relative shrink-0 text-[11.294px] ${
        isSelected ? "text-white" : "text-neutral-950"
      } ${category.label.length > 10 ? "basis-0 grow min-h-px min-w-px" : "text-nowrap whitespace-pre"}`}>
        {category.label}
      </p>
    </button>
  );
}

function Container2({ selectedCategories, onCategoryToggle }: { selectedCategories: number[]; onCategoryToggle: (id: number) => void }) {
  const positions = [
    { left: "0", top: "0", width: "51.435px" },
    { left: "58.97px", top: "0", width: "70.682px" },
    { left: "137.18px", top: "0", width: "91.471px" },
    { left: "236.18px", top: "0", width: "74.859px" },
    { left: "0", top: "33.87px", width: "99.529px" },
    { left: "107.06px", top: "33.87px", width: "52.329px" },
    { left: "166.92px", top: "33.87px", width: "106.753px" },
  ];

  return (
    <div className="h-[60.212px] relative shrink-0 w-full" data-name="Container" role="group" aria-label="Category selection buttons">
      {CATEGORIES.map((category, index) => (
        <CategoryButton
          key={category.id}
          category={category}
          isSelected={selectedCategories.includes(category.id)}
          onClick={() => onCategoryToggle(category.id)}
          position={positions[index]}
        />
      ))}
    </div>
  );
}

function Container3({ inputValue, onInputChange, selectedCategories, onCategoryToggle }: {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[11.294px] h-[131.729px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Input value={inputValue} onChange={onInputChange} />
      <Container2 selectedCategories={selectedCategories} onCategoryToggle={onCategoryToggle} />
    </div>
  );
}

function PromptTemplate({ inputValue, onInputChange, selectedCategories, onCategoryToggle }: {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
}) {
  return (
    <div className="relative shrink-0 w-[335.059px]" data-name="PromptTemplate">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[15.059px] items-start relative w-[335.059px]">
        <Container3 
          inputValue={inputValue}
          onInputChange={onInputChange}
          selectedCategories={selectedCategories}
          onCategoryToggle={onCategoryToggle}
        />
      </div>
    </div>
  );
}

function PrimitiveDiv({ inputValue, onInputChange, selectedCategories, onCategoryToggle }: {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[22.588px] items-start left-0 top-[22.59px] w-[335.059px]" data-name="Primitive.div">
      <PromptTemplate 
        inputValue={inputValue}
        onInputChange={onInputChange}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
      />
    </div>
  );
}

function CustomizePanel({ inputValue, onInputChange, selectedCategories, onCategoryToggle }: {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
}) {
  return (
    <div className="absolute h-[160px] left-[47px] top-[163px] w-[335.059px]" data-name="CustomizePanel">
      <PrimitiveDiv 
        inputValue={inputValue}
        onInputChange={onInputChange}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
      />
    </div>
  );
}

function IconParkRight() {
  return (
    <div className="absolute left-[318px] size-[24px] top-[12px]" data-name="icon-park:right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon-park:right">
          <path d="M9.5 6L15.5 12L9.5 18" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function GroupingMode({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute bg-[#4285f4] h-[49px] left-[28px] rounded-[200px] top-[502px] w-[361px] cursor-pointer hover:bg-[#3b78e7] active:bg-[#3367d6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0486ff] focus:ring-offset-2" 
      data-name="Grouping Mode"
      aria-label="Proceed to next step"
      type="button"
    >
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[200px]" />
      <IconParkRight />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[calc(50%-14.5px)] not-italic text-[14px] text-nowrap text-white top-[calc(50%-10.5px)] whitespace-pre">Next</p>
    </button>
  );
}

function FreeForm({ inputValue, onInputChange, selectedCategories, onCategoryToggle, onNextClick }: {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
  onNextClick: () => void;
}) {
  return (
    <div className="absolute h-[589px] left-0 overflow-clip top-0 w-[420px]" data-name="Free_form">
      <div className="absolute bg-white h-[182px] left-[33px] rounded-[5px] top-[173px] w-[354px]">
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[5px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05)]" />
      </div>
      <Frame1 />
      <Frame2 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18px] left-[37px] not-italic text-[12px] text-black top-[95px] w-[352px]">Choose or enter the categories you want to organize your tabs into.Tabit's AI will use your choices to automatically group your tabs.</p>
      <CustomizePanel 
        inputValue={inputValue}
        onInputChange={onInputChange}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
      />
      <GroupingMode onClick={onNextClick} />
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#ff4f4f] h-[6.763px] left-[36.3px] rounded-[1.932px] top-[37.24px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#ffab04] h-[12.237px] left-[26px] rounded-[1.932px] top-[31.76px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-[#0486ff] h-[10.949px] left-[36.3px] rounded-[1.932px] top-[25px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-[#03b151] h-[5.153px] left-[26px] rounded-[1.932px] top-[25px] w-[9.017px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.258px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[1.932px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[26px] top-[25px]">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[26px] top-[24px]">
      <Group />
      <p className="absolute font-['Audiowide:Regular',_sans-serif] leading-[20px] left-[53px] not-italic text-[16px] text-black text-nowrap top-[24px] whitespace-pre">Tabit</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-white h-[91px] left-0 rounded-[5px] top-0 w-[261px]">
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[5px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05)]" />
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <p className="[grid-area:1_/_1] font-['Arial:Italic',_sans-serif] italic leading-[19.5px] ml-0 mt-0 relative text-[12px] text-black w-[233px]">" You can organize your tabs based on website type, usage habits, or tasks and goals, whatever helps you stay focused. "</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] h-[91px] items-center justify-center left-[126px] p-[12px] top-[379px] w-[261px]">
      <Group2 />
      <Group3 />
    </div>
  );
}

export default function OnBoardingStep({ onNext }: { onNext?: () => void }) {
  const [inputValue, setInputValue] = useState("Work, Sports");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([1]);

  const handleCategoryToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleNextClick = () => {
    console.log("Step 2 Next clicked", { inputValue, selectedCategories });
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="OnBoarding Step2">
      <FreeForm 
        inputValue={inputValue}
        onInputChange={setInputValue}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onNextClick={handleNextClick}
      />
      <Group1 />
      <Frame3 />
    </div>
  );
}
