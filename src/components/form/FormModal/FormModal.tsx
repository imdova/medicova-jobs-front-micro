"use client";
import { Dialog, DialogContent } from "@mui/material";
import useIsLeaving from "@/hooks/useIsLeaving";
import { ModalHeader } from "./ModalHeader";
import { FormContent } from "./FormContent";
import { getDefaultValues } from "@/util/forms";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import { DynamicModalProps } from "@/types";
import { cn } from "@/util";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useFormState } from "@/hooks/useFormState";

const FormModal: React.FC<DynamicModalProps> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  onChange,
  maxWidth = "sm",
  enableResetButton,
  fields = [],
  title,
  description,
  initialValues = {},
  children,
  loading,
  deleteLoading,
  error,
  submitButtonText,
  deleteButtonText,
  cancelButtonText,
  removeField,
  mode,
  dialog,
  resetAfterSubmit,
  sx,
  anchor,
  contentClassName,
  onClick
}) => {
  const defaultValues = getDefaultValues(fields, initialValues);
  const {
    hiddenFields,
    handleCheckboxChange,
    reset: resetFieldVisibility,
  } = useFieldVisibility(fields, initialValues, open);

  const formMethods = useFormState(open, fields, initialValues, mode);
  const {
    reset,
    setValue,
    formState: { isDirty },
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: open && isDirty,
  });

  const resetValues = (fieldNames: (string | number)[]) => {
    fieldNames.forEach((name) => {
      const field = fields.find((f) => f.name === name);
      if (field) {
        const defaultValue = field.type === "checkbox" ? false : "";
        setValue(String(name), defaultValue, { shouldDirty: true });
      }
    });
  };

  const handleClose = () =>
    isDirty ? setLeavingManually(true) : handleCancel();
  const handleReset = () => {
    reset(defaultValues);
    resetFieldVisibility();
  };
  const handleCancel = () => {
    handleReset();
    onClose?.();
  };

  const Modal = dialog ? dialog : Dialog;
  return (
    <>
      <LeaveConfirmationModal
        isOpen={isLeaving}
        onLeave={() => {
          handleUserDecision(true);
          handleCancel();
        }}
        onStay={() => {
          setLeavingManually(false);
          handleUserDecision(false);
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        {...(dialog ? { anchor } : {})}
        sx={{
          "& .MuiDialog-paper": { borderRadius: "10px" },
          "& .MuiPaper-root": {
            overflowX: "hidden",
            margin: 0,
            width: "calc(100% - 32px)",
          },
          ...sx,
        }}
      >
        {onClose && (
          <ModalHeader
            title={title}
            description={description}
            error={error}
            handleCancel={handleCancel}
          />
        )}
        <DialogContent
          className={cn(
            "m-0 h-full !p-0",
            dialog
              ? "max-h-[calc(100dvh-300px)]"
              : "max-h-[calc(100dvh-200px)]",
            contentClassName,
          )}
        >
          <FormContent
            contentClassName={contentClassName}
            fields={fields}
            onSubmit={onSubmit}
            resetAfterSubmit={resetAfterSubmit}
            error={error}
            formMethods={formMethods}
            hiddenFields={hiddenFields}
            onCheckboxChange={handleCheckboxChange}
            loading={loading}
            deleteLoading={deleteLoading}
            onDelete={onDelete}
            resetValues={resetValues}
            onCancel={handleCancel}
            onChange={onChange}
            submitButtonText={submitButtonText}
            deleteButtonText={deleteButtonText}
            cancelButtonText={cancelButtonText}
            enableResetButton={enableResetButton}
            removeField={removeField}
            onReset={handleReset}
            dialog={!!dialog}
            onClick={onClick}
          >
            {children}
          </FormContent>
        </DialogContent>
      </Modal>
    </>
  );
};

export default FormModal;
