"use client";

import React, { useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { Plus, Search, Settings } from "lucide-react";
import DataTable from "@/components/UI/data-table";
import FormModal from "@/components/form/FormModal/FormModal";
import { FieldConfig } from "@/types";
import { ColumnConfig } from "@/types";
import { Category } from "@/types/blog";
import useFetch from "@/hooks/useFetch";
import {
  API_CREATE_BLOG_CATEGORY,
  API_DELETE_BLOG_CATEGORY,
  API_GET_BLOG_CATEGORIES,
} from "@/api/blog";
import useUpdateApi from "@/hooks/useUpdateApi";
import { updateItemInArray } from "@/util/general";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";

const CategoriesTab: React.FC = () => {
  const { data, loading, setData } = useFetch<PaginatedResponse<Category>>(
    API_GET_BLOG_CATEGORIES,
  );
  const { update, isLoading, error } = useUpdateApi<Category>();

  const categories = data?.data || [];

  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const onClose = () => setItemToDelete(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form fields configuration
  const fields: FieldConfig[] = [
    {
      name: "name",
      type: "text",
      label: "Category Name",
      required: true,
    },
  ];

  // Table columns configuration
  const columns: ColumnConfig<Category>[] = [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
    },
    {
      key: "created_at" as const,
      header: "Created Date",
      sortable: true,
      render: (category) => new Date(category.created_at).toLocaleDateString(),
    },
    {
      key: "updated_at" as const,
      header: "Last Updated",
      sortable: true,
      render: (category) => new Date(category.updated_at).toLocaleDateString(),
    },
  ];

  const handleSubmit = async (body: Partial<Category>) => {
    const isUpdate = Boolean(body.id);
    const endpoint = API_CREATE_BLOG_CATEGORY;
    const method = isUpdate ? "PATCH" : "POST";

    const response = await update(endpoint, { method, body }, null, {
      error: {
        title: "Failed to update category",
        description: "Please try again.",
      },
      success: {
        title: "Category Updated Successfully",
        description: "Your category has been updated successfully.",
      },
    });

    const newCategories = isUpdate
      ? updateItemInArray(categories, response)
      : [...categories, response];

    setData?.({
      data: newCategories,
      total: Number(data?.total) + (isUpdate ? 0 : 1),
      limit: data?.limit,
      page: data?.page,
    });

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await update(
        API_DELETE_BLOG_CATEGORY + itemToDelete.id,
        { method: "DELETE" },
        null,
        {
          error: {
            title: "Failed to delete category",
            description: "Please try again.",
          },
          success: {
            title: "Category Deleted Successfully",
            description: "Your category has been deleted successfully.",
          },
        },
      );

      const newCategories = categories.filter(
        (category) => category.id !== itemToDelete.id,
      );
      setData?.({
        data: newCategories,
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
            placeholder="Search categories..."
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
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add <span className="ml-1 hidden md:block">Category</span>
        </Button>
      </div>
      {/* Categories Table */}
      <DataTable
        data={categories}
        total={data?.total}
        selected={selected}
        loading={loading}
        expectedLength={5}
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
          title: "No categories found",
          description: "Get started by adding your first category",
          action: {
            label: "Add Category",
            onClick() {
              setEditingCategory(null);
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
      {/* Category Form Modal */}
      <FormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        loading={isLoading}
        error={error?.message}
        onSubmit={handleSubmit}
        fields={fields}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        description={
          editingCategory
            ? "Update the category's information below."
            : "Add a new category to organize your blog posts."
        }
        initialValues={editingCategory || {}}
        resetAfterSubmit="default"
      />
    </div>
  );
};

export default CategoriesTab;
