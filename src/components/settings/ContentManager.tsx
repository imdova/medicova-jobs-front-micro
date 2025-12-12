import { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { Plus } from "lucide-react";
import { Button, Card } from "@mui/material";
import DataTable from "../UI/data-table";
import { FieldConfig } from "@/types";

interface Content {
  id: string;
  title: string;
  slug: string;
  type: "page" | "post" | "custom";
  status: "draft" | "published" | "archived";
  lastModified: string;
}

const contentFields: FieldConfig[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
  },
  {
    name: "type",
    label: "Content Type",
    type: "select",
    options: [
      { label: "Page", value: "page" },
      { label: "Post", value: "post" },
      { label: "Custom", value: "custom" },
    ],
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Archived", value: "archived" },
    ],
    required: true,
  },
];

export function ContentManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            row.original.status === "published"
              ? "bg-green-100 text-green-800"
              : row.original.status === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedContent(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    // TODO: Implement submit logic
    console.log(values);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete logic
    console.log("Delete", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="mb-2 text-lg font-semibold">Pages</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-500">Total Pages</p>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-lg font-semibold">Posts</h3>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-gray-500">Total Posts</p>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-lg font-semibold">Custom Content</h3>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm text-gray-500">Total Custom Content</p>
        </Card>
      </div>

      {/* <DataTable
        columns={columns}
        data={[]} // TODO: Add your data here
        // searchKey="title"
      /> */}

      <FormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedContent(null);
        }}
        onSubmit={handleSubmit}
        fields={contentFields}
        title={selectedContent ? "Edit Content" : "Add New Content"}
        initialValues={selectedContent || {}}
      />
    </div>
  );
}
