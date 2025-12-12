"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  History,
} from "lucide-react";
import { ListItemIcon, TextField } from "@mui/material";
import DataTable from "@/components/UI/data-table";
import { ColumnConfig } from "@/types";
import { Badge } from "@/components/UI/Badge";
import Loading from "@/components/loading/loading";

interface ContentData {
  id: string;
  page: "home" | "about" | "contact";
  title: string;
  content: string;
  media: string[];
  status: "published" | "draft" | "archived";
  lastUpdated: string;
  version: number;
}

const CONTENT_DATA: ContentData[] = [
  {
    id: "1",
    page: "home",
    title: "Welcome to Our Website",
    content:
      "Discover our services and solutions tailored for you. Explore now!",
    media: ["/images/home-banner.jpg", "/videos/welcome-video.mp4"],
    status: "published",
    lastUpdated: "2025-06-30T10:00:00Z",
    version: 3,
  },
  {
    id: "2",
    page: "home",
    title: "Home Page Draft",
    content: "Draft version of the home page with updated content.",
    media: ["/images/home-draft.jpg"],
    status: "draft",
    lastUpdated: "2025-07-02T14:30:00Z",
    version: 1,
  },
  {
    id: "3",
    page: "about",
    title: "About Our Company",
    content: "We are a leading provider of innovative solutions since 2000.",
    media: ["/images/team-photo.jpg", "/images/office.jpg"],
    status: "published",
    lastUpdated: "2025-06-25T09:15:00Z",
    version: 5,
  },
  {
    id: "4",
    page: "about",
    title: "Our Mission",
    content: "Previous version of About page with mission focus.",
    media: [],
    status: "archived",
    lastUpdated: "2025-05-10T11:45:00Z",
    version: 2,
  },
  {
    id: "5",
    page: "contact",
    title: "Get in Touch",
    content: "Reach us via email, phone, or visit our office.",
    media: ["/images/contact-map.jpg"],
    status: "published",
    lastUpdated: "2025-07-01T16:20:00Z",
    version: 4,
  },
  {
    id: "6",
    page: "contact",
    title: "Contact Us Draft",
    content: "Draft contact page with updated office hours.",
    media: ["/images/contact-draft.jpg"],
    status: "draft",
    lastUpdated: "2025-07-03T08:00:00Z",
    version: 1,
  },
];

export default function ContentManagementPage() {
  const [contentData, setContentData] = useState<ContentData[]>(CONTENT_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContentData(data);
    } catch (error) {
      console.error("Failed to fetch content data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = contentData.filter((item) => {
    const matchesSearch =
      item.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="mr-1 h-3 w-3" />
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="warning" size="sm">
            <Clock className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="error" size="sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            Unknown
          </Badge>
        );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      await fetch("/api/content/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedItems }),
      });
      fetchContentData();
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  const columns: ColumnConfig<ContentData>[] = [
    {
      key: "page",
      sortable: true,
      header: "Page",
      render: (item) => (
        <div>
          <span className="font-mono text-sm">{item.page}</span>
        </div>
      ),
    },
    {
      key: "title",
      sortable: true,
      header: "Title",
      render: (item) => (
        <div>
          <span className="text-sm">{item.title}</span>
          <span className="line-clamp-1 max-w-56 text-xs text-muted-foreground">
            {item.content}
          </span>
        </div>
      ),
    },
    {
      key: "media",
      sortable: false,
      header: "Media",
      render: (item) => (
        <span className="text-sm">{item.media.length} files</span>
      ),
    },
    {
      key: "status",
      sortable: true,
      header: "Status",
      render: (item: ContentData) => getStatusBadge(item.status),
    },
    {
      key: "lastUpdated",
      sortable: true,
      header: "Last Updated",
      render: (item: ContentData) => (
        <span className="text-muted-foreground text-sm">
          {new Date(item.lastUpdated).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "version",
      sortable: true,
      header: "Version",
      render: (item: ContentData) => (
        <span className="text-muted-foreground text-sm">{item.version}</span>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management Center</h1>
          <p className="text-muted-foreground">
            Manage content for core website pages
          </p>
        </div>
        <div className="flex gap-2">
          <TextField
            placeholder="Search pages or titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </div>
      </div>

      {/* Filters and Search */}
      <DataTable<ContentData>
        data={filteredData}
        total={filteredData.length}
        selected={selectedItems}
        setSelected={setSelectedItems}
        isSelectable
        cellClassName="p-2 text-sm"
        headerClassName="p-2 text-sm"
        searchQuery={searchTerm}
        columns={columns}
        columnManager={true}
        defaultVisibleColumns={[
          "Page",
          "Title",
          "Content",
          "Media",
          "Status",
          "Last Updated",
          "Version",
        ]}
        exportOptions={[
          { label: "PDF", action: () => console.log("Exporting PDF") },
          { label: "CSV", action: () => console.log("Exporting CSV") },
        ]}
        options={[
          {
            label: (item?: ContentData) => (
              <Link
                href={`/admin/site-settings/content/edit/${item?.id}`}
                className="w-full"
              >
                <ListItemIcon>
                  <Edit className="mr-2 h-4 w-4" />
                </ListItemIcon>
                Edit
              </Link>
            ),
          },
          {
            label: (item?: ContentData) => (
              <Link
                href={`/admin/site-settings/content/preview/${item?.id}`}
                className="w-full"
              >
                <ListItemIcon>
                  <Eye className="mr-2 h-4 w-4" />
                </ListItemIcon>
                Preview
              </Link>
            ),
          },
          {
            label: (item?: ContentData) => (
              <Link
                href={`/admin/site-settings/content/history/${item?.id}`}
                className="w-full"
              >
                <ListItemIcon>
                  <History className="mr-2 h-4 w-4" />
                </ListItemIcon>
                View History
              </Link>
            ),
          },
        ]}
        noDataMessage={{
          title: "No Content Found",
          description: "No content found matching your criteria.",
          action: {
            label: "Add Your First Content Entry",
            href: "/admin/site-settings/content/new",
          },
        }}
      />
    </div>
  );
}
