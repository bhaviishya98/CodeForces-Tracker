// components/ContestHistory/FilterSelector.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

const options = [30, 90, 365];

const FilterSelector = ({ selected = 30, onChange }) => {
  const [active, setActive] = useState(selected);

  const handleSelect = (value) => {
    setActive(value);
    onChange?.(value); // Call parent if provided
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((days) => (
        <Button
          key={days}
          variant={active === days ? "default" : "outline"}
          onClick={() => handleSelect(days)}
          className="text-[0.5rem] min-[450px]:text-sm px-2 py-1 sm:px-4 sm:py-2 sm:text-base"
        >
          Last {days} Days
        </Button>
      ))}
    </div>
  );
};

export default FilterSelector;
