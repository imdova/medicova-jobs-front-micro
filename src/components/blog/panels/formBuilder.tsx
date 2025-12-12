import { Tooltip } from "@mui/material";
import { Pen, Plus } from "lucide-react";
import FormCard from "../FormCard";
import { useBlogStore } from "@/lib/blog/blog-store";
import { Option } from "@/types";
import { useEffect, useState } from "react";
import { cn } from "@/util";
import FormModalContentEditor from "../sections/FormModalContent";

const tabs: Option<Record<"all" | "content", string>>[] = [
  { value: "all", label: "All", icon: <Plus size={14} /> },
  { value: "content", label: "Content", icon: <Pen size={14} /> },
];

export const FormBuilder = () => {
  const { forms, addForm, selectedFormId } = useBlogStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (selectedFormId) {
      setActiveTab("content");
    }
  }, [selectedFormId]);

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
        {activeTab === "all" && (
          <div className="space-y-2">
            <h4 className="!mb-5 text-xl font-semibold">All Forms</h4>
            {forms?.length ? (
              forms.map((form) => <FormCard key={form.id} form={form} />)
            ) : (
              <div className="flex min-h-32 items-center justify-center bg-gray-100 p-4">
                <p>No forms found</p>
              </div>
            )}

            <button
              onClick={() => {
                setActiveTab("content");
                addForm();
              }}
              className="flex items-center gap-2 rounded border border-gray-200 bg-gray-100 px-4 py-2 text-xs"
            >
              Create New Form
              <Plus size={16} />
            </button>
          </div>
        )}
        {activeTab === "content" && <FormModalContentEditor />}
      </div>
    </div>
  );
};
