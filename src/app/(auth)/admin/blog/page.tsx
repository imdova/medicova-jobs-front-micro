"use client";

import { useMemo, useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Plus, Search, List, Grid } from "lucide-react";
import DataTable from "@/components/UI/data-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Author, BlogType, Category } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";
import useFetch from "@/hooks/useFetch";
import {
  API_CREATE_BLOG,
  API_DELETE_BLOG,
  API_GET_BLOG_AUTHORS,
  API_GET_BLOG_CATEGORIES,
  API_GET_BLOGS,
} from "@/api/blog";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import useUpdateApi from "@/hooks/useUpdateApi";
import FormModal from "@/components/form/FormModal/FormModal";
import { generateSlug, getNestedValue, isFileWithPreview } from "@/util/forms";
import {
  ActionType,
  columns,
  getDefaultBlogData,
  getFields,
  getOptions,
  NoResultMessage,
} from "./helper";
import { TAGS } from "@/api";
import uploadFiles from "@/lib/files/imageUploader";
import { showToast } from "@/util";
import { useAppDispatch } from "@/store/hooks";
import { updateItemInArray } from "@/util/general";

const BlogManagementPage = () => {
  const { data, loading, setData, refetch } =
    useFetch<PaginatedResponse<BlogType>>(API_GET_BLOGS);
  const { update, isLoading, error } = useUpdateApi<BlogType>();
  const dispatch = useAppDispatch();
  const { data: categories } = useFetch<PaginatedResponse<Category>>(
    API_GET_BLOG_CATEGORIES,
  );
  const { data: authors } =
    useFetch<PaginatedResponse<Author>>(API_GET_BLOG_AUTHORS);

  const blogs = data?.data || [];

  const router = useRouter();
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [itemToDelete, setItemToDelete] = useState<BlogType | null>(null);
  const [quickEditBlog, setQuickEditBlog] = useState<BlogType | null>(null);

  const onClose = () => setItemToDelete(null);
  const onCloseQuickEdit = () => {
    setQuickEditBlog(null);
  };

  const filteredData = useMemo(() => {
    const searchFields = columns
      .map((column) => column.key)
      .filter((x) => Boolean(x)) as string[];
    if (!searchQuery || !searchFields?.length) return data?.data || [];
    return (data?.data || []).filter((item) =>
      searchFields.some((field) =>
        String(getNestedValue(item, field)) // Ensure no undefined errors
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [data, searchQuery]);

  // Define fields for the quick edit form

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle view mode change
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "list" | "grid" | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleQuickEditSubmit = async (formData: any) => {
    if (!quickEditBlog) return { error: true };

    try {
      let photoUrl = formData.photo;
      if (isFileWithPreview(formData.photo[0])) {
        const uploadedUrls = await uploadFiles(
          formData.photo as unknown as File[],
        );
        if (uploadedUrls.length > 0) {
          photoUrl = uploadedUrls[0];
        } else {
          showToast(dispatch, "Failed to upload photo", { type: "error" });
          return;
        }
      }

      const keyWords = Array.isArray(formData.keywords)
        ? formData.keywords.join(",")
        : formData.keywords;

      const blogData = {
        ...formData,
        photo: photoUrl,
        slug: formData.slug || generateSlug(formData.title),
        keywords: keyWords,
        isActive: true,
        isDraft: false,
        isTemplate: false,
        content: {
          ...formData.content,
          photo: photoUrl,
        },
      } as BlogType;

      await update(API_CREATE_BLOG, { body: blogData }, TAGS.blogs, {
        error: {
          title: "Failed to update blog",
          description: "Please try again.",
        },
        success: {
          title: "Blog Updated Successfully",
          description: "Your blog has been updated successfully.",
        },
      });
      refetch();
      onCloseQuickEdit();
      return { error: false };
    } catch (error) {
      console.error("Failed to update blog:", error);
      return { error: true };
    }
  };

  const handleToggleTemplate = async (blog: BlogType) => {
    try {
      const updatedBlog = await update(
        API_CREATE_BLOG,
        {
          body: {
            id: blog.id,
            isTemplate: !blog.isTemplate,
          },
        },
        TAGS.blogs,
        {
          error: {
            title: blog.isTemplate
              ? "Failed to remove from templates"
              : "Failed to mark as template",
            description: "Please try again.",
          },
          success: {
            title: blog.isTemplate
              ? "Removed from templates"
              : "Marked as template",
            description: blog.isTemplate
              ? "Your blog has been removed from templates successfully."
              : "Your blog has been marked as template successfully.",
          },
        },
      );
      if (updatedBlog) {
        const newBlogs = updateItemInArray(data?.data || [], updatedBlog);
        setData?.({
          data: newBlogs,
          total: data?.total || newBlogs.length,
          limit: data?.limit || 10,
          page: data?.page || 1,
        });
      }
    } catch (error) {
      console.error("Failed to toggle template:", error);
    }
  };

  const handleStatusChange = async (blog: BlogType) => {
    try {
      const updatedBlog = await update(
        API_CREATE_BLOG,
        {
          body: {
            id: blog.id,
            isActive: !blog.isActive,
          },
        },
        TAGS.blogs,
        {
          error: {
            title: blog.isActive
              ? "Failed to move to draft"
              : "Failed to publish",
            description: "Please try again.",
          },
          success: {
            title: blog.isActive ? "Move To Draft" : "Publish",
            description: blog.isActive
              ? "Your blog has been moved to draft successfully."
              : "Your blog has been published successfully.",
          },
        },
      );
      if (updatedBlog) {
        const newBlogs = updateItemInArray(data?.data || [], updatedBlog);
        setData?.({
          data: newBlogs,
          total: data?.total || newBlogs.length,
          limit: data?.limit || 10,
          page: data?.page || 1,
        });
      }
    } catch (error) {
      console.error("Failed to toggle template:", error);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await update(
        API_DELETE_BLOG + itemToDelete.id,
        { method: "DELETE" },
        null,
        {
          error: {
            title: "Failed to delete blog",
            description: "Please try again.",
          },
          success: {
            title: "Blog Deleted Successfully",
            description: "Your blog has been deleted successfully.",
          },
        },
      );

      const newBlogs = blogs.filter((blog) => blog.id !== itemToDelete.id);
      setData?.({
        data: newBlogs,
        total: (data?.total || 0) - 1,
        limit: data?.limit,
        page: data?.page,
      });
      onClose();
    }
  };

  // Table columns configuration

  // Action options for the table

  const handleAction = ({
    type,
    data,
  }: {
    type: ActionType;
    data: BlogType;
  }) => {
    switch (type) {
      case "quick-update":
        setQuickEditBlog(data);
        break;
      case "toggle-template":
        handleToggleTemplate(data);
        break;
      case "status-change":
        handleStatusChange(data);
        break;
      case "delete":
        setItemToDelete(data);
        break;
      default:
        break;
    }
  };

  const initialBlogValue = getDefaultBlogData(quickEditBlog);
  return (
    <div className="my-8 w-full space-y-3 px-4 md:px-5">
      {/* Header */}
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

      {/* Quick Edit Modal */}
      {quickEditBlog && (
        <FormModal
          open={Boolean(quickEditBlog)}
          onClose={onCloseQuickEdit}
          onSubmit={handleQuickEditSubmit}
          maxWidth="md"
          fields={getFields({
            authors: authors?.data || [],
            categories: categories?.data || [],
          })}
          title={`Quick Edit - ${quickEditBlog?.name}`}
          description="Update the most important settings for this blog post"
          initialValues={initialBlogValue}
          loading={isLoading}
          submitButtonText="Save Changes"
          cancelButtonText="Cancel"
        />
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your blog categories and authors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-6">
        <TextField
          type="text"
          placeholder="Search blogs by title, description, or tags..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="h-5 w-5" />
              </InputAdornment>
            ),
            autoComplete: "off",
          }}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-80"
        />
        <div className="flex items-center gap-4">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="list" aria-label="list view">
              <List className="h-4 w-4" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <Grid className="h-4 w-4" />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            component={Link}
            href="/admin/blog/new"
            variant="contained"
            startIcon={<Plus className="h-5 w-5" />}
          >
            Create New Article
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      {viewMode === "list" ? (
        <div className="rounded-base border border-gray-200 bg-white shadow-soft">
          <DataTable
            data={blogs || []}
            total={data?.total}
            loading={loading}
            expectedLength={4}
            searchQuery={searchQuery}
            columns={columns}
            cellClassName="p-2 text-sm"
            headerClassName="p-2 text-sm"
            className="border-none"
            options={getOptions(handleAction)}
            noDataMessage={{
              title: "No blogs found",
              description: "Get started by creating your first blog post",
              action: {
                label: "Create New Blog",
                href: "/admin/blog/new",
              },
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData?.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isSelected={selected.includes(blog.id)}
              onSelect={(id) => {
                if (selected.includes(id)) {
                  setSelected(
                    selected.filter((selectedId) => selectedId !== id),
                  );
                } else {
                  setSelected([...selected, id]);
                }
              }}
              onEdit={(blog) => router.push(`/admin/blog/${blog.id}/edit`)}
              onDelete={(blog) => {
                if (
                  confirm(`Are you sure you want to delete "${blog.title}"?`)
                ) {
                  console.log("Delete blog:", blog.id);
                }
              }}
              onToggleTemplate={(blog) => {
                console.log("Toggle template:", blog.id);
              }}
              onPublish={(blog) => {
                console.log("Publish blog:", blog.id);
              }}
              onUnpublish={(blog) => {
                console.log("Unpublish blog:", blog.id);
              }}
            />
          ))}
          {data?.total === 0 && !loading && <NoResultMessage />}
        </div>
      )}
    </div>
  );
};

export default BlogManagementPage;
