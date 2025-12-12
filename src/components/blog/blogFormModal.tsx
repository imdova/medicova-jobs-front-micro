import useIsLeaving from "@/hooks/useIsLeaving";
import { useBlogStore } from "@/lib/blog/blog-store";
import LeaveConfirmationModal from "../UI/LeaveConfirmationModal";
import { Suspense } from "react";
import FormModal from "../form/FormModal/FormModal";
import { ModalWrapper } from "../form/FormModal/formWraper";

const BlogFormModal = () => {
  const { isDirty, selectForm, getActiveForm } = useBlogStore();
  const activeForm = getActiveForm();

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isDirty,
  });
  const handleCancel = () => {
    selectForm(null);
  };
  const handleClose = () =>
    isDirty ? setLeavingManually(true) : handleCancel();

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
      <Suspense fallback={<div className="p-4">Loading form...</div>}>
        {activeForm && (
          <FormModal
            open={true}
            error={""}
            loading={false}
            onClose={handleClose}
            onSubmit={(data) => console.log(data)}
            fields={activeForm.fields}
            title={activeForm.title}
            description={activeForm.description}
            dialog={ModalWrapper}
            submitButtonText={activeForm.submitButtonText}
            cancelButtonText={activeForm.cancelButtonText}
          />
        )}
      </Suspense>
    </>
  );
};

export default BlogFormModal;
