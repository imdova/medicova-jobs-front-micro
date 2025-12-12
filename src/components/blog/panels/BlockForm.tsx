"use client";
import { FormGrid } from "@/components/form/FormModal/FormGrid";
import FormModal from "@/components/form/FormModal/FormModal";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useFormState } from "@/hooks/useFormState";
import { useAppDispatch } from "@/store/hooks";
import { Block, FormItem, StyleConfig } from "@/types/blog";
import { showToast } from "@/util";
import { Box } from "@mui/material";
import { useState } from "react";

const FormBlock = ({
  block,
  forms,
  sx,
}: {
  block: Block;
  forms?: FormItem[];
  sx: StyleConfig;
}) => {
  const dispatch = useAppDispatch();
  const fields = block.fields || [];
  const { hiddenFields, handleCheckboxChange } = useFieldVisibility(
    fields,
    {},
    true,
  );

  const formMethods = useFormState(true, fields, {}, "onSubmit");
  const { setValue, control, handleSubmit, getValues } = formMethods;

  const resetValues = (fieldNames: (string | number)[]) => {
    fieldNames.forEach((name) => {
      const field = fields.find((f) => f.name === name);
      if (field) {
        const defaultValue = field.type === "checkbox" ? false : "";
        setValue(String(name), defaultValue, { shouldDirty: true });
      }
    });
  };

  /// modal handler
  const [form, setForm] = useState<FormItem | null>(null);
  const handleUserSubmit = (data: any) => {
    console.log(data);
    setForm(null);
  };

  const onUserClose = () => {
    setForm(null);
  };

  const isUserOpen = !!form;

  // form submit

  const onSubmit = handleSubmit(async (values) => {
    const formData = block.formData;
    if (!formData?.apiEndpoint) {
      showToast(dispatch, "No API endpoint defined. Skipping submission.", {
        type: "error",
      });
      return;
    }

    const method = formData.method || "POST";
    const headers = {
      "Content-Type": "application/json",
      ...(formData.headers || {}),
    };

    try {
      const res = await fetch(formData.apiEndpoint, {
        method,
        headers,
        body: method === "GET" ? undefined : JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Unknown error");

      // ✅ Success Handling
      if (formData.onSuccessMessage) {
        showToast(dispatch, formData.onSuccessMessage, { type: "success" });
      }

      if (formData.onSuccessRedirect) {
        window.location.href = formData.onSuccessRedirect;
      }

      if (formData.afterSubmitMessage) {
        console.log("After Submit Message:", formData.afterSubmitMessage);
        showToast(dispatch, formData.afterSubmitMessage, { type: "success" });
      }

      if (formData.afterSubmit === "open popup") {
        const form = forms?.find((f) => f.id === block.formId);
        if (!form) return;
        setForm(form);
      }

      return data;
    } catch (err: any) {
      if (formData.onErrorMessage) {
        showToast(dispatch, formData.onErrorMessage, { type: "error" });
      }

      if (formData.onErrorRedirect) {
        window.location.href = formData.onErrorRedirect;
      }

      throw err;
    }
  });
  return (
    <>
      <FormModal
        fields={form?.fields || []}
        onSubmit={handleUserSubmit}
        onClose={onUserClose}
        open={isUserOpen}
        title={form?.title}
        description={form?.description}
        submitButtonText={form?.submitButtonText}
        cancelButtonText={form?.cancelButtonText}
      />
      <Box
        component="form"
        id={block.id}
        onSubmit={onSubmit}
        sx={{
          ...sx.dimensions,
          ...sx.spacing,
          ...sx.background,
          ...sx.border,
        }}
      >
        {/* {(block.formData?.title || block.formData?.description) && (
        <ModalHeader
          title={block.formData?.title}
          description={block.formData?.description}
        />
      )} */}
        <FormGrid
          className="mt-0 p-0"
          fields={fields}
          control={control}
          hiddenFields={hiddenFields}
          onCheckboxChange={handleCheckboxChange}
          getValues={getValues}
          resetValues={resetValues}
        />
        {/* <FormActions /> */}
      </Box>
    </>
  );
};

export default FormBlock;
