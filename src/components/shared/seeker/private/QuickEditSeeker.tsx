"use client";
import FormModal from "@/components/form/FormModal/FormModal";
import ShareMenu from "@/components/UI/ShareMenu";
import { nationalitiesOptions } from "@/constants";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import { useLocationData } from "@/hooks/useLocationData";
import { useUserData } from "@/hooks/useUserData";
import { useAppDispatch } from "@/store/hooks";
import { updateUserProfile } from "@/store/slices/profileSlice";
import { FieldConfig } from "@/types";
import { UserProfile } from "@/types/seeker";
import { getCurrentTimeFormatted } from "@/util/date";
import { getExperienceDetail } from "@/util/general";
import { areMainFieldsEqual, UserProfileToUser } from "@/util/user";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface EditProfileProps {
  user: UserProfile;
}

const getInitialValues = (
  user: Partial<UserProfile>,
): Partial<UserProfile> => ({
  firstName: user?.firstName,
  lastName: user?.lastName,
  birthDate: user?.birthDate,
  nationality: user?.nationality,
  title: user?.title,
  state: user?.state || null,
  country: user?.country || null,
  city: user?.city,
  categoryId: user?.categoryId,
  specialityId: user?.specialityId,
  careerLevelId: user?.careerLevelId,
});

const QuickEditSeeker: React.FC<EditProfileProps> = ({ user }) => {
  const { update, data } = useSession();
  const sessionUser = data?.user;
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(user?.country?.code || "");
  const [categoryId, setCategoryId] = useState(user?.categoryId || "");
  const { countries, states } = useLocationData(countryCode);
  const {
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
    industryId: "all",
    categoryId,
  });

  useUserData(user.userName, "quick-edit");
  // fields
  const handleUpdate = async (formData: Partial<UserProfile>) => {
    const { state: formState, country: formCountry } = formData;
    const country =
      countries.find((country) => country.isoCode === formCountry?.code) ||
      null;
    const state =
      states.find((state) => state.isoCode === formState?.code) || null;

    const body: Partial<UserProfile> = {
      ...formData,
      country: country ? { code: country.isoCode, name: country.name } : null,
      state: state ? { code: state.isoCode, name: state.name } : null,
    };
    if (sessionUser) {
      const newData = UserProfileToUser(formData);
      if (!areMainFieldsEqual(sessionUser, newData)) {
        update(newData);
      }
    }
    onClose();
    dispatch(
      updateUserProfile({
        id: user.id,
        updates: body,
        key: "quick-edit",
      }),
    );
  };

  const fields: FieldConfig[] = [
    {
      label: "First Name",
      name: "firstName",
      type: "text",
      gridProps: { xs: 6 },
      required: true,
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      gridProps: { xs: 6 },
      required: true,
    },
    {
      name: "birthDate",
      type: "date",
      gridProps: { xs: 6 },
      label: "Date of Birth",
      textFieldProps: {
        inputProps: {
          max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split("T")[0],
        },
      },
    },
    {
      name: "nationality",
      label: "Nationality",
      type: "search-select",
      options: nationalitiesOptions,
      gridProps: { xs: 6 },
    },
    {
      name: "title",
      label: "Title",
      type: "text",
    },
    {
      name: "categoryId",
      type: "select",
      label: "Category",
      required: true,
      resetFields: ["specialityId", "careerLevelId"],
      onChange: (value) => setCategoryId(value),
      options: categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    },
    {
      name: "specialityId",
      type: "select",
      dependsOn: "categoryId",
      label: "Specialty",
      required: true,
      options: specialities.map((speciality) => ({
        value: speciality.id,
        label: speciality.name,
      })),
      gridProps: { xs: 6 },
    },
    {
      name: "careerLevelId",
      type: "select",
      dependsOn: "categoryId",
      label: "Career Level",
      required: true,
      options: careerLevels.map((careerLevel) => ({
        value: careerLevel.id,
        label: careerLevel.name,
      })),
      gridProps: { xs: 6 },
    },
    {
      name: "country.code",
      type: "search-select",
      resetFields: ["state.code", "city"],
      label: "Country",
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
      onChange: (value) => setCountryCode(value),
      gridProps: { xs: 6, md: 4 },
    },
    {
      name: "state.code",
      type: "search-select",
      dependsOn: "country.code",
      label: "State",
      options: states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
      gridProps: { xs: 6, md: 4 },
    },
    {
      name: "city",
      type: "text",
      label: "City",
      gridProps: { xs: 12, md: 4 },
      rules: {
        minLength: { value: 2, message: "City must be at least 2 characters" },
      },
    },
  ];

  const open = () => {
    setIsModalOpen(true);
    setCountryCode(user?.country?.code || "");
  };

  function onClose() {
    setIsModalOpen(false);
    setCountryCode("");
  }

  const initialValues = getInitialValues({
    ...user,
    title: getExperienceDetail(user.title || ""),
  });

  return (
    <>
      <FormModal
        open={isModalOpen}
        onClose={onClose}
        onSubmit={handleUpdate}
        fields={fields}
        title="Personal Information"
        initialValues={initialValues}
      />
      <div className="flex h-full flex-col items-center justify-center gap-2 sm:items-end">
        {/* Edit Button */}
        <IconButton onClick={open}>
          <Edit className="text-white" />
        </IconButton>
        {/* Share Button */}
        <ShareMenu className="text-white" path={`/me/${user.userName}`} />
      </div>
    </>
  );
};

export default QuickEditSeeker;
