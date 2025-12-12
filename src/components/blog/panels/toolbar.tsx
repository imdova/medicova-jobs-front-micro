"use client";
import { ToolBarTabs } from "@/types/blog";
import React from "react";
import StylePanel from "@/components/blog/panels/stylePanel";
import BlocksPanel from "@/components/blog/panels/blocksPanel";
import SettingsPanel from "@/components/blog/panels/SettingsPanel";
import { cn } from "@/util";
import { useBlogStore } from "@/lib/blog/blog-store";
import { Option } from "@/types";
import BlockTree from "./blockTree";
import {
  FolderTree,
  Paintbrush,
  Plus,
  Settings,
  TextCursorInput,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { FormBuilder } from "./formBuilder";

const tabs: Option<Record<ToolBarTabs, string>>[] = [
  { value: "blocks", label: "Add Element", icon: <Plus size={14} /> },
  { value: "styles", label: "Styles", icon: <Paintbrush size={14} /> },
  { value: "forms", label: "Forms", icon: <TextCursorInput size={14} /> },
  {
    value: "component-tree",
    label: "Elements Tree",
    icon: <FolderTree size={14} />,
  },
  { value: "settings", label: "Settings", icon: <Settings size={14} /> },
];

const ToolBar: React.FC = () => {
  const { setActiveTab, activeTab } = useBlogStore();
  return (
    <aside className="bg-muted/30 w-96 border-l">
      <div>
        <div className="flex h-[35px] min-w-3 items-center justify-center gap-2 border-b p-0 text-xs">
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

        <div className="scroll-bar-minimal max-h-[calc(100vh-87px)] overflow-y-auto">
          {activeTab === "blocks" && <BlocksPanel />}
          {activeTab === "styles" && <StylePanel />}
          {activeTab === "forms" && <FormBuilder />}
          {activeTab === "settings" && <SettingsPanel />}
          {activeTab === "component-tree" && <BlockTree />}
        </div>
      </div>
    </aside>
  );
};

export default ToolBar;
