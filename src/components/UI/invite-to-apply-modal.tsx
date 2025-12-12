"use client";
import { FieldConfig, Folder } from "@/types";
import FormModal from "../form/FormModal/FormModal";
import useFetch from "@/hooks/useFetch";
import { API_GET_JOBS_BY_COMPANY_ID } from "@/api/employer";
import SelectJob from "../form/select.jobs";

interface InviteModalProps {
  companyId?: string | null;
  seekers: string[] | null;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  companyId,
  seekers,
  onClose,
}) => {
  const { data } = useFetch<PaginatedResponse<Folder>>(
    companyId
      ? `${API_GET_JOBS_BY_COMPANY_ID}${companyId}?page=1&limit=100`
      : null,
  );
  const jobs = data?.data || [];
  const fields: FieldConfig[] = [
    {
      name: "id",
      type: "component",
      componentProps: {
        label: "All Jobs",
        jobs: jobs,
      },
      component: SelectJob,
    },
  ];

  const onSubmit = async (data: Folder) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    onClose();
  };
  return (
    <FormModal
      open={!!seekers}
      onClose={onClose}
      onSubmit={onSubmit}
      fields={fields}
      title="Select Job to Invite"
    />
  );
};

export default InviteModal;
