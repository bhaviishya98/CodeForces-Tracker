 // components/ContestHistory/FilterSelector.jsx
 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 
 const options = [7, 30, 90];
 
 const FilterSelector = ({ selected = 7, onChange }) => {
   const [active, setActive] = useState(selected);
 
   const handleSelect = (value) => {
     setActive(value);
     onChange?.(value); // Call parent if provided
   };
 
   return (
     <div className="flex gap-2">
       {options.map((days) => (
         <Button
           key={days}
           variant={active === days ? "default" : "outline"}
           onClick={() => handleSelect(days)}
         >
           Last {days} Days
         </Button>
       ))}
     </div>
   );
 };
 
 export default FilterSelector;
 