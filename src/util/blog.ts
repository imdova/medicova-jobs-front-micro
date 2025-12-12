import {
  Block,
  BlockForm,
  BreakPoints,
  StyleConfig,
  Unit,
  ResponsiveStyle,
  ResponsiveValue,
} from "@/types/blog";
import { generateId } from ".";
import { CSSProperties } from "react";

export function findItemById(
  blocks: Block[],
  id?: string | null,
): Block | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.blocks) {
      const found = findItemById(block.blocks, id);
      if (found) return found;
    }
  }
  return null;
}
export function findItemsByType(blocks: Block[], type: Block["type"]): Block[] {
  const results: Block[] = [];

  for (const block of blocks) {
    if (block.type === type) {
      results.push(block);
    }
    if (block.blocks) {
      const found = findItemsByType(block.blocks, type);
      results.push(...found);
    }
  }

  return results;
}

/**
 * Adds a new block to the list of blocks either by a given path or by a parent block ID.
 *
 * - If a `path` is provided, it will insert the new block at the specified index path.
 * - If a `parentId` is provided (and path is not), it will append the new block to the parent's `blocks` array.
 * - If both `parentId` and `path` are null/undefined, it adds the block to the root level.
 *
 * @param blocks - The array of blocks where the new block should be inserted.
 * @param newItem - The new block to insert.
 * @param parentId - (Optional) The ID of the parent block to insert into.
 * @param path - (Optional) A dash-separated path (e.g., "1-0") indicating where to insert the block.
 * @returns True if the insertion was successful, false otherwise.
 */
export function addItem(
  blocks: Block[],
  newItem: Block,
  parentId: string | null = null,
  path?: string,
): boolean {
  // Handle insertion using a path like "1-2" to insert inside nested blocks
  if (path) {
    // Convert path to array of indices
    const indices = path.split("-").map(Number);
    const insertIndex = indices.pop(); // Last number is the insertion point

    if (insertIndex === undefined) return false;

    let currentBlocks = blocks;

    // Traverse through the block tree using indices from the path
    for (const index of indices) {
      const block = currentBlocks[index];
      if (!block || !block.allowNesting) return false; // Block doesn't allow nesting or doesn't exist
      currentBlocks = block.blocks;
    }

    // Validate insert position
    if (
      !currentBlocks ||
      insertIndex < 0 ||
      insertIndex > currentBlocks.length + 1
    )
      return false;

    // Insert the new block at the correct index
    currentBlocks.splice(insertIndex, 0, newItem);
    return true;
  }

  // Handle insertion using a parent block ID
  if (parentId === null) {
    // Insert at root level if no parent ID
    blocks.push(newItem);
    return true;
  }

  // Recursively search for the parent block by ID
  for (const block of blocks) {
    if (block.id === parentId) {
      // If parent found, ensure it has a blocks array, then push the new item
      if (!block.blocks) block.blocks = [];
      block.blocks.push(newItem);
      return true;
    }

    // Recursively search inside child blocks
    if (block.blocks && addItem(block.blocks, newItem, parentId)) return true;
  }

  // No valid insertion point found
  return false;
}

export function updateItem(
  blocks: Block[],
  id: string,
  updatedData: Partial<Block>,
): boolean {
  for (const block of blocks) {
    if (block.id === id) {
      Object.assign(block, updatedData);
      return true;
    }
    if (block.blocks && updateItem(block.blocks, id, updatedData)) return true;
  }
  return false;
}

export function deleteItem(blocks: Block[], id: string): boolean {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === id) {
      blocks.splice(i, 1);
      return true;
    }
    if (block.blocks && deleteItem(block.blocks, id)) return true;
  }
  return false;
}
/**
 * Duplicates a block and its sub-blocks from a given ID, assigning new unique IDs,
 * and inserts it directly after the original block.
 *
 * @param blocks - The root list of blocks to search.
 * @param targetId - The ID of the block to duplicate.
 * @returns The new duplicated block, or null if not found.
 */
export function duplicateItem(blocks: Block[], targetId: string): Block | null {
  if (!Array.isArray(blocks) || !targetId) return null;

  const stack: { parent: Block[]; index: number }[] = [
    { parent: blocks, index: 0 },
  ];

  while (stack.length > 0) {
    const { parent, index } = stack.pop()!;
    for (let i = index; i < parent.length; i++) {
      const item = parent[i];

      if (item.id === targetId) {
        const cloned = structuredClone(item);
        assignNewIds(cloned);
        parent.splice(i + 1, 0, cloned);
        return cloned;
      }

      if (Array.isArray(item.blocks)) {
        stack.push({ parent: item.blocks, index: 0 });
      }
    }
  }

  return null;
}

/**
 * Recursively assigns new unique IDs to the block and all of its sub-blocks.
 *
 * @param block - The block to update.
 */
export function assignNewIds(block: Block): void {
  block.id = generateId();
  if (Array.isArray(block.blocks)) {
    block.blocks.forEach(assignNewIds);
  }
}

/**
 * Creates a deep clone of the given block and all its nested sub-blocks,
 * assigning new unique IDs to each block.
 *
 * @param block - The original block to clone.
 * @returns A new block identical in structure and content, but with new unique IDs.
 */
export function cloneBlock<T extends { id?: string; blocks?: T[] }>(
  block: T,
): T {
  // Deep clone the block to avoid mutating the original
  const clone: T = structuredClone(block);

  /**
   * Recursively assigns new unique IDs to the block and all of its sub-blocks.
   *
   * @param b - The block to update.
   */
  const assignNewIds = (b: T): void => {
    b.id = generateId(); // Assign new unique ID
    if (b.blocks) {
      b.blocks.forEach(assignNewIds); // Recurse through child blocks
    }
  };

  assignNewIds(clone);

  return clone;
}

export const buttonModal: BlockForm = {
  title: "Add Button",
  type: ["button"],
  description: "",
  isModal: true,
  fields: [
    {
      name: "content",
      label: "Enter Your Button labe",
      type: "text",
      textFieldProps: { placeholder: "button Label" },
      required: true,
    },
    // add check box for using link url or form
    {
      name: "isForm",
      label: "Use Form",
      hideFieldNames: ["linkUrl"],
      unHideFieldNames: ["formId"],
      resetFields: ["linkUrl", "formId"],
      type: "checkbox",
    },
    {
      name: "linkUrl",
      label: "Enter Your Link Url",
      type: "text",
      textFieldProps: { placeholder: "Link Url" },
      required: true,
    },
    // {
    //   name: "formId",
    //   label: "Select Form",
    //   type: "select",
    //   options: forms.map((form) => ({ label: form.name, value: form.id })),
    //   required: true,
    // },
  ],
};

const ORDERED_BREAKPOINTS: BreakPoints[] = ["xs", "sm", "md"];

export function resolveValueAtBreakpoint(
  value: ResponsiveValue,
  current: BreakPoints,
): string {
  // Check current breakpoint
  const currentVal = value[current];
  if (currentVal !== undefined && currentVal !== null && currentVal !== "") {
    return currentVal;
  }

  const currentIndex = ORDERED_BREAKPOINTS.indexOf(current);

  // First: check higher breakpoints
  for (let i = currentIndex + 1; i < ORDERED_BREAKPOINTS.length; i++) {
    const val = value[ORDERED_BREAKPOINTS[i]];
    if (val !== undefined && val !== null && val !== "") {
      return val;
    }
  }

  // Then: check lower breakpoints
  for (let i = currentIndex - 1; i >= 0; i--) {
    const val = value[ORDERED_BREAKPOINTS[i]];
    if (val !== undefined && val !== null && val !== "") {
      return val;
    }
  }

  // If nothing found
  return "";
}
export function extractCssFromResponsive(
  styles: Record<string, ResponsiveStyle> | null | undefined,
  breakpoint: BreakPoints = "md",
): Record<string, string> {
  if (!styles) return {};

  const resolved: Record<string, string> = {};

  for (const key in styles) {
    const value = styles[key];
    resolved[key] = getValue(value, breakpoint);
  }

  return resolved;
}

export type FinalStyle = {
  [K in keyof StyleConfig]?: Record<string, string> | null;
};

export function convertResponsiveToCssStyles(
  styles: StyleConfig,
  breakpoint: BreakPoints,
): FinalStyle {
  const result: FinalStyle = {};

  for (const key in styles) {
    const section = styles[key as keyof StyleConfig];
    result[key as keyof StyleConfig] = extractCssFromResponsive(
      section,
      breakpoint,
    );
  }

  return result;
}

export const stringToResponsiveValue = (
  value: string,
  breakpoint: BreakPoints,
  initialValue?: ResponsiveStyle,
): ResponsiveStyle => {
  if (typeof initialValue === "string" && breakpoint !== "md") {
    return {
      md: initialValue,
      [breakpoint]: value,
    };
  } else if (typeof initialValue === "object") {
    return {
      ...initialValue,
      [breakpoint]: value,
    };
  } else {
    return value;
  }
};

export function parseValueUnit(
  input: string,
  defaultUnit?: string,
): { value: number; unit: string } {
  const match = input.trim().match(/^(-?\d*\.?\d+)([a-zA-Z%]+)$/);

  if (!match) return { value: Number(input), unit: defaultUnit || "" };

  const [, value, unit] = match;
  return {
    value: parseFloat(value),
    unit,
  };
}

export function replaceValue(
  template: string,
  value: string | number,
  placeholderRegex = /\[\[value\]\]/g,
): string {
  if (template === "") return String(value);
  return template.replace(placeholderRegex, String(value));
}

export function extractFromPossibleTemplates(
  input: string,
  patterns: string[],
): { value: number; template: string } {
  for (const pattern of patterns) {
    const escapedPattern = pattern.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
    const regexString = escapedPattern.replace("\\[\\[value\\]\\]", "(.+?)");
    const regex = new RegExp(`^${regexString}$`);

    const match = input.match(regex);
    if (match) {
      return {
        value: Number(match[1]),
        template: pattern,
      };
    }
  }

  return { value: Number(input), template: patterns[0] }; // no match found
}

export function extractValueFromTemplate(
  result: string,
  pattern: string,
): number {
  const escapedPattern = pattern.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
  const regexString = escapedPattern.replace("\\[\\[value\\]\\]", "(.+?)");
  const regex = new RegExp(`^${regexString}$`);

  const match = result.match(regex);
  if (!match) return 0;

  return Number(match[1]);
}

export const getValue = (val: ResponsiveStyle, bp: BreakPoints): string => {
  if (typeof val === "string") {
    return val;
  } else if (val && typeof val === "object") {
    return resolveValueAtBreakpoint(val, bp);
  }
  return "";
};

export const getUnit = (
  units: Unit[] | undefined,
  unitValue: string,
): Unit | null => {
  return units?.find((unit) => unit.value === unitValue) || units?.[0] || null;
};

export function getNumberOfColumns(gridTemplate: string): number {
  const match = gridTemplate.match(/^repeat\(\s*(\d+)\s*,/);
  return match ? parseInt(match[1], 10) : 0;
}

export function extractUrl(input: string): string | null {
  const match = input.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : null;
}

export function mergeObjects<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(base: T, overrides: U): T {
  const result: any = { ...base };

  for (const key in overrides) {
    if (
      overrides[key] &&
      typeof overrides[key] === "object" &&
      !Array.isArray(overrides[key]) &&
      typeof base[key] === "object"
    ) {
      result[key] = mergeObjects(base[key], overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }

  return result;
}

export function getBlockByPath(
  blocks: Block[],
  path?: string,
): Block | undefined {
  if (!path) return undefined;
  const indexes = path.split("-").map(Number);
  let current: Block | undefined;

  for (const index of indexes) {
    if (!Array.isArray(blocks) || index >= blocks.length) return undefined;
    current = blocks[index];
    blocks = current.blocks || [];
  }

  return current;
}

export function getParentPath(path: string): string | null {
  const parts = path.split("-");
  if (parts.length <= 1) return null; // No parent (root level)

  parts.pop(); // Remove the last part (current block)
  return parts.join("-");
}

type LayoutItem = {
  width: string;
  height?: string;
  display?: string;
  flexDirection?: CSSProperties["flexDirection"];
  flexWrap?: string;
  items?: LayoutItem[];
};

type LayoutResult = {
  style: {
    display: "flex";
    flexDirection: CSSProperties["flexDirection"];
    flexWrap?: "wrap";
  };
  items: LayoutItem[];
};

function parseFraction(fraction: string): string {
  if (!fraction.includes("/")) return "100%";
  const [num, den] = fraction.split("/").map(Number);
  return `${(num / den) * 100}%`;
}

function parseItem(str: string): LayoutItem {
  if (str.startsWith("(") && str.endsWith(")")) {
    return parseNested(str.slice(1, -1));
  }

  const [widthPart, heightPart] = str.split(",");
  const width = parseFraction(widthPart);
  const height = heightPart ? parseFraction(heightPart) : undefined;

  return { width, ...(height && { height }) };
}

function parseNested(nestedStr: string): LayoutItem {
  const [layoutHeader, ...restParts] = nestedStr.trim().split(" ");
  const headerMatch = layoutHeader.match(/^([a-z]+)(?:,([\d/]+))?$/);

  if (!headerMatch) {
    throw new Error(`Invalid nested layout syntax: ${layoutHeader}`);
  }

  const [, directionRaw, widthRaw] = headerMatch;
  const direction = directionRaw === "col" ? "column" : "row";
  const wrap = layoutHeader.includes(".wrap");

  const width = widthRaw ? parseFraction(widthRaw) : "100%";
  const items = tokenizeItems(restParts.join(" ")).map(parseItem);

  return {
    display: "flex",
    flexDirection: direction,
    ...(wrap ? { flexWrap: "wrap" } : {}),
    width,
    items,
  };
}

function parseDirection(token: string): {
  direction: "row" | "column";
  wrap: boolean;
} {
  const parts = token.split(".");
  const direction = parts[0] === "col" ? "column" : "row";
  const wrap = parts.includes("wrap");
  return { direction, wrap };
}

function tokenizeItems(input: string): string[] {
  const items: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of input) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "|" && depth === 0) {
      items.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) items.push(current.trim());
  return items;
}

export function parseLayout(input: string): LayoutResult {
  const [dirAndFlags, ...restParts] = input.trim().split(" ");
  const { direction, wrap } = parseDirection(dirAndFlags);
  const items = tokenizeItems(restParts.join(" ")).map(parseItem);

  return {
    style: {
      display: "flex",
      flexDirection: direction,
      ...(wrap ? { flexWrap: "wrap" } : {}),
    },
    items,
  };
}
