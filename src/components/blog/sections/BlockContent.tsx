import { UploadAreaField } from "@/components/form/FormModal/fields/upload-area-field";
import { useBlogStore } from "@/lib/blog/blog-store";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import vkbeautify from "vkbeautify";
import { Selector } from "../Selector";
import TextEditor from "@/components/editor/editor";
import { TextareaAutosize } from "@mui/material";
import { Option } from "@/types";
import { findItemsByType } from "@/util/blog";
import { Plus } from "lucide-react";

const BlockContent: React.FC = () => {
  const {
    getActiveBlock,
    updateBlockContent,
    forms,
    addForm,
    blocks,
    selectForm,
    selectBlock,
  } = useBlogStore();
  const block = getActiveBlock();

  const formatCode = () => {
    const formatted = vkbeautify.xml(block?.content || "");
    updateBlockContent("content", formatted);
  };

  const formsBlockOptions: Option[] = findItemsByType(blocks, "form").map(
    (block) => ({
      value: block.id || "",
      label: block.formData?.name || block.id || "",
    }),
  );
  const formsModalOptions: Option[] = forms.map((form) => ({
    value: form.id || "",
    label: form.name || "",
  }));

  const renderField = () => {
    if (
      block?.type &&
      ["code", "quote", "text", "h1", "h2", "h3"].includes(block?.type)
    )
      return (
        <div className="space-y-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Content </label>
            <TextareaAutosize
              name="Description"
              minRows={3}
              value={block?.content}
              onChange={(e) => updateBlockContent("content", e.target.value)}
              placeholder="Description of form"
              className="min-h-[33px] w-full rounded-[4px] border p-2 text-sm focus:outline-none"
            />
          </div>
        </div>
      );
    if (block?.type === "video")
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Video URL </label>
            <input
              name="Video URL "
              type="text"
              placeholder="Enter Video URL (Youtube or Vimeo)"
              value={block?.videoUrl}
              onChange={(e) => updateBlockContent("videoUrl", e.target.value)}
              className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Video Thumbnail </label>
            <input
              name="Video Thumbnail"
              type="text"
              placeholder="Enter Video Thumbnail (Youtube or Vimeo)"
              value={block?.videoThumbnail}
              onChange={(e) =>
                updateBlockContent("videoThumbnail", e.target.value)
              }
              className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
            />
          </div>
          <UploadAreaField
            field={{
              name: "backgroundImage",
              type: "text",
              fileProps: {
                acceptedFileTypes: ["image/jpeg", "image/png"],
                maxFiles: 1,
                maxSize: 5,
                previewType: "image",
                urlField: true,
                autoUpload: true,
              },
            }}
            controllerField={{
              value: String(block?.videoThumbnail),
              onChange: (value) => updateBlockContent("videoThumbnail", value),
            }}
          />
        </div>
      );
    if (block?.type === "image")
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Image Url </label>
            <input
              name="imageUrl"
              type="text"
              placeholder="Enter Image Url"
              value={block?.imageUrl}
              onChange={(e) => updateBlockContent("imageUrl", e.target.value)}
              className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
            />
          </div>
          <UploadAreaField
            field={{
              name: "imageUrl",
              type: "text",
              fileProps: {
                acceptedFileTypes: ["image/jpeg", "image/png"],
                maxFiles: 1,
                maxSize: 5,
                previewType: "image",
                urlField: true,
                autoUpload: true,
              },
            }}
            controllerField={{
              value: String(block?.imageUrl),
              onChange: (value) => updateBlockContent("imageUrl", value),
            }}
          />
        </div>
      );
    if (block?.type === "html")
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">HTML Code </label>
            <button
              onClick={formatCode}
              className="rounded border border-gray-200 bg-gray-100 px-4 py-2 text-xs"
            >
              Format Code
            </button>
          </div>
          <CodeMirror
            value={block.content}
            extensions={[html()]}
            onChange={(value) => updateBlockContent("content", value)}
            minHeight="200px"
            basicSetup={{
              lineNumbers: false,
            }}
          />
        </div>
      );
    if (block?.type === "button")
      return (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Button Text </label>
          <TextareaAutosize
            name="content"
            minRows={1}
            value={block?.content}
            onChange={(e) => updateBlockContent("content", e.target.value)}
            placeholder="Description of form"
            className="min-h-[33px] w-full rounded-[4px] border p-2 text-sm focus:outline-none"
          />
          <Selector
            label="Button Type"
            value={block?.buttonType}
            placeholder="Select Button Type"
            onChange={(value) => {
              if (value === "submit") {
                const formId = formsBlockOptions[0]?.value || "";
                updateBlockContent("formId", formId);
              }
              if (value === "modal") {
                const formId = formsModalOptions[0]?.value || "";
                updateBlockContent("formId", formId);
              }
              updateBlockContent("buttonType", value as string);
            }}
            options={["submit", "link", "modal"].map((form) => ({
              value: form,
              label: form,
            }))}
          />
          {block?.buttonType === "link" && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Link </label>
              <input
                name="linkUrl"
                type="text"
                value={block?.linkUrl}
                onChange={(e) => updateBlockContent("linkUrl", e.target.value)}
                placeholder="Link"
                className="h-[33px] w-1/2 rounded-[4px] border px-2 text-xs focus:outline-none"
              />
            </div>
          )}

          {block?.buttonType === "modal" && (
            <>
              <Selector
                label="Form Id"
                value={block?.formId}
                placeholder="Select Form or Create New Form"
                onChange={(value) => {
                  if (value === "create") {
                    addForm();
                  } else {
                    updateBlockContent("formId", value as string);
                  }
                }}
                options={[
                  ...formsModalOptions,
                  {
                    value: "create",
                    label: "Create New Form",
                    icon: <Plus className="mr-2 h-4 w-4" />,
                  },
                ]}
              />
              {block?.formId && (
                <button
                  onClick={() => {
                    if (block.formId) selectForm(block.formId);
                  }}
                  className="rounded border border-gray-200 bg-gray-100 px-4 py-2 text-xs"
                >
                  Open Form Modal
                </button>
              )}
            </>
          )}
          {block?.buttonType === "submit" && (
            <>
              <Selector
                label="Form Name"
                value={block?.formId}
                placeholder="Select Form Name"
                onChange={(value) =>
                  updateBlockContent("formId", value as string)
                }
                options={formsBlockOptions}
              />
              {block?.formId && (
                <button
                  onClick={() => {
                    if (block.formId) selectBlock(block.formId);
                  }}
                  className="rounded border border-gray-200 bg-gray-100 px-4 py-2 text-xs"
                >
                  Select Form Element
                </button>
              )}
            </>
          )}
        </div>
      );
    if (block?.type === "paragraph")
      return (
        <div className="space-y-2">
          <TextEditor
            value={block?.content}
            onChange={(e) => updateBlockContent("content", e.target.value)}
            className="max-h-[calc(100vh-250px)]"
          />
        </div>
      );
  };

  if (block?.type === "form") return null;

  return (
    <div>
      <h4 className="mb-4 text-center text-xs text-muted-foreground">
        Content Editor{" "}
        <span className="text-xs text-primary">({block?.type})</span>{" "}
      </h4>
      {renderField()}
    </div>
  );
};

export default BlockContent;
