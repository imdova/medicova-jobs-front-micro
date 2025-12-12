"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button, ListItemIcon, TextField } from "@mui/material";
import DataTable from "@/components/UI/data-table";
import { ColumnConfig } from "@/types";
import { Badge } from "@/components/UI/Badge";
import Loading from "@/components/loading/loading";

interface SEOData {
  id: string;
  urlPath: string;
  title: string;
  metaDescription: string;
  status: "completed" | "missing-fields" | "missing-title";
  lastUpdated: string;
}

export default function SEOManagementPage() {
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const response = await fetch("/api/seo");
      const data = await response.json();
      setSeoData(data);
    } catch (error) {
      console.error("Failed to fetch SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = seoData.filter((item) => {
    const matchesSearch =
      item.urlPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );

      case "missing-fields":
        return (
          <Badge variant="error" size="sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Missing Fields
          </Badge>
        );

      case "missing-title":
        return (
          <Badge variant="warning" size="sm">
            <Clock className="mr-1 h-3 w-3" />
            Missing Title
          </Badge>
        );

      default:
        return (
          <Badge variant="neutral" size="sm">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      await fetch("/api/seo/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedItems }),
      });
      fetchSEOData();
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/seo/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "seo-data.json";
      a.click();
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const columns: ColumnConfig<SEOData>[] = [
    {
      key: "urlPath",
      sortable: true,
      header: "URL Path",
      render: (item) => (
        <div>
          <span className="font-mono text-sm">{item.urlPath}</span>
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
            {item.metaDescription}
          </span>
        </div>
      ),
    },

    {
      key: "status",
      sortable: true,
      header: "Status",
      render: (item: SEOData) => getStatusBadge(item.status),
    },
    {
      key: "lastUpdated",
      sortable: true,
      header: "Last Updated",
      render: (item: SEOData) => (
        <span className="text-muted-foreground text-sm">
          {new Date(item.lastUpdated).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Management Center</h1>
          <p className="text-muted-foreground">
            Manage SEO metadata for all your website URLs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            startIcon={<Download size={14} />}
            variant="outlined"
          >
            Export
          </Button>
          <Button
            startIcon={<Plus size={14} />}
            href="/admin/site-settings/seo/new"
            variant="contained"
            LinkComponent={Link}
          >
            Add SEO Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-soft">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Total URLs</h3>
          </div>
          <div className="text-2xl font-bold">{seoData.length}</div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-soft">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Completed</h3>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {seoData.filter((item) => item.status === "completed").length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-soft">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Missing Fields</h3>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {seoData.filter((item) => item.status === "missing-fields").length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-soft">
          <div className="pb-2">
            <h3 className="text-sm font-medium">Missing Title</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {seoData.filter((item) => item.status === "missing-title").length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border bg-white shadow-soft">
        <div className="flex justify-between px-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold">SEO Data Management</h2>
            <p className="text-muted-foreground">
              View and manage SEO metadata for all your website URLs
            </p>
          </div>
          <TextField
            placeholder="Search URLs or titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </div>

        <DataTable<SEOData>
          data={filteredData}
          total={filteredData.length}
          selected={selectedItems}
          setSelected={setSelectedItems}
          isSelectable
          cellClassName="p-2 text-sm"
          headerClassName="p-2 text-sm"
          tableHeaderClass="border-b border-gray-200 p-3"
          className="border-none"
          searchQuery={searchTerm}
          columns={columns}
          columnManager={true}
          defaultVisibleColumns={[
            "URL Path",
            "Title",
            "Meta Description",
            "Status",
            "Last Updated",
          ]}
          exportOptions={[
            { label: "PDF", action: () => console.log("Exporting PDF") },
            { label: "CSV", action: () => console.log("Exporting CSV") },
          ]}
          options={[
            {
              label: (item?: SEOData) => (
                <Link
                  href={`/admin/site-settings/seo/edit/${item?.id}`}
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
              label: (item?: SEOData) => (
                <Link
                  href={`/admin/site-settings/seo/edit/${item?.id}`}
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
              label: <span className="text-red-500">Delete</span>,
              action: (item) => {
                // Handle delete action
                console.log("Delete item:", item);
              },
              icon: <Trash2 size={15} className="text-red-500" />,
            },
          ]}
          actionOptions={[
            {
              label: (items) => (
                <span className="text-red-500">
                  {" "}
                  Delete Selected ({items?.length || 0})
                </span>
              ),
              action: handleBulkDelete,
              icon: <Trash2 size={15} className="text-red-500" />,
            },
          ]}
          noDataMessage={{
            title: "No SEO Data Found",
            description: "No SEO data found matching your criteria.",
            action: {
              label: "Add Your First SEO Entry",
              href: "/admin/site-settings/seo/new",
            },
          }}
        />
      </div>
    </div>
  );
}
