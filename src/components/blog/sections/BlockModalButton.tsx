"use client";
import FormModal from "@/components/form/FormModal/FormModal";
import { Block, FormItem } from "@/types/blog";
import { Box, SxProps } from "@mui/material";
import { useState } from "react";

interface BlockModalButtonProps {
  block: Block;
  forms?: FormItem[];
  sx?: SxProps;
}

export const BlockModalButton: React.FC<BlockModalButtonProps> = ({
  block,
  forms,
  sx,
}) => {
  const [form, setForm] = useState<FormItem | null>(null);

  const handleUserSubmit = (data: any) => {
    console.log(data);
  };

  const onUserClose = () => {
    setForm(null);
  };

  const isUserOpen = !!form;

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
        onClick={() => {
          const form = forms?.find((f) => f.id === block.formId);
          if (!form) return;
          setForm(form);
        }}
        component="button"
        sx={sx}
      >
        {block.content}
      </Box>
    </>
  );
};
