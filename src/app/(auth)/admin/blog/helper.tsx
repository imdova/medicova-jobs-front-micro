import Avatar from "@/components/UI/Avatar";
import { ColumnConfig, FieldConfig } from "@/types";
import { Author, BlogType, Category } from "@/types/blog";
import { Button, ListItemIcon, Tooltip } from "@mui/material";
import { Copy, Edit, Eye, FileEdit, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";

export const getDefaultBlogData = (blog?: BlogType | null): BlogType => ({
  id: blog?.id || "",
  name: blog?.name || "",
  title: blog?.title || "",
  authorId: blog?.authorId || blog?.author?.id || "",
  categoryId: blog?.categoryId || blog?.category?.id || "",
  description: blog?.description || "",
  slug: blog?.slug || "",
  photo: blog?.photo || blog?.content.photo || "",
  keywords: blog?.keywords || "",
  isTemplate: blog?.isTemplate || false,
  isActive: blog?.isActive || false,
  isDraft: blog?.isDraft || true,
  views: blog?.views || 0,
  content: {
    metaData: blog?.content.metaData || {},
    blocks: blog?.content.blocks || [],
    forms: blog?.content.forms || [],
  },
  author: blog?.author,
  category: blog?.category,
});

export const columns: ColumnConfig<BlogType>[] = [
  {
    key: "title" as const,
    header: "Title",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={item.content?.photo}
          size={45}
          alt="image"
          shape="square"
        />
        <div>
          <Tooltip title={item.name}>
            <Link
              className="transition hover:text-primary"
              href={`/blogs/${item?.id}`}
            >
              <h6 className="line-clamp-1 text-sm">{item.name}</h6>
            </Link>
          </Tooltip>
        </div>
      </div>
    ),
  },
  {
    header: "Category",
    sortable: true,
    render: ({ category }) => category?.name,
  },
  {
    header: "Author",
    render: ({ author }) => (
      <div className="flex items-center gap-3">
        <Avatar src={author?.photo} alt={author?.name} size={35} />
        <div>
          <div className="font-medium text-gray-900">{author?.name}</div>
          <div className="text-sm text-gray-500">{author?.email}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    sortable: true,
    render: (blog) => {
      let status = "Draft";
      let statusClass = "bg-gray-100 text-gray-800";

      if (blog.isActive) {
        status = "Published";
        statusClass = "bg-green-100 text-green-800";
      } else if (!blog.isDraft) {
        status = "Archived";
        statusClass = "bg-yellow-100 text-yellow-800";
      }

      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    key: "created_at" as const,
    header: "Created Date",
    sortable: true,
    render: (blog) => new Date(blog.created_at || "").toLocaleDateString(),
  },
];

export const getFields = ({
  authors,
  categories,
}: {
  authors: Author[];
  categories: Category[];
}): FieldConfig[] => [
    {
      name: "name",
      label: "Blog Name",
      type: "text",
      gridProps: { sm: 8, rowXs: 1, rowMd: 1 },
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog name",
      },
    },
    {
      name: "photo",
      label: "Article Photo",
      type: "upload-area",
      fileProps: {
        previewType: "image",
        maxFiles: 1,
        maxSize: 1,
      },
      gridProps: { sm: 4, rowXs: 1, rowSm: 3 },
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog name",
      },
    },
    {
      name: "title",
      label: "Blog Title",
      type: "text",
      gridProps: { sm: 8 },
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog title",
      },
    },
    {
      name: "slug",
      label: "Blog slug",
      gridProps: { sm: 8 },
      type: "text",
      textFieldProps: {
        placeholder: "Enter your blog Slug",
      },
    },
    {
      name: "description",
      label: "Blog Description",
      gridProps: { sm: 8 },
      type: "textArea",
    },
    {
      name: "authorId",
      label: "Author",
      type: "select",
      gridProps: { sm: 4 },
      textFieldProps: {
        sx: {
          border: "none",
          minHeight: "60px",
          "& .MuiSelect-select": {
            border: "none",
            minHeight: "60px",
          },
        },
      },
      options: authors.map((author) => ({
        label: (
          <div className="flex h-full items-center gap-3">
            <Avatar src={author.photo} alt={author.name} size={40} />
            <div>
              <div className="font-medium text-gray-900">{author.name}</div>
              <div className="text-sm text-gray-500">{author.email}</div>
            </div>
          </div>
        ),
        value: author.id,
      })),
      required: true,
    },
    {
      name: "keywords",
      label: "Keywords",
      type: "multi-text",
      gridProps: { sm: 8 },
      textFieldProps: {
        placeholder: "Enter keywords separated by commas",
      },
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      gridProps: { sm: 4 },
      options: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
      required: true,
    },
  ];

export type ActionType =
  | "quick-update"
  | "toggle-template"
  | "status-change"
  | "delete";

export const getOptions = (
  action?: ({ type, data }: { type: ActionType; data: BlogType }) => void,
): ActionOption<BlogType>[] => [
    {
      label: (item) => (
        <Link href={`/blogs/${item?.id}`} className="w-full">
          <ListItemIcon>
            <Eye className="h-4 w-4" />
          </ListItemIcon>
          View
        </Link>
      ),
    },
    {
      label: (item) => (
        <Link href={`/admin/blog/new?duplicate=${item?.id}`} className="w-full">
          <ListItemIcon>
            <Copy className="h-4 w-4" />
          </ListItemIcon>
          Duplicate
        </Link>
      ),
    },
    {
      label: (item) => (
        <Link href={`/admin/blog/edit/${item?.id}`} className="w-full">
          <ListItemIcon>
            <FileEdit className="h-4 w-4" />
          </ListItemIcon>
          Edit
        </Link>
      ),
    },
    {
      label: "Quick Edit",
      icon: <Edit className="h-4 w-4" />,
      action: (item?: BlogType) =>
        item &&
        action?.({
          type: "quick-update",
          data: item,
        }),
    },
    {
      label: (item?: BlogType) =>
        item?.isTemplate ? "Remove from Templates" : "Mark as Template",
      icon: <Star className="h-4 w-4" />,
      action: (item?: BlogType) =>
        item &&
        action?.({
          type: "toggle-template",
          data: item,
        }),
    },
    {
      label: (item?: BlogType) => (item?.isDraft ? "Publish" : "Move to Draft"),
      icon: <Eye className="h-4 w-4" />,
      action: (item?: BlogType) =>
        item &&
        action?.({
          type: "status-change",
          data: item,
        }),
    },
    {
      label: <span className="text-red-500">Delete</span>,
      action: (item?: BlogType) =>
        item &&
        action?.({
          type: "delete",
          data: item,
        }),
      icon: <Trash2 size={15} className="text-red-500" />,
    },
  ];

export const NoResultMessage = () => (
  <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
    <h3 className="text-xl font-semibold text-gray-900">No blogs found</h3>
    <p className="mt-2 text-sm text-gray-600">
      Get started by creating your first blog post
    </p>
    <Button
      component={Link}
      href="/admin/blog/new"
      variant="contained"
      className="mt-4"
      startIcon={<Plus className="h-5 w-5" />}
    >
      Create New Blog
    </Button>
  </div>
);
