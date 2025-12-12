import { useDebounce } from "@/hooks/useDebounce";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

export const DebouncedPicker: React.FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
    const [value, setValue] = useState(color);

    useDebounce(() => onChange(value), 200, [value]);

    return <HexColorPicker color={value} onChange={setValue} />;
};
