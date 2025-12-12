"use client";
import { FieldConfig } from "@/types";
import FormModal from "../form/FormModal/FormModal";
import UserListSelector from "./UserListSelector";
import { Mail } from "@mui/icons-material";

type User = {
  id: string;
  name: string;
  image?: string | null;
};
interface SendMessageModalProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  users,
  isOpen,
  onClose,
}) => {
  const fields: FieldConfig[] = [
    {
      name: "message",
      type: "textArea",
    },
  ];

  const onSubmit = async (data: Message) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    // Here you would typically make an API call to send the message
    onClose();
  };

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      fields={fields}
      title={
        <div className="flex items-center w-full gap-2 px-2 mb-4">
          <Mail className="h-7 w-7 text-muted-foreground" />
          <span className="text-2xl font-medium">Send Email</span>
        </div>
      }
      submitButtonText="Send"
      description={
        <div>
          <UserListSelector
            users={users}
            // availableUsers={availableUsers}
          />
        </div>
      }
    />
  );
};

export default SendMessageModal;
