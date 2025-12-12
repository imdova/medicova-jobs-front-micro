import { ErrorField, FieldConfig, ValidationRule } from "@/types";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const isValidEgyptianPhoneNumber = (phone: string): boolean => {
  const egyptianPhoneRegex = /^(?:\+20|0020)?(10|11|12|15)\d{8}$/;
  return egyptianPhoneRegex.test(phone);
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberObj = parsePhoneNumberFromString(phoneNumber || "");
  if (!phoneNumberObj || !phoneNumberObj.isValid()) {
    return false;
  }
  if (phoneNumberObj.country === "EG") {
    return isValidEgyptianPhoneNumber(phoneNumberObj.number);
  }
  return true;
};

export const isFileWithPreview = (value: any): value is FileWithPreview => {
  return value instanceof File && "preview" in value;
};

export const getDefaultValues = (
  fields: FieldConfig[],
  initialValues: Record<string, any>,
): Record<string, any> => ({
  ...fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: field.type === "checkbox" ? false : "",
    }),
    {},
  ),
  ...initialValues,
});

export function getNestedValue(formValues: object, path: string): any {
  const keys = path.split(".") as string[];
  const value = keys.reduce((current: any, key: string) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, formValues);
  return value;
}

export function getDependsOnLabel(
  dependsOn: FieldConfig | null | undefined,
): string | undefined {
  if (!dependsOn) {
    return undefined;
  }

  if (dependsOn.textFieldProps?.label) {
    return typeof dependsOn.textFieldProps.label === "string"
      ? dependsOn.textFieldProps.label.replace("*", "")
      : undefined;
  }

  if (dependsOn.label) {
    return dependsOn.label.replace("*", "");
  }

  return undefined;
}

export function validateData(
  data: Record<string, any>,
  rules: ValidationRule[],
): true | ErrorField[] {
  const errors: ErrorField[] = [];

  for (const rule of rules) {
    const value = getNestedValue(data, rule.field);
    const isValid =
      rule.validate?.(value) ??
      ((typeof value === "string" || typeof value === "number") &&
        rule.regex?.test(String(value)));

    if (!isValid) {
      errors.push(rule);
    }
  }

  return errors.length === 0 ? true : errors;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces & non-word chars with -
    .replace(/^-+|-+$/g, ""); // Trim - from start and end
}

// Check if value is primitive (null, undefined, string, number, boolean, symbol, bigint)
function isPrimitive(value: unknown): boolean {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  );
}

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    // It's just the same object. No need to compare.
    return true;
  }

  if (isPrimitive(obj1) && isPrimitive(obj2)) {
    // Compare primitives
    return obj1 === obj2;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    // One is primitive, the other is object or null
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // Compare objects with same number of keys
  for (const key of keys1) {
    if (!(key in obj2)) {
      // Other object doesn't have this prop
      return false;
    }
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function toStringArray(data: any): string[] {
  if (data == null) {
    return [];
  }

  if (typeof data === "string") {
    return data.includes(",")
      ? data
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [data.trim()].filter((s) => s.length > 0);
  }

  if (
    typeof data === "number" ||
    typeof data === "boolean" ||
    typeof data === "bigint" ||
    typeof data === "symbol"
  ) {
    return [String(data)];
  }

  if (Array.isArray(data)) {
    return data.map((item) => String(item).trim()).filter((s) => s.length > 0);
  }

  if (typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${String(value).trim()}`)
      .filter((s) => s.length > 0);
  }

  return [];
}

export function validateFieldsFromConfig(
  fields: (FieldConfig & { tab?: string | number })[],
  data: Record<string, any>,
): true | ErrorField[] {
  const rules: ValidationRule[] = [];

  for (const field of fields) {
    const label = field.label || field.name;

    // Required check
    if (field.required) {
      rules.push({
        field: field.name,
        tab: field.tab,
        validate: (val) => val !== undefined && val !== "" && val !== null,
        message: `${label} is required`,
      });
    }

    // Custom validation
    if (field.rules?.validate) {
      rules.push({
        field: field.name,
        tab: field.tab,
        validate: field.rules.validate,
        message: field.rules.message || `${label} is invalid`,
      });
    }

    // Regex rule
    if (field.rules?.regex) {
      rules.push({
        field: field.name,
        tab: field.tab,
        regex: field.rules.regex,
        message: field.rules.message || `${label} format is invalid`,
      });
    }
  }

  return validateData(data, rules);
}

export const findCutIndex = (html: string, limit: number) => {
  if (html.length <= limit) return html.length;
  let cutIndex = limit;

  // Move forward until a whitespace or end of string
  while (cutIndex < html.length && !/\s/.test(html[cutIndex])) {
    cutIndex++;
  }
  return cutIndex;
};
