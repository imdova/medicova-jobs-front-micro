"use client";

import React, { useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { Plus, Search, Settings } from "lucide-react";
import DataTable from "@/components/UI/data-table";
import FormModal from "@/components/form/FormModal/FormModal";
import { FieldConfig } from "@/types";
import Avatar from "@/components/UI/Avatar";
import { ColumnConfig } from "@/types";
import { Author } from "@/types/blog";
import useFetch from "@/hooks/useFetch";
import {
  API_CREATE_BLOG_AUTHOR,
  API_DELETE_BLOG_AUTHOR,
  API_GET_BLOG_AUTHORS,
} from "@/api/blog";
import useUpdateApi from "@/hooks/useUpdateApi";
import { updateItemInArray } from "@/util/general";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";

const AuthorsTab: React.FC = () => {
  const { data, loading, setData } =
    useFetch<PaginatedResponse<Author>>(API_GET_BLOG_AUTHORS);
  const { update, isLoading, error } = useUpdateApi<Author>();

  const [itemToDelete, setItemToDelete] = useState<Author | null>(null);
  const onClose = () => setItemToDelete(null);
  const authors = data?.data || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Form fields configuration
  const fields: FieldConfig[] = [
    {
      name: "photo",
      type: "file",
      fileProps: {
        size: 70,
        type: "profile",
        maxFiles: 1,
        maxSize: 1,
      },
      label: "Profile Picture",
      gridProps: { xs: 2 },
      required: true,
    },
    {
      name: "name",
      type: "text",
      label: "Full Name",
      required: true,
      gridProps: { xs: 10 },
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      required: true,
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },
  ];

  // Table columns configuration
  const columns: ColumnConfig<Author>[] = [
    {
      key: "name",
      header: "Author",
      sortable: true,
      render: (author) => (
        <div className="flex items-center gap-3">
          <Avatar src={author.photo} alt={author.name} size={40} />
          <div>
            <div className="font-medium text-gray-900">{author.name}</div>
            <div className="text-sm text-gray-500">{author.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
    },
    {
      key: "created_at" as const,
      header: "Created Date",
      sortable: true,
      render: (author) => new Date(author.created_at).toLocaleDateString(),
    },
    {
      key: "updated_at" as const,
      header: "Last Updated",
      sortable: true,
      render: (author) => new Date(author.updated_at).toLocaleDateString(),
    },
  ];

  const handleSubmit = async (body: Partial<Author>) => {
    const isUpdate = Boolean(body.id);
    const endpoint = API_CREATE_BLOG_AUTHOR;
    const method = isUpdate ? "PATCH" : "POST";

    const response = await update(endpoint, { method, body }, null, {
      error: {
        title: "Failed to update author",
        description: "Please try again.",
      },
      success: {
        title: "Author Updated Successfully",
        description: "Your author has been updated successfully.",
      },
    });

    const newAuthors = isUpdate
      ? updateItemInArray(authors, response)
      : [...authors, response];

    setData?.({
      data: newAuthors,
      total: Number(data?.total) + (isUpdate ? 0 : 1),
      limit: data?.limit,
      page: data?.page,
    });

    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await update(
        API_DELETE_BLOG_AUTHOR + itemToDelete.id,
        { method: "DELETE" },
        null,
        {
          error: {
            title: "Failed to delete author",
            description: "Please try again.",
          },
          success: {
            title: "Author Deleted Successfully",
            description: "Your author has been deleted successfully.",
          },
        },
      );

      const newAuthors = authors.filter(
        (author) => author.id !== itemToDelete.id,
      );
      setData?.({
        data: newAuthors,
        total: Number(data?.total) - 1,
        limit: data?.limit,
        page: data?.page,
      });
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <TextField
            fullWidth
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-5 w-5" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="h-5 w-5" />}
          onClick={() => {
            setEditingAuthor(null);
            setIsModalOpen(true);
          }}
        >
          Add <span className="ml-1 hidden md:block">Author</span>
        </Button>
      </div>
      {/* Authors Table */}
      <DataTable
        data={authors}
        total={data?.total}
        selected={selected}
        loading={loading}
        expectedLength={4}
        setSelected={setSelected}
        searchQuery={searchQuery}
        columns={columns}
        cellClassName="p-2 text-sm"
        headerClassName="p-2 text-sm"
        isSelectable={true}
        exportOptions={[
          { label: "PDF", action: () => console.log("Exporting") },
          { label: "CSV", action: () => console.log("Exporting") },
        ]}
        onEdit={handleEdit}
        onDelete={setItemToDelete}
        noDataMessage={{
          title: "No authors found",
          description: "Get started by adding your first author",
          action: {
            label: "Add Author",
            onClick() {
              setEditingAuthor(null);
              setIsModalOpen(true);
            },
          },
        }}
      />
      {itemToDelete && (
        <DeleteConfirmationDialog
          open={Boolean(itemToDelete)}
          loading={isLoading}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`}
          onDelete={handleDelete}
          onClose={onClose}
        />
      )}
      {/* Author Form Modal */}
      <FormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAuthor(null);
        }}
        loading={isLoading}
        error={error?.message}
        onSubmit={handleSubmit}
        fields={fields}
        title={editingAuthor ? "Edit Author" : "Add New Author"}
        description={
          editingAuthor
            ? "Update the author's information below."
            : "Add a new author to your blog team."
        }
        initialValues={editingAuthor || {}}
        resetAfterSubmit="default"
      />
    </div>
  );
};

export default AuthorsTab;
