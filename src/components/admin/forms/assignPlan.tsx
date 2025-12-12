"use client";
import FormModal from "@/components/form/FormModal/FormModal";
import SelectPlan from "./SelectPlan";
import { FieldConfig } from "@/types";

interface AssignPlanModalProps {
  employerId?: string | null;
  open: boolean;
  onClose: () => void;
}

const AssignPlanModal: React.FC<AssignPlanModalProps> = ({
  employerId,
  open,
  onClose,
}) => {
  const fields: FieldConfig[] = [
    {
      name: "id",
      type: "component",
      componentProps: {
        label: "All Plans",
      },
      component: SelectPlan,
    },
  ];

  const onSubmit = async (data: Folder) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      fields={fields}
      title="Assign Plan"
      description="Select a plan to assign to this employer. The plan will determine the features and pricing for the employer's account."
      submitButtonText="Assign Plan"
    />
  );
};

export default AssignPlanModal;
