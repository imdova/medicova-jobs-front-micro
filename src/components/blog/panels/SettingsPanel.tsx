import { FormField } from "@/components/form/FormModal/fields/FormField";
import Avatar from "@/components/UI/Avatar";
import { FieldConfig } from "@/types";
import { Author, Category } from "@/types/blog";
import useFetch from "@/hooks/useFetch";
import { API_GET_BLOG_AUTHORS, API_GET_BLOG_CATEGORIES } from "@/api/blog";
import { useBlogStore } from "@/lib/blog/blog-store";

const SettingsPanel: React.FC = () => {
  const { settings, setSettings, errors } = useBlogStore();

  const { data: categories } = useFetch<PaginatedResponse<Category>>(
    API_GET_BLOG_CATEGORIES,
  );
  const { data: authors } =
    useFetch<PaginatedResponse<Author>>(API_GET_BLOG_AUTHORS);

  const settingsFormFields: FieldConfig[] = [
    {
      name: "photo",
      label: "Article Photo",
      type: "upload-area",
      fileProps: {
        previewType: "image",
        maxFiles: 1,
        maxSize: 1,
        urlField: true,
      },
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog name",
      },
    },
    {
      name: "name",
      label: "Blog Name",
      type: "text",
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog name",
      },
    },
    {
      name: "title",
      label: "Blog Title",
      type: "text",
      required: true,
      textFieldProps: {
        placeholder: "Enter your blog title",
      },
    },
    {
      name: "slug",
      label: "Blog slug",
      type: "text",
      textFieldProps: {
        placeholder: "Enter your blog Slug",
      },
    },
    {
      name: "description",
      label: "Blog Description",
      type: "textArea",
    },
    {
      name: "keywords",
      label: "Keywords",
      type: "multi-text",
      textFieldProps: {
        placeholder: "Enter keywords separated by commas",
      },
    },
    {
      name: "authorId",
      label: "Author",
      type: "select",
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
      options: authors?.data.map((author) => ({
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
      name: "categoryId",
      label: "Category",
      type: "select",
      options: categories?.data.map((category) => ({
        label: category.name,
        value: category.id,
      })),
      required: true,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h6 className="mb-2 text-xl font-semibold">Blog Settings</h6>
        <p className="text-gray-600">
          Customize your blog settings and metadata
        </p>
      </div>
      {settingsFormFields.map((field) => (
        <div
          className={`col-span-${field.gridProps?.xs ?? 12} ${
            field.gridProps?.sm ? `sm:col-span-${field.gridProps?.sm}` : ""
          } ${field.gridProps?.md ? `md:col-span-${field.gridProps?.md}` : ""}`}
          key={String(field.name)}
        >
          <FormField
            field={field}
            data={settings}
            setData={setSettings}
            errors={errors}
          />
        </div>
      ))}
    </div>
  );
};

export default SettingsPanel;
