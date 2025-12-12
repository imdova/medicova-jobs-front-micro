'use client'
import { FieldConfig } from "@/types";
import { useState, useEffect } from "react";

export const useFieldVisibility = (
  fields: FieldConfig[],
  initialValues: Record<string, any>,
  isOpen: boolean,
) => {
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);

  // Initialize hidden fields based on initial checkbox states
  const initializeHiddenFields = (values: Record<string, any>) => {
    const newHiddenFields: string[] = [];
    fields.forEach((field) => {
      if (field.type === "checkbox") {
        const isChecked = values[String(field.name)] ?? false;
        if (isChecked) {
          if (field.hideFieldNames?.length) {
            field.hideFieldNames.forEach((name) => {
              if (!newHiddenFields.includes(String(name))) {
                newHiddenFields.push(String(name));
              }
            });
          }
          if (field.unHideFieldNames?.length) {
            field.unHideFieldNames.forEach((name) => {
              if (newHiddenFields.includes(String(name))) {
                newHiddenFields.splice(
                  newHiddenFields.indexOf(String(name)),
                  1,
                );
              }
            });
          }
        } else {
          if (field.unHideFieldNames?.length) {
            field.unHideFieldNames.forEach((name) => {
              if (!newHiddenFields.includes(String(name))) {
                newHiddenFields.push(String(name));
              }
            });
          }
        }
      }
    });
    return newHiddenFields;
  };

  // Set initial hidden fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setHiddenFields(initializeHiddenFields(initialValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only run when isOpen changes

  const reset = () => {
    setHiddenFields(initializeHiddenFields(initialValues));
  };

  const handleCheckboxChange =
    (field: FieldConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field.hideFieldNames?.length) {
        setHiddenFields((prev) => {
          if (event.target.checked) {
            // Add hidden fields when checkbox is checked
            const newHiddenFields = [...prev];
            field.hideFieldNames?.forEach((fieldName) => {
              if (!prev.includes(String(fieldName))) {
                newHiddenFields.push(String(fieldName));
              }
            });
            field.unHideFieldNames?.forEach((name) => {
              if (prev.includes(String(name))) {
                newHiddenFields.splice(
                  newHiddenFields.indexOf(String(name)),
                  1,
                );
              }
            });
            return newHiddenFields;
          } else {
            // Remove hidden fields when checkbox is unchecked
            const newHiddenFields = [...prev].filter(
              (name) => !field.hideFieldNames!.includes(String(name)),
            );
            field.unHideFieldNames?.forEach((fieldName) => {
              if (!prev.includes(String(fieldName))) {
                newHiddenFields.push(String(fieldName));
              }
            });

            return newHiddenFields;
          }
        });
      }
    };

  return { hiddenFields, handleCheckboxChange, reset };
};
