"use client";
import { Company, FieldConfig, JobData } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { useAppDispatch } from "@/store/hooks";
import { addJob } from "@/store/slices/jobSlice";
import { useCompanyJobsData } from "@/hooks/useCompanyJobsData";
import { useIndustriesData } from "@/hooks/useIndustriesData";

type PostJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
};

const QuickPostJobModal = ({
  isOpen,
  onClose,
  companyId,
}: PostJobModalProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { updating, error } = useCompanyJobsData({ companyId }, handleSuccess);
  const initialValues: Partial<JobData> = {
    title: "",
    jobIndustry: "",
    jobIndustryId: "",
    jobCategory: "",
    jobCategoryId: "",
    jobSpeciality: "",
    jobSpecialityId: "",
    jobCareerLevel: "",
    jobCareerLevelId: "",
  };

  async function handleSuccess(newJob?: JobData) {
    if (!newJob) return;
    router.push(`/employer/job/posted/${newJob?.id}`);
    onClose();
  }

  const [industryId, setIndustryId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const {
    industries: {
      data: { data: industries },
    },
    categories: {
      data: { data: categories },
    },
    careerLevels: {
      data: { data: careerLevels },
    },
    specialities: {
      data: { data: specialities },
    },
  } = useIndustriesData({
    categoryId,
    industryId,
  });

  const handlePost = async (formData: Partial<JobData>) => {
    const industry = industries.find((x) => x.id === formData.jobIndustryId);
    const category = categories.find((x) => x.id === formData.jobCategoryId);
    const speciality = specialities.find(
      (x) => x.id === formData.jobSpecialityId,
    );
    const careerLevel = careerLevels.find(
      (x) => x.id === formData.jobCareerLevelId,
    );
    const job = {
      ...formData,
      draft: true,
      jobIndustry: industry?.name,
      jobCategory: category?.name,
      jobSpeciality: speciality?.name,
      jobCareerLevel: careerLevel?.name,
    };
    dispatch(addJob({ companyId, job }));
  };

  const fields: FieldConfig[] = [
    {
      name: "title",
      type: "text",
      label: "Job Title*",
      required: true,
      rules: {
        minLength: { value: 5, message: "Title must be at least 5 characters" },
      },
    },
    {
      name: "jobIndustryId",
      type: "select",
      label: "Job Industry*",
      resetFields: ["jobCategoryId", "jobSpecialityId", "jobCareerLevelId"],
      required: true,
      onChange: setIndustryId,
      options: industries.map((item) => ({
        value: item.id,
        label: item.name,
      })),
      gridProps: { xs: 6 },
    },
    {
      name: "jobCategoryId",
      type: "select",
      dependsOn: "jobIndustryId",
      required: true,
      resetFields: ["jobSpecialityId", "jobCareerLevelId"],
      label: "Job Category*",
      onChange: setCategoryId,
      options: categories.map((type) => ({
        value: type.id,
        label: type.name,
      })),
      gridProps: { xs: 6 },
    },
    {
      name: "jobSpecialityId",
      type: "select",
      dependsOn: "jobCategoryId",
      required: true,
      label: "Job Specialty*",
      options: specialities.map((type) => ({
        value: type.id,
        label: type.name,
      })),
      gridProps: { xs: 6 },
    },
    {
      name: "jobCareerLevelId",
      type: "select",
      dependsOn: "jobCategoryId",
      required: true,
      label: "Job Career Level*",
      options: careerLevels.map((type) => ({
        value: type.id,
        label: type.name,
      })),
      gridProps: { xs: 6 },
    },
  ];
  return (
    <FormModal
      open={isOpen}
      error={error || ""}
      loading={updating}
      onClose={onClose}
      onSubmit={handlePost}
      fields={fields}
      title="Company Main Information"
      initialValues={initialValues}
    />
  );
};

export default QuickPostJobModal;
