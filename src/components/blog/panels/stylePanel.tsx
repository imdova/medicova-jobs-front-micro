"use client";
import { Tooltip } from "@mui/material";
import { useBlogStore } from "@/lib/blog/blog-store";
import StyleContainer from "../sections/StyleContainer";
import StyleTypography from "../sections/StyleTypography";
import StyleBackground from "../sections/StyleBackground";
import StyleLayout from "../sections/StyleLayout";
import StyleBorder from "../sections/StyleBorder";
import StyleImage from "../sections/styleImage";
import StyleVideo from "../sections/styleVideo";
import BlockFormContent from "../sections/BlockFormContent";
import { Option } from "@/types";
import { Pen, Contrast, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/util";
import BlockContent from "../sections/BlockContent";

const tabs: Option<Record<"content" | "style" | "advanced", string>>[] = [
  { value: "content", label: "Content", icon: <Pen size={14} /> },
  { value: "style", label: "Style", icon: <Contrast size={14} /> },
  { value: "advanced", label: "Advanced", icon: <Settings size={14} /> },
];

export default function StylePanel() {
  const { getActiveBlock } = useBlogStore();
  const [activeTab, setActiveTab] = useState("content");
  const activeBlock = getActiveBlock();

  if (!activeBlock) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        Select a block to customize its styles
      </div>
    );
  }
  return (
    <div>
      <div className="sticky top-0 z-50 flex h-[35px] min-w-3 items-center justify-center gap-2 border-b bg-white p-0 text-xs">
        {tabs.map((tab) => (
          <Tooltip title={tab.label} placement="bottom" key={tab.value}>
            <button
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex h-[35px] min-w-3 flex-1 items-center justify-center border-b-2 border-transparent p-0 text-sm capitalize",
                activeTab === tab.value && "border-primary text-primary",
              )}
            >
              {tab.icon}
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="w-full max-w-md p-4">
        {activeTab === "content" && (
          <div className="space-y-2">
            <BlockFormContent />
            <BlockContent />
            <StyleContainer />
          </div>
        )}
        {activeTab === "style" && (
          <div className="space-y-2">
            <h4 className="text-center text-xs text-muted-foreground">Style Editor</h4>
            <StyleImage />
            <StyleVideo />
            <StyleTypography />
            <StyleBackground />
          </div>
        )}
        {activeTab === "advanced" && (
          <div className="space-y-2">
            <h4 className="text-center text-xs text-muted-foreground">
              Advanced Editor
            </h4>
            <StyleLayout />
            <StyleBorder />
          </div>
        )}
      </div>
    </div>
  );
}
