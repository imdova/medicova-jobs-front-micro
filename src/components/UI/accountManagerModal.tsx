"use client";
import { FieldConfig, Folder } from "@/types";
import FormModal from "../form/FormModal/FormModal";
import SelectAccountManager from "../form/selectaccountmanager";

interface AccountManagerModalProps {
  companyId?: string | null;
  onClose: () => void;
}

const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  companyId,
  onClose,
}) => {
  const fields: FieldConfig[] = [
    {
      name: "id",
      type: "component",
      componentProps: {
        label: "All Account Managers",
      },
      component: SelectAccountManager,
    },
  ];

  const onSubmit = async (data: Folder) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    onClose();
  };
  return (
    <FormModal
      open={!!companyId}
      onClose={onClose}
      onSubmit={onSubmit}
      fields={fields}
      title="Assign Account Manager"
      description="Select an account manager to handle this company's account. The account manager will be responsible for managing the company's relationship and providing support."
    />
  );
};

export default AccountManagerModal;
