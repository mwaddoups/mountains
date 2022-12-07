import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

interface ExpanderProps {
    children: React.ReactFragment;
}

const DEFAULT_HEIGHT = 250;

export default function Expander({ children }: ExpanderProps) {
  const [expanded, setExpanded] = useState<boolean | null>(false);
  const expandedHeightRef = useRef<HTMLDivElement>(null);

  // Only has an effect once, which is if the element is short enough it removes expansion altogether
  useEffect(() => {
    if (expandedHeightRef.current) {
      let wantedHeight = expandedHeightRef.current.scrollHeight;

      // Use a bit of give to avoid tiny expansions
      if (wantedHeight <= DEFAULT_HEIGHT * 1.1) {
        setExpanded(null);
      }
    }
  }, []);

  // Needs to be triggered every time child updates
  useEffect(() => {
    if (expandedHeightRef.current) {
      let wantedHeight = expandedHeightRef.current.scrollHeight;
      if (expanded === false) {
        expandedHeightRef.current.style.maxHeight = DEFAULT_HEIGHT.toString() + "px";
      } else {
        // Also true for expanded === null
        expandedHeightRef.current.style.maxHeight = wantedHeight.toString() + "px";
      }
    }
  });
    
  return (
    <div>
      <div ref={expandedHeightRef} className="w-full mt-2 p-1 transition-[max-height] overflow-clip"> 
          <div className={(expanded === false ? "overflow-clip bg-gradient-to-b text-transparent bg-clip-text from-black to-gray-200" : "")}>
            {children} 
          </div>
      </div>
      {expanded !== null && (
        <div className="w-full h-6 opacity-50 bg-gray-100 hover:bg-gray-200" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="mx-auto" /> : <ChevronDown className="mx-auto" />}
        </div>
      )}
    </div>
  )
}