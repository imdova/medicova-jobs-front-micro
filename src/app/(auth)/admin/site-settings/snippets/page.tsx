"use client";

import { useState } from "react";
import { Button, Tab, Tabs, TextField } from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { addToast } from "@/store/slices/toastSlice";
import { Plus, Search } from "lucide-react";
import { Option } from "@/types";
import DataTable from "@/components/UI/data-table";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import { ColumnConfig } from "@/types";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { ListItemIcon } from "@mui/material";
import { CheckboxField } from "@/components/form/FormModal/fields/CheckboxField";
import { SnippetDialog } from "@/components/admin/settings/snippets/SnippetDialog";
import { SnippetPreviewDialog } from "@/components/admin/settings/snippets/SnippetPreviewDialog";

interface Snippet {
  id: string; // Unique identifier
  name: string; // Friendly name (e.g. "Google Analytics v4")
  position: "head" | "footer"; // Where to inject
  content: string; // The actual code snippet
  isActive: boolean; // Is the snippet enabled?
  type: "script" | "style" | "meta" | "custom"; // Type of snippet (optional but useful)
  order: number; // Injection priority/order
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
  notes?: string; // Admin notes (optional)
  pages?: string[]; // Optional: List of pathnames where it applies, empty = all
}

const tabs: Option[] = [
  { label: "All Snippets", value: "all" },
  { label: "Head", value: "head" },
  { label: "Footer", value: "footer" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// Dummy data
const dummySnippets: Snippet[] = [
  {
    id: "snippet-ga4",
    name: "Google Analytics 4",
    position: "head",
    content:
      "<script async src='https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX'></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXX');</script>",
    isActive: true,
    type: "script",
    order: 1,
    createdAt: "2025-06-16T10:00:00Z",
    updatedAt: "2025-06-16T10:00:00Z",
    notes: "Standard GA4 tracking code",
    pages: [],
  },
  {
    id: "snippet-meta-verification",
    name: "Google Site Verification",
    position: "head",
    content: "<meta name='google-site-verification' content='abc123' />",
    isActive: true,
    type: "meta",
    order: 2,
    createdAt: "2025-06-16T10:05:00Z",
    updatedAt: "2025-06-16T10:05:00Z",
    notes: "For Search Console",
    pages: ["/", "/about"],
  },
  {
    id: "snippet-chat-widget",
    name: "Chat Widget",
    position: "footer",
    content: "<script src='https://example.com/chat.js'></script>",
    isActive: true,
    type: "script",
    order: 1,
    createdAt: "2025-06-16T10:10:00Z",
    updatedAt: "2025-06-16T10:10:00Z",
    notes: "3rd party chat support",
    pages: [],
  },
  {
    id: "snippet-dark-mode-css",
    name: "Dark Mode CSS",
    position: "head",
    content: "<style>body { background: #000; color: #fff; }</style>",
    isActive: false,
    type: "style",
    order: 3,
    createdAt: "2025-06-16T10:20:00Z",
    updatedAt: "2025-06-16T10:20:00Z",
    notes: "For testing dark mode",
    pages: ["/test"],
  },
];

export default function SnippetManager() {
  const [snippets, setSnippets] = useState<Snippet[]>(dummySnippets);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [snippetToDelete, setSnippetToDelete] = useState<Snippet | null>(null);
  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
  const dispatch = useAppDispatch();

  const handleAddSnippet = () => {
    setSelectedSnippet(null);
    setIsDialogOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsDialogOpen(true);
  };

  const handlePreviewSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsPreviewOpen(true);
  };

  const handleDeleteSnippet = (snippet: Snippet) => {
    setSnippetToDelete(snippet);
  };

  const handleConfirmDelete = () => {
    if (snippetToDelete) {
      const updatedSnippets = snippets.filter(
        (s) => s.id !== snippetToDelete.id,
      );
      setSnippets(updatedSnippets);
      dispatch(
        addToast({
          id: Math.random().toString(),
          type: "success",
          message: "Snippet deleted successfully",
        }),
      );
    }
    setSnippetToDelete(null);
  };

  const handleToggleActive = (snippet: Snippet) => {
    const updatedSnippets = snippets.map((s) =>
      s.id === snippet.id
        ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() }
        : s,
    );
    setSnippets(updatedSnippets);
    dispatch(
      addToast({
        id: Math.random().toString(),
        type: "success",
        message: `Snippet ${!snippet.isActive ? "activated" : "deactivated"} successfully`,
      }),
    );
  };

  const handleSaveSnippet = async (snippetData: Partial<Snippet>) => {
    try {
      if (selectedSnippet) {
        // Update existing snippet
        const updatedSnippets = snippets.map((s) =>
          s.id === selectedSnippet.id
            ? { ...s, ...snippetData, updatedAt: new Date().toISOString() }
            : s,
        );
        setSnippets(updatedSnippets);
        dispatch(
          addToast({
            id: Math.random().toString(),
            type: "success",
            message: "Snippet updated successfully",
          }),
        );
      } else {
        // Add new snippet
        const newSnippet: Snippet = {
          id: Math.random().toString(36).substr(2, 9),
          ...snippetData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Snippet;
        setSnippets([...snippets, newSnippet]);
        dispatch(
          addToast({
            id: Math.random().toString(),
            type: "success",
            message: "Snippet added successfully",
          }),
        );
      }
    } catch (error) {
      dispatch(
        addToast({
          id: Math.random().toString(),
          type: "error",
          message: "Failed to save snippet",
        }),
      );
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      snippet.position === activeTab ||
      (activeTab === "active" && snippet.isActive) ||
      (activeTab === "inactive" && !snippet.isActive);
    return matchesSearch && matchesTab;
  });

  const columns: ColumnConfig<Snippet>[] = [
    {
      key: "name",
      sortable: true,
      header: "Name",
      render: (snippet: Snippet) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{snippet.name}</span>
          {snippet.notes && (
            <span className="text-xs text-gray-500">{snippet.notes}</span>
          )}
        </div>
      ),
    },
    {
      key: "position",
      sortable: true,
      header: "Position",
      render: (snippet: Snippet) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            snippet.position === "head"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {snippet.position}
        </span>
      ),
    },
    {
      key: "type",
      sortable: true,
      header: "Type",
      render: (snippet: Snippet) => (
        <span className="text-sm capitalize">{snippet.type}</span>
      ),
    },
    {
      key: "order",
      sortable: true,
      header: "Order",
      render: (snippet: Snippet) => (
        <span className="text-sm">{snippet.order}</span>
      ),
    },
    {
      key: "isActive",
      sortable: true,
      header: "Status",
      render: (snippet: Snippet) => (
        <div className="flex items-center gap-2">
          <CheckboxField
            field={{
              name: "isActive",
              type: "checkbox",
            }}
            controllerField={{
              value: snippet.isActive,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleToggleActive(snippet),
            }}
          />
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              snippet.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {snippet.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "pages",
      sortable: false,
      header: "Pages",
      render: (snippet: Snippet) => (
        <span className="text-sm">
          {snippet.pages && snippet.pages.length > 0
            ? `${snippet.pages.length} page(s)`
            : "All pages"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      sortable: true,
      header: "Last Updated",
      render: (snippet: Snippet) => {
        const date = new Date(snippet.updatedAt);
        return (
          <span className="text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <DeleteConfirmationDialog
        open={Boolean(snippetToDelete)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the snippet "${snippetToDelete?.name}"? This action cannot be undone.`}
        onDelete={handleConfirmDelete}
        onClose={() => setSnippetToDelete(null)}
      />

      <div className="border-b border-gray-200">
        <div className="flex flex-col justify-between gap-3 md:flex-row">
          <h5 className="w-full p-3 pb-1 text-xl font-semibold text-main">
            Header & Footer Snippet Manager
            <span className="ml-1 text-sm text-muted-foreground">
              ({filteredSnippets.length})
            </span>
          </h5>
          <div className="flex w-full justify-end gap-2">
            <TextField
              variant="outlined"
              placeholder="Search snippets..."
              value={searchQuery}
              InputProps={{
                startAdornment: <Search />,
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              startIcon={<Plus size={14} />}
              variant="contained"
              onClick={handleAddSnippet}
            >
              Add New Snippet
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="col-span-1">
            <Tabs
              value={activeTab}
              onChange={(e, value) => setActiveTab(value)}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons={false}
              className="text-base"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  className="text-nowrap text-xs"
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      <DataTable<Snippet>
        data={filteredSnippets}
        total={filteredSnippets.length}
        selected={selectedItems}
        setSelected={setSelectedItems}
        isSelectable
        cellClassName="p-2 text-sm"
        headerClassName="p-2 text-sm"
        searchQuery={searchQuery}
        columns={columns}
        columnManager={true}
        defaultVisibleColumns={[
          "Name",
          "Position",
          "Type",
          "Order",
          "Status",
          "Pages",
          "Last Updated",
        ]}
        exportOptions={[
          { label: "PDF", action: () => console.log("Exporting PDF") },
          { label: "CSV", action: () => console.log("Exporting CSV") },
        ]}
        options={[
          {
            label: (item) => (
              <button
                onClick={() => item && handlePreviewSnippet(item)}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <Eye className="h-4 w-4" />
                </ListItemIcon>
                Preview
              </button>
            ),
          },
          {
            label: (item) => (
              <button
                onClick={() => item && handleEditSnippet(item)}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                Edit
              </button>
            ),
          },
          {
            label: (item) => (
              <button
                onClick={() => item && handleToggleActive(item)}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                {item?.isActive ? "Deactivate" : "Activate"}
              </button>
            ),
          },
          {
            label: <span className="text-red-500">Delete</span>,
            action: (snippet) => snippet && handleDeleteSnippet(snippet),
            icon: <Trash2 size={15} className="text-red-500" />,
          },
        ]}
        actionOptions={[
          {
            label: (items) => (
              <button
                onClick={() => {
                  if (!items || items.length === 0) return;
                  const updatedSnippets = snippets.map((s) => {
                    if (items.some((item) => item.id === s.id)) {
                      return {
                        ...s,
                        isActive: true,
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return s;
                  });
                  setSnippets(updatedSnippets);
                  dispatch(
                    addToast({
                      id: Math.random().toString(),
                      type: "success",
                      message: `Bulk activated ${items.length} snippet(s)`,
                    }),
                  );
                }}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                <span>Activate Selected</span>
              </button>
            ),
          },
          {
            label: (items) => (
              <button
                onClick={() => {
                  if (!items || items.length === 0) return;
                  const updatedSnippets = snippets.map((s) => {
                    if (items.some((item) => item.id === s.id)) {
                      return {
                        ...s,
                        isActive: false,
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return s;
                  });
                  setSnippets(updatedSnippets);
                  dispatch(
                    addToast({
                      id: Math.random().toString(),
                      type: "success",
                      message: `Bulk deactivated ${items.length} snippet(s)`,
                    }),
                  );
                }}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                <span>Deactivate Selected</span>
              </button>
            ),
          },
          {
            label: (items) => (
              <button
                onClick={() => {
                  if (!items || items.length === 0) return;
                  const updatedSnippets = snippets.map((s) => {
                    if (items.some((item) => item.id === s.id)) {
                      return {
                        ...s,
                        position: "head" as const,
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return s;
                  });
                  setSnippets(updatedSnippets);
                  dispatch(
                    addToast({
                      id: Math.random().toString(),
                      type: "success",
                      message: `Set ${items.length} snippet(s) to head position`,
                    }),
                  );
                }}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                <span>Set All to Head</span>
              </button>
            ),
          },
          {
            label: (items) => (
              <button
                onClick={() => {
                  if (!items || items.length === 0) return;
                  const updatedSnippets = snippets.map((s) => {
                    if (items.some((item) => item.id === s.id)) {
                      return {
                        ...s,
                        position: "footer" as const,
                        updatedAt: new Date().toISOString(),
                      };
                    }
                    return s;
                  });
                  setSnippets(updatedSnippets);
                  dispatch(
                    addToast({
                      id: Math.random().toString(),
                      type: "success",
                      message: `Set ${items.length} snippet(s) to footer position`,
                    }),
                  );
                }}
                className="w-full text-left"
              >
                <ListItemIcon>
                  <SquarePen className="h-4 w-4" />
                </ListItemIcon>
                <span>Set All to Footer</span>
              </button>
            ),
          },
        ]}
      />

      <SnippetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        snippet={selectedSnippet || undefined}
        onSubmit={handleSaveSnippet}
      />

      <SnippetPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        snippet={selectedSnippet || undefined}
      />
    </>
  );
}
