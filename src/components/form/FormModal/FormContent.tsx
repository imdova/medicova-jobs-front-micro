import React from "react";
import { FormActions } from "./FormActions";
import { cn } from "@/util";
import { FormContentProps } from "@/types";
import { FormGrid } from "./FormGrid";

export const FormContent: React.FC<FormContentProps> = ({
  fields,
  onSubmit,
  formMethods,
  hiddenFields,
  onCheckboxChange,
  children,
  loading,
  deleteLoading,
  resetValues,
  onDelete,
  onCancel,
  submitButtonText,
  deleteButtonText,
  cancelButtonText,
  removeField,
  onChange,
  dialog,
  onReset,
  enableResetButton,
  resetAfterSubmit,
  contentClassName,
  onClick,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
    reset,
    prevDefaultsRef,
  } = formMethods;

  const submitHandler = async (data: any) => {
    try {
      if (isDirty) {
        prevDefaultsRef.current = data;
        const result = await onSubmit?.(data);
        if (!result?.error) {
          if (resetAfterSubmit === "new") {
            reset(data);
          } else if (resetAfterSubmit === "default") {
            onReset?.();
          }
        }
      } else {
        onCancel();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = () => {
    const data = getValues();
    onDelete?.(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div
        className={cn(
          "scroll-bar-minimal overflow-y-auto bg-background",
          dialog ? "max-h-[calc(100dvh-354px)]" : "max-h-[calc(100dvh-254px)]",
          contentClassName,
        )}
      >
        <FormGrid
          fields={fields}
          control={control}
          hiddenFields={hiddenFields}
          onCheckboxChange={onCheckboxChange}
          onChange={onChange}
          removeField={removeField}
          getValues={getValues}
          resetValues={resetValues}
        />
        {children && children}
      </div>
      {(onSubmit || onClick) && (
        <FormActions
          onDelete={onDelete && handleDelete}
          onCancel={onCancel}
          onClick={onClick}
          isDirty={isDirty}
          onReset={onReset}
          isValid={isValid}
          loading={loading}
          enableResetButton={enableResetButton}
          deleteLoading={deleteLoading}
          submitButtonText={submitButtonText}
          deleteButtonText={deleteButtonText}
          cancelButtonText={cancelButtonText}
        />
      )}
    </form>
  );
};
