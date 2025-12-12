"use client";

import { API_CREATE_BLOG, API_UPDATE_BLOG } from "@/api/blog";
import { moveBlockFromPathToPath } from "@/components/blog/helper";
import { ErrorField } from "@/types";
import {
  AddBlockProps,
  Block,
  BlogType,
  BreakPoints,
  DraggedBlock,
  DropZoneData,
  FormItem,
  ResponsiveStyle,
  ToolBarTabs,
} from "@/types/blog";
import { generateId } from "@/util";
import {
  addItem,
  cloneBlock,
  deleteItem,
  duplicateItem,
  findItemById,
  getBlockByPath,
  getParentPath,
  mergeObjects,
  updateItem,
} from "@/util/blog";
import debounce from "lodash.debounce";
import { create } from "zustand";

const ACCEPTS: Block["type"][] = [
  "h1",
  "h2",
  "h3",
  "text",
  "paragraph",
  "image",
  "button",
  "html",
  "divider",
  "container",
  "quote",
  "code",
  "video",
  "form",
];

// 🧠 Core Interface: BlogStore
interface BlogStore {
  // =====================
  // 🔧 Configuration & State
  // =====================
  settings: Partial<BlogType>; // Blog-level settings/configuration
  forms: FormItem[]; // List of form items in the blog
  selectedFormId: string | null; // Currently selected form ID
  selectedBlockId: string | null; // Currently selected block ID
  errors: ErrorField[]; // Validation or editor errors
  inPreview: boolean; // Whether preview mode is active
  activeTab: ToolBarTabs; // Currently active toolbar tab
  isDirty: boolean; // Indicates unsaved changes
  isMounted: boolean; // Indicates unsaved changes
  currentBreakpoint: BreakPoints; // Current responsive breakpoint

  isSaving: boolean; // Indicates if the blog is being saved
  lastSaved: Date | null; // Timestamp of the last save
  draftSaveRetryCount: number; // Number of times the draft has been saved
  // =====================
  // 📋 Block Content Management
  // =====================
  blocks: Block[]; // List of blocks in the blog
  copiedBlockId: string | null; // ID of block copied
  cutBlockId: string | null; // ID of block cut

  // =====================
  // 🕹️ Editor Actions - Block Controls
  // =====================
  setBlocks: (blocks: Block[]) => void;
  selectBlock: (id: string | null) => void;
  addBlock: (props: AddBlockProps) => void;
  copyBlock: (id: string) => void;
  cutBlock: (id: string) => void;
  pasteBlock: () => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (from: string, to: string) => void;
  handleDrop: (dropZone: DropZoneData, draggableBlock: DraggedBlock) => void;

  // =====================
  // 🧱 Block Content & Style Update
  // =====================
  updateBlock: (data: Partial<Block>, blockId?: string) => void;
  updateBlockStyle: (
    category: keyof Block["styles"],
    property: string,
    value: ResponsiveStyle,
  ) => void;
  updateBlockContent: (
    fieldName: string,
    value: string | boolean | FileWithPreview[],
  ) => void;
  // =====================
  // Setting Update
  // =====================
  updateSettings: (settings: Partial<BlogType>) => void;

  // =====================
  // 🧩 Form Management
  // =====================
  selectForm: (id: string | null) => void;
  addForm: () => void;
  removeForm: (id: string) => void;
  updateForm: (form: Partial<FormItem>) => void;

  // =====================
  // 📺 Preview & View Settings
  // =====================
  togglePreview: () => void;
  setBreakpoint: (breakpoint: BreakPoints) => void;

  // =====================
  // ♻️ State Setters
  // =====================
  setSettings: (settings: BlogType) => void;
  setErrors: (errors: ErrorField[]) => void;
  setActiveTab: (tab: ToolBarTabs) => void;
  setIsDirty: (dirty: boolean) => void;

  // =====================
  // 🎯 Getters
  // =====================
  getActiveBlock: () => Block | null;
  getActiveForm: () => FormItem | null;

  // =====================
  // ⏪ Undo/Redo Functionality
  // =====================
  history: Block[][]; // History of block states
  historyIndex: number; // Current position in history
  canUndo: () => boolean; // Whether undo is available
  canRedo: () => boolean; // Whether redo is available
  undo: () => void;
  redo: () => void;
  saveDraft: () => void;
  initiatePage: (blog?: BlogType) => void;
  resetStore: () => void;
}

const MAX_RETRIES = 3;

let debouncedSaveHistory: ReturnType<typeof debounce>;

export const useBlogStore = create<BlogStore>((set, get) => {
  debouncedSaveHistory = debounce(() => {
    const state = get();
    const snapshot = JSON.parse(JSON.stringify(state.blocks));

    // Avoid pushing duplicate history entries
    const last = state.history[state.historyIndex];
    const isSame = JSON.stringify(last) === JSON.stringify(snapshot);
    if (isSame) return;

    set({
      history: [...state.history.slice(0, state.historyIndex + 1), snapshot],
      historyIndex: state.historyIndex + 1,
    });
  }, 500);
  return {
    settings: {} as BlogType,
    forms: [],
    selectedFormId: null,
    errors: [],
    inPreview: false,
    activeTab: "blocks",
    isDirty: false,
    isMounted: false,
    isSaving: false,
    lastSaved: null,
    draftSaveRetryCount: 0,
    copiedBlockId: null,
    cutBlockId: null,

    blocks: [],
    selectedBlockId: null,
    currentBreakpoint: "md",

    history: [[]],
    historyIndex: 0,

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    resetStore: () =>
      set({
        settings: {} as BlogType,
        forms: [],
        selectedFormId: null,
        errors: [],
        inPreview: false,
        activeTab: "blocks",
        isDirty: false,
        isMounted: false,
        isSaving: false,
        lastSaved: null,
        draftSaveRetryCount: 0,
        copiedBlockId: null,
        cutBlockId: null,

        blocks: [],
        selectedBlockId: null,
        currentBreakpoint: "md",

        history: [[]],
        historyIndex: 0,
      }),

    setSettings: (settings) => set({ settings, isDirty: true }),
    updateSettings: (settings) =>
      set((state) => ({
        settings: { ...state.settings, ...settings },
        isDirty: true,
      })),
    setErrors: (errors) => set({ errors }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setIsDirty: (isDirty) => set({ isDirty }),

    setBlocks: (blocks) => set({ blocks, isDirty: true }),
    selectBlock: (id) =>
      set({
        selectedBlockId: id,
        activeTab: id
          ? get().activeTab === "blocks"
            ? "styles"
            : get().activeTab
          : "blocks",
      }),

    getActiveBlock: () => findItemById(get().blocks, get().selectedBlockId),

    getActiveForm: () => {
      const formId = get().selectedFormId;
      const form = get().forms.find((f) => f.id === formId);
      return form ? form : null;
    },

    addBlock: ({ type, data, path, disableOverride }) => {
      const selectedBlockId = get().selectedBlockId;
      const blocks = get().blocks;
      const selectedBlock = findItemById(blocks, selectedBlockId);
      const id = generateId();
      const blockProps = cloneBlock(data || {});
      const { styles, ...resProps } = blockProps || { styles: {} };
      const parentId = path
        ? null
        : selectedBlock?.allowNesting
          ? selectedBlock?.id
          : selectedBlock?.parentId || null;
      const overrides = disableOverride
        ? {}
        : path
          ? getBlockByPath(blocks, getParentPath(path) || "")
              ?.childrenBaseStyles
          : findItemById(blocks, parentId)?.childrenBaseStyles;

      const newBlock: Block = {
        type,
        blocks: [],
        content: "",
        ...resProps,
        styles: mergeObjects(styles || {}, overrides || {}),
        level: 1,
        parentId,
        id,
      };
      addItem(blocks, newBlock, parentId, path);
      set({
        blocks,
        selectedBlockId: id,
        activeTab: id ? "styles" : "blocks",
        history: [...get().history.slice(0, get().historyIndex + 1), blocks],
        historyIndex: get().historyIndex + 1,
        isDirty: true,
      });
    },

    removeBlock: (id) => {
      const blocks = get().blocks;
      deleteItem(blocks, id);
      set({
        blocks,
        history: [...get().history.slice(0, get().historyIndex + 1), blocks],
        historyIndex: get().historyIndex + 1,
        isDirty: true,
      });
    },

    duplicateBlock: (id) => {
      const blocks = get().blocks;
      const newBlock = duplicateItem(blocks, id);
      if (!newBlock) return;
      set({
        blocks,
        selectedBlockId: newBlock?.id,
        activeTab: newBlock?.id ? "styles" : "blocks",
        history: [...get().history.slice(0, get().historyIndex + 1), blocks],
        historyIndex: get().historyIndex + 1,
        isDirty: true,
      });
    },
    moveBlock: (from, to) => {
      const updated = moveBlockFromPathToPath(get().blocks, from, to);
      if (!updated) return;
      set({
        blocks: updated,
        history: [...get().history.slice(0, get().historyIndex + 1), updated],
        historyIndex: get().historyIndex + 1,
        isDirty: true,
      });
    },

    copyBlock: (id) => {
      const block = findItemById(get().blocks, id);
      if (!block) return;
      navigator.clipboard.writeText(JSON.stringify(block));
      set({ copiedBlockId: id, cutBlockId: null });
    },
    cutBlock: (id) => {
      const block = findItemById(get().blocks, id);
      if (!block) return;
      navigator.clipboard.writeText(JSON.stringify(block));
      set({ cutBlockId: id, copiedBlockId: null, isDirty: true });
    },
    pasteBlock: () => {
      const blocks = get().blocks;
      const blockId = get().cutBlockId || get().copiedBlockId;
      const isCut = !!get().cutBlockId;
      const block = findItemById(blocks, blockId);
      if (!block) {
        navigator.clipboard.readText().then((text) => {
          const block = JSON.parse(text);
          if (!block || !block.type || !ACCEPTS.includes(block.type)) return;
          get().addBlock({
            type: block.type,
            data: block,
            disableOverride: true,
          });
        });
        return;
      }
      const newBlock = cloneBlock(block);
      get().addBlock({
        type: newBlock.type,
        data: newBlock,
        disableOverride: true,
      }); ///
      if (isCut) {
        set({ cutBlockId: null });
      }
    },

    updateBlock: (data, blockId) => {
      const state = get();
      const id = blockId || state.selectedBlockId;
      if (!id) return;

      const cloned = JSON.parse(JSON.stringify(state.blocks));
      updateItem(cloned, id, data);

      set({ blocks: cloned, isDirty: true });
      debouncedSaveHistory(); // Trigger history save in debounce
    },
    updateBlockStyle: (category, property, value) => {
      const activeBlock = get().getActiveBlock();
      if (!activeBlock) return;
      const styles: Block["styles"] = {
        ...activeBlock?.styles,
        [category]: {
          ...activeBlock?.styles[category],
          [property]: value,
        },
      };
      get().updateBlock({
        styles: { ...activeBlock?.styles, ...styles },
      });
    },
    updateBlockContent: (fieldName, value) => {
      const activeBlock = get().getActiveBlock();
      if (!activeBlock) return;
      if (typeof value === "string") {
        get().updateBlock({ [fieldName]: value });
      } else if (fieldName === "imageUrl" && Array.isArray(value)) {
        const image = value as FileWithPreview[];
        get().updateBlock({ imageUrl: image[0].preview });
      } else {
        get().updateBlock({ [fieldName]: value });
      }
    },
    handleDrop: (dropZone, draggableBlock) => {
      if (!draggableBlock.path) {
        get().addBlock({
          type: draggableBlock.type,
          data: draggableBlock as Block,
          path: dropZone.path,
        });
        return;
      }
      get().moveBlock(draggableBlock.path, dropZone.path);
    },

    setBreakpoint: (breakpoint) => set({ currentBreakpoint: breakpoint }),

    selectForm: (id) =>
      set({ selectedFormId: id, activeTab: id ? "forms" : "blocks" }),

    addForm: () => {
      // TODO: Avoid duplicate form names
      const newForm: FormItem = {
        id: generateId(),
        name: "New Form",
        fields: [
          {
            id: "name",
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            id: "email",
            name: "email",
            label: "Email",
            type: "email",
            required: true,
          },
        ],
      };
      set((state) => ({
        selectedFormId: newForm.id,
        activeTab: "forms",
        forms: [...state.forms, newForm],
        isDirty: true,
      }));
    },

    removeForm: (id) => {
      set((state) => ({
        forms: state.forms.filter((f) => f.id !== id),
        selectedFormId:
          state.selectedFormId === id ? null : state.selectedFormId,
        blocks: state.blocks.map((b) => {
          if (b.formId === id) {
            return { ...b, formId: "" };
          }
          return b;
        }),
        isDirty: true,
      }));
    },

    updateForm: (form) => {
      set((state) => ({
        forms: state.forms.map((f) =>
          f.id === form.id ? { ...f, ...form } : f,
        ),
        isDirty: true,
      }));
    },

    togglePreview: () => set((state) => ({ inPreview: !state.inPreview })),

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({
          blocks: JSON.parse(JSON.stringify(history[newIndex])),
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        set({
          blocks: JSON.parse(JSON.stringify(history[newIndex])),
          historyIndex: newIndex,
        });
      }
    },

    initiatePage: (blog) => {
      const { isMounted } = get();

      if (isMounted) return; // ✅ run only once (if already initialized, skip)
      if (blog) {
        const { content, ...settings } = blog;
        set({
          settings: settings,
          forms: content.forms || [],
          blocks: content.blocks || [],
          isMounted: true,
        });
      } else {
        const token = generateId();
        const newSettings = {
          name: "Untitled Blog" + token,
          title: "Untitled Blog",
          categoryId: "92601b62-7cb8-4db8-bb86-b2a974200f36",
          authorId: "b6cb0d3c-2abf-4db3-a0f0-ff12f0007474",
          description: "untitled blog description",
          slug: "untitled-blog" + token,
          keywords: "untitled blog, untitled blog description",
        } as BlogType;
        set({ settings: newSettings, isMounted: true });
      }
    },

    saveDraft: async () => {
      const { settings, blocks, forms, draftSaveRetryCount } = get();
      const blog: Partial<BlogType> = {
        ...settings,
        content: {
          blocks,
          forms,
        },
        isDraft: true,
      };

      if (draftSaveRetryCount >= MAX_RETRIES) {
        console.warn("Max auto-save retries reached. Auto-save paused.");
        return;
      }

      set({ isSaving: true });

      try {
        if (blog.id) {
          // Update existing draft
          await fetch(API_UPDATE_BLOG, {
            method: "PATCH",
            body: JSON.stringify(blog),
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // Create new page
          const res = await fetch(API_CREATE_BLOG, {
            method: "POST",
            body: JSON.stringify(blog),
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) {
            throw new Error("Failed to update draft");
          }
          const newBlog = await res.json();
          if (!newBlog.id) {
            throw new Error("Failed to create draft");
          }
          set({ settings: { ...settings, id: newBlog.id } });
          window.history.replaceState(
            null,
            "",
            `/admin/blog/edit/${newBlog?.id}`,
          );
        }
        set({ isDirty: false, lastSaved: new Date(), draftSaveRetryCount: 0 });
      } catch (e) {
        console.error("Failed to save draft", e);
        set({ draftSaveRetryCount: draftSaveRetryCount + 1 });
      } finally {
        set({ isSaving: false });
      }
    },
  };
});
