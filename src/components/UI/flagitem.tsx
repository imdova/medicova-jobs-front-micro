/* eslint-disable @next/next/no-img-element */
"use client";
import { cn } from "@/util";

interface FlagProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  code: string;
  name: string;
  fallbackCode?: string;
}

const Flag: React.FC<FlagProps> = ({
  code,
  name,
  width = 16,
  height = 12,
  className = "inline object-contain",
  fallbackCode = "un", // UN flag as fallback
  ...props
}) => {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width, height }}
    >
      <img
        src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
        alt={`${name} flag`}
        width={width}
        height={height}
        className={cn(
          "h-full w-full transition-opacity duration-300",
          className,
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default Flag;
