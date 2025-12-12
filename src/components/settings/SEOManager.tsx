import { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { Plus } from "lucide-react";
import { Button } from "@mui/material";
import { FieldConfig } from "@/types";

interface SEOMetadata {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const seoFields: FieldConfig[] = [
  {
    name: "url",
    label: "URL Path",
    type: "text",
    required: true,
    // placeholder: "/about-us",
  },
  {
    name: "title",
    label: "Meta Title",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Meta Description",
    type: "textArea",
    required: true,
  },
  {
    name: "keywords",
    label: "Meta Keywords",
    type: "text",
    // placeholder: "keyword1, keyword2, keyword3",
  },
  {
    name: "ogTitle",
    label: "Open Graph Title",
    type: "text",
  },
  {
    name: "ogDescription",
    label: "Open Graph Description",
    type: "textArea",
  },
  {
    name: "ogImage",
    label: "Open Graph Image URL",
    type: "text",
  },
];

export function SEOManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSEO, setSelectedSEO] = useState<SEOMetadata | null>(null);

  const columns = [
    {
      accessorKey: "url",
      header: "URL",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="max-w-md truncate">{row.original.description}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedSEO(row.original);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SEO Metadata</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add SEO Metadata
        </Button>
      </div>

      {/* <DataTable
        columns={columns}
        data={[]} // TODO: Add your data here
        searchKey="url"
      /> */}

      <FormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSEO(null);
        }}
        onSubmit={handleSubmit}
        fields={seoFields}
        title={selectedSEO ? "Edit SEO Metadata" : "Add SEO Metadata"}
        initialValues={selectedSEO || {}}
      />
    </div>
  );
}
