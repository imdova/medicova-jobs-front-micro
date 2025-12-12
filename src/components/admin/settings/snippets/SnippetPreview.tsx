"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, Tab, Tabs, Select as MuiSelect, MenuItem, FormControl, InputLabel } from "@mui/material";
import { FieldConfig } from "@/types";

interface SnippetPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: {
    type: "header" | "footer";
    code: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function SnippetPreview({
  open,
  onOpenChange,
  snippet,
}: SnippetPreviewProps) {
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (snippet) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            ${snippet.type === "header" ? snippet.code : ""}
            <style>
              body { margin: 0; padding: 20px; }
              .preview-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: white;
                min-height: 100vh;
              }
            </style>
          </head>
          <body>
            <div class="preview-content">
              <h1>Preview Content</h1>
              <p>This is a preview of how your snippet will appear on the page.</p>
              <p>You can see how your code affects the layout and styling.</p>
            </div>
            ${snippet.type === "footer" ? snippet.code : ""}
          </body>
        </html>
      `;
      setPreviewHtml(html);
    }
  }, [snippet]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePreviewModeChange = (event: any) => {
    setPreviewMode(event.target.value);
  };

  const fields: FieldConfig[] = [
    {
      name: "previewMode",
      label: "Preview Mode",
      type: "select",
      options: [
        { label: "Desktop", value: "desktop" },
        { label: "Tablet", value: "tablet" },
        { label: "Mobile", value: "mobile" },
      ],
      gridProps: { xs: 12 },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent className="h-[80vh]">
        <DialogTitle>Live Preview</DialogTitle>
        <div className="space-y-4">
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Preview" />
            <Tab label="Code" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <div className="mb-4 flex justify-end">
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Preview Mode</InputLabel>
                <MuiSelect
                  value={previewMode}
                  onChange={handlePreviewModeChange}
                  label="Preview Mode"
                >
                  <MenuItem value="desktop">Desktop</MenuItem>
                  <MenuItem value="tablet">Tablet</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div
              className={`overflow-hidden rounded-lg border ${
                previewMode === "desktop"
                  ? "w-full"
                  : previewMode === "tablet"
                    ? "mx-auto w-[768px]"
                    : "mx-auto w-[375px]"
              }`}
            >
              <iframe
                srcDoc={previewHtml}
                className="h-[500px] w-full border-0"
                title="Preview"
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <pre className="bg-muted overflow-x-auto rounded-lg p-4">
              <code>{snippet.code}</code>
            </pre>
          </TabPanel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
