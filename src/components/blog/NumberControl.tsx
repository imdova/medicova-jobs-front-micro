import { TextField } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NumberControl = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}) => {
  const increment = () => {
    if (value < max) onChange(Math.min(value + step, max));
  };

  const decrement = () => {
    if (value > min) onChange(Math.max(value - step, min));
  };

  return (
    <div className="flex items-center space-x-2">
      {label && <span className="w-16 text-xs text-gray-400">{label}</span>}
      <TextField
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="Image URL"
        sx={{
          height: "30px",
          "& .MuiOutlinedInput-input": {
            padding: "5px", // Reduce input padding
            height: "18px", // Adjust input element height
          },
        }}
        className="w-8 flex-1 rounded-lg text-sm"
      />
      {/* <div className="flex items-center rounded-lg p-1">
        <button
          onClick={decrement}
          className="p-1 text-gray-400 hover:text-white"
        >
          <ChevronLeft size={14} />
        </button>
        <TextField
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Image URL"
          sx={{
            height: "30px",
            "& .MuiOutlinedInput-input": {
              padding: "0px", // Reduce input padding
              height: "18px", // Adjust input element height
            },
          }}
          className="w-8 flex-1 rounded-lg text-sm"
        />
        <button
          onClick={increment}
          className="p-1 text-gray-400 hover:text-white"
        >
          <ChevronRight size={14} />
        </button>
      </div> */}
    </div>
  );
};

export default NumberControl;
