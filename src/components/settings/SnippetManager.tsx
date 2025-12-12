import { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { Plus } from "lucide-react";
import { Button } from "@mui/material";
import { FieldConfig } from "@/types";

interface Snippet {
  id: string;
  name: string;
  code: string;
  location: "header" | "footer";
  isActive: boolean;
}

const snippetFields: FieldConfig[] = [
  {
    name: "name",
    label: "Snippet Name",
    type: "text",
    required: true,
  },
  {
    name: "code",
    label: "Snippet Code",
    type: "textArea",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    type: "select",
    options: [
      { label: "Header", value: "header" },
      { label: "Footer", value: "footer" },
    ],
    required: true,
  },
  {
    name: "isActive",
    label: "Active",
    type: "checkbox",
  },
];

export function SnippetManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <span
          className={row.original.isActive ? "text-green-500" : "text-red-500"}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedSnippet(row.original);
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
        <h2 className="text-2xl font-bold">Snippets</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Snippet
        </Button>
      </div>

      {/* <DataTable
        columns={columns}
        data={[]} // TODO: Add your data here
        searchKey="name"
      /> */}

      <FormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSnippet(null);
        }}
        onSubmit={handleSubmit}
        fields={snippetFields}
        title={selectedSnippet ? "Edit Snippet" : "Add New Snippet"}
        initialValues={selectedSnippet || {}}
      />
    </div>
  );
}
