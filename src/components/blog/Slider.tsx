const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  icon,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center space-x-2">
      {icon && <div className="text-primary">{icon}</div>}
      {label && <span className="w-16 text-xs text-gray-400">{label}</span>}
      <div className="relative flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-1 w-full appearance-none rounded-full bg-gray-400 focus:outline-none"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-1 translate-y-1/2 rounded-full bg-primary"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`,
            pointerEvents: "none",
          }}
        />
      </div>
      <span className="w-8 text-center text-xs text-white">{value}</span>
    </div>
  );
};

export default Slider;
