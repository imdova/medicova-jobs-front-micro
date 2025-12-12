import React, { useRef } from "react";

interface ResizeProps {
  initialWidthPercent: number;
  onChange: (widthPercent: number) => void;
  children: React.ReactNode;
}

const Resize: React.FC<ResizeProps> = ({
  initialWidthPercent,
  onChange,
  children,
}) => {
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent outer drag logic
    e.preventDefault(); // prevent text selection and possible drag image
    const wrapper = e.currentTarget.closest(".DROP_AREA") as HTMLElement;
    const container = wrapper?.offsetParent as HTMLElement;

    if (!wrapper || !container) return;

    isDragging.current = true;
    dragStartX.current = e.clientX;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - dragStartX.current;
      const deltaPercent = (deltaX / containerRect.width) * 100;
      const newPercent = initialWidthPercent + deltaPercent;

      const clamped = Math.max(10, Math.min(100, newPercent));
      onChange(clamped);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="relative h-full w-full">
      {children}

      {/* Invisible resizer that appears on hover */}
      <div
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent transition-colors duration-150 hover:bg-gray-400"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};


export default Resize;