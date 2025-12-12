"use client";
import { ValidationRule } from "@/types";
import { BlogType, ToolBarTabs } from "@/types/blog";
import { generateSlug, isFileWithPreview, validateData } from "@/util/forms";
import { Button, CircularProgress, IconButton } from "@mui/material";
import {
  Save,
  Eye,
  Pin,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Settings,
  Download,
  Check,
} from "lucide-react";
import useUpdateApi from "@/hooks/useUpdateApi";
import { generateId, showToast } from "@/util";
import { useAppDispatch } from "@/store/hooks";
import uploadFiles from "@/lib/files/imageUploader";
import { API_CREATE_BLOG } from "@/api/blog";
import { TAGS } from "@/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/lib/blog/blog-store";
import SaveStatusIndicator from "./SaveStatusIndicator";
import debounce from "lodash.debounce";

function exportJSON(data: object, filename: string = "data.json"): void {
  const jsonStr: string = JSON.stringify(data, null, 2);
  const blob: Blob = new Blob([jsonStr], { type: "application/json" });
  const url: string = URL.createObjectURL(blob);

  const link: HTMLAnchorElement = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const rules: ValidationRule[] = [
  {
    field: "name",
    label: "Name",
    tab: "settings",
    regex: /^.{3,50}$/,
    message: "Name must be between 3 and 50 characters.",
  },
  {
    field: "title",
    tab: "settings",
    label: "Title",
    regex: /^.{3,100}$/,
    message: "Title must be between 3 and 100 characters.",
  },
  {
    field: "slug",
    tab: "settings",
    label: "Slug",
    validate: (value) => {
      if (!value) return true; // Skip validation if no slug provided
      return /^[a-z0-9-]{3,100}$/.test(value);
    },
    message:
      "Slug must be between 3 and 100 characters and can only contain lowercase letters, numbers, and hyphens.",
  },
  {
    field: "authorId",
    tab: "settings",
    label: "Author ID",
    regex: /^[a-zA-Z0-9_-]{5,}$/,
    message: "Author ID must be valid.",
  },
  {
    field: "categoryId",
    tab: "settings",
    label: "Category ID",
    regex: /^[a-zA-Z0-9_-]{5,}$/,
    message: "Category ID must be valid.",
  },
  {
    field: "description",
    tab: "settings",
    label: "Description",
    regex: /^.{10,500}$/,
    message: "Description must be at least 10 characters.",
  },
  {
    field: "photo",
    tab: "settings",
    label: "Photos",
    message: "The Photo of the blog is required ",
    validate: (files) => {
      // Handle string (URL) case
      if (typeof files === "string") {
        return files.trim().length > 0;
      }

      // Handle array case
      if (!Array.isArray(files) || files.length === 0) return false;

      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      return files.every((file) => {
        // Handle File objects
        if (file instanceof File) {
          return validTypes.includes(file.type) && file.size <= maxSize;
        }

        // Handle objects with preview (FileWithPreview)
        if (file && typeof file === "object" && "preview" in file) {
          return true; // Assume valid if it has a preview
        }

        return false;
      });
    },
  },
  {
    field: "keywords",
    tab: "settings",
    label: "Keywords",
    message:
      "Keywords must be an array of up to 10 non-empty words (each under 40 characters).",
    validate: (keywords) => {
      if (
        !Array.isArray(keywords) ||
        keywords.length === 0 ||
        keywords.length > 10
      )
        return false;

      return keywords.every(
        (word) =>
          typeof word === "string" &&
          word.trim().length > 0 &&
          word.length <= 40,
      );
    },
  },
  {
    field: "content.blocks",
    tab: "blocks",
    label: "Blocks",
    validate: (blocks) => Array.isArray(blocks) && blocks.length >= 2,
    message: "You can't post the Article with less than 2 blocks.",
  },
];

const breakpoints = [
  { key: "md" as const, icon: Monitor, label: "Desktop" },
  { key: "sm" as const, icon: Tablet, label: "Tablet" },
  { key: "xs" as const, icon: Smartphone, label: "Mobile" },
];

export default function EditorHeader() {
  const {
    blocks,
    settings,
    forms,
    togglePreview,
    setErrors,
    setActiveTab,
    inPreview,
    currentBreakpoint,
    setBreakpoint,
    canUndo,
    history,
    canRedo,
    undo,
    redo,
    isDirty,
    saveDraft,
    initiatePage,
    historyIndex,
  } = useBlogStore();

  const blog: Partial<BlogType> = useMemo(() => {
    return {
      ...settings,
      content: { blocks, forms },
    };
  }, [settings, blocks, forms]);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { update } = useUpdateApi<BlogType>();
  const [isLoading, setIsLoading] = useState(false);

  const publish = async () => {
    const isValid = validateData(blog, rules);
    if (isValid === true) {
      setErrors([]);
      setIsLoading(true);
      try {
        // First upload the photo if it exists
        let photoUrl = blog.photo;
        if (blog?.photo && isFileWithPreview(blog?.photo[0])) {
          const uploadedUrls = await uploadFiles(
            blog.photo as unknown as File[],
          );
          if (uploadedUrls.length > 0) {
            photoUrl = uploadedUrls[0];
          } else {
            showToast(dispatch, "Failed to upload photo", { type: "error" });
            return;
          }
        }

        const keyWords = Array.isArray(blog.keywords)
          ? blog.keywords.join(",")
          : blog.keywords;
        // Prepare the blog data with the uploaded photo URL
        const backUpSlug = blog?.title
          ? generateSlug(blog?.title)
          : "untitled-blog" + generateId();
        const blogData = {
          ...blog,
          photo: photoUrl,
          slug: blog.slug || backUpSlug,
          keywords: keyWords,
          isActive: true,
          isDraft: false,
          isTemplate: false,
          content: {
            ...blog.content,
            photo: photoUrl,
            blocks,
          },
        } as BlogType;

        if (blog.id) {
          const updatedBlog = await update(
            API_CREATE_BLOG,
            { body: blogData },
            TAGS.blogs,
            {
              error: {
                title: "Failed to update blog",
                description: "Please try again.",
              },
              success: {
                title: "Blog Updated Successfully",
                description: "Your blog has been updated successfully.",
              },
            },
          );
        } else {
          const newBlog = await update(
            API_CREATE_BLOG,
            { method: "POST", body: blogData },
            TAGS.blogs,
            {
              error: {
                title: "Failed to create blog",
                description: "Please try again.",
              },
              success: {
                title: "Blog Created Successfully",
                description: "Your blog has been created successfully.",
              },
            },
          );
          router.replace(`/admin/blog/edit/${newBlog?.id}`);
        }
        // setIsDirty(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create blog";
        showToast(dispatch, errorMessage, { type: "error" });
      } finally {
        setIsLoading(false);
      }
    } else if (Array.isArray(isValid) && isValid.length > 0) {
      const errorTab = isValid[0].tab;
      if (errorTab) {
        setActiveTab(errorTab as ToolBarTabs);
      }
      showToast(dispatch, "Update failed", {
        type: "error",
        title: isValid[0]?.message,
      });
      setErrors(isValid);
    }
  };

  const debouncedSave = debounce(() => {
    if (isDirty) saveDraft();
  }, 4000); // 2 seconds

  useEffect(() => {
    if (isDirty) debouncedSave();
    return debouncedSave.cancel;
  }, [blog, debouncedSave, isDirty, initiatePage]);

  return (
    <div className="fixed top-0 z-50 flex h-[50px] w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        {/* Breakpoint Controls */}
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
          {breakpoints.map(({ key, icon: Icon, label }) => (
            <IconButton
              key={key}
              onClick={() => setBreakpoint(key)}
              className={`h-8 ${currentBreakpoint === key ? "bg-primary text-white" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </IconButton>
          ))}
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <IconButton onClick={undo} disabled={!canUndo()}>
            <Undo className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={redo} disabled={!canRedo()}>
            <Redo className="h-4 w-4" />
          </IconButton>
        </div>
        <SaveStatusIndicator />
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={togglePreview}
          variant="text"
          size="small"
          className={`${inPreview ? "text-primary" : ""}`}
        >
          {inPreview ? (
            <Pin className="mr-2 h-4 w-4" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          {inPreview ? "Edit" : "Preview"}
        </Button>
        <Button
          onClick={() => exportJSON(blocks)}
          variant="outlined"
          size="small"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button
          size="small"
          variant="contained"
          // onClick={onPublish}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}
