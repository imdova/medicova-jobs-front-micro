import React, { useState, useEffect } from "react";
import { Tooltip, Box } from "@mui/material";
import { LoaderCircle } from "lucide-react";
import { useBlogStore } from "@/lib/blog/blog-store";
import { formatDistanceToNow } from "@/util";

type Props = {
  isSaving: boolean;
  lastSavedAt: Date | null;
  onManualSave: () => void;
};

const SaveStatusIndicator: React.FC = () => {
  const { saveDraft, isSaving, lastSaved, settings, updateSettings, isDirty } = useBlogStore();
  const [status, setStatus] = useState<"saving" | "saved">("saved");

  useEffect(() => {
    if (isSaving) {
      setStatus("saving");
    } else {
      // When isSaving becomes false, show "saved" state
      setStatus("saved");
    }
  }, [isSaving]);

  const getStatusText = () => {
    if (status === "saving") return "Saving...";
    if (isDirty) return "unSaved Changes"
    return "saved";
  };

  const lastEdited = formatDistanceToNow(lastSaved || settings.updated_at || settings.created_at || "")


  return (
    <div className="flex gap-4">

      <Tooltip title="Click to save manually">
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={saveDraft}
        >
          {status === "saving" && (
            <LoaderCircle className="animate-spin" size={20} />
          )}
          <p  >
            {
              status === "saving" ? <span className="text-muted-foreground text-xs">Saving ...</span> : isDirty ? <span className="text-amber-600 text-xs">unSaved Changes</span> : <span className="text-primary text-xs">
                Saved {" "} {lastEdited ? `(${lastEdited})` : ""}
              </span>
            }

          </p>
        </Box>
      </Tooltip>
      <div>
        <input type="text"
          placeholder="Name"
          value={settings.name}
          onChange={(e) => updateSettings({ name: e.target.value })}
          className="text-sm w-40 p-1 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SaveStatusIndicator;
