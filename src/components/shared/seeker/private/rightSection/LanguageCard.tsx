"use client";
import { IconButton } from "@mui/material";
import { Edit, LanguageOutlined } from "@mui/icons-material";
import { useState } from "react";
import { FieldConfig, Option } from "@/types";
import useUpdateApi from "@/hooks/useUpdateApi";
import FormModal from "@/components/form/FormModal/FormModal";
import { API_UPDATE_SEEKER } from "@/api/seeker";
import { TAGS } from "@/api";
import SearchableSelect from "@/components/UI/SearchableSelect";
import { LanguageProficiency, UserProfile } from "@/types/seeker";
import { useAppDispatch } from "@/store/hooks";
import { useUserData } from "@/hooks/useUserData";
import { updateUserProfile } from "@/store/slices/profileSlice";

type LanguageSectionProps = {
  user: UserProfile;
};

// TODO Enum of languages
const languageOptions: Option[] = [
  { value: "Fluent", label: "Fluent" },
  { value: "Native", label: "Native" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Beginner", label: "Beginner" },
];

const languages = ["Arabic", "English", "French", "German"];

const baseFields: FieldConfig[] = [
  {
    name: "Arabic",
    label: "Arabic",
    type: "select",
    options: languageOptions,
  },
  {
    name: "English",
    label: "English",
    type: "select",
    options: languageOptions,
  },
];

const SeekerLanguageCard: React.FC<LanguageSectionProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  useUserData(user?.userName, "languages");
  const languageData = user.languages || [];
  const languagesValues = languageData.reduce(
    (acc: { [key: string]: string }, lang) => {
      acc[lang.name] = lang.proficiency;
      return acc;
    },
    {},
  );
  const initialFields: FieldConfig[] = languageData.map((lang) => ({
    name: lang.name,
    label: lang.name.charAt(0).toUpperCase() + lang.name.slice(1),
    type: "select",
    textFieldProps: {
      placeholder: "Select proficiency",
    },
    options: languageOptions,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState<FieldConfig[]>(
    initialFields.length > 0 ? initialFields : baseFields,
  );

  const open = () => {
    setIsModalOpen(true);
    setFields(initialFields.length > 0 ? initialFields : baseFields);
  };
  const close = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    const languages: LanguageProficiency[] = Object.keys(formData)
      .map((key) => ({
        name: key as LanguageProficiency["name"],
        proficiency: formData[key],
      }))
      .filter((lang) => lang.proficiency !== "");
    const body = { id: user?.id, languages };
    dispatch(
      updateUserProfile({ id: user.id, updates: body, key: "languages" }),
    );
    close();
  };

  const addNewField = (inputValue: string) => {
    const newFields: FieldConfig[] = [
      ...fields,
      {
        name: inputValue,
        label: inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
        type: "select",
        textFieldProps: {
          placeholder: "Select proficiency",
        },
        options: languageOptions,
      },
    ];
    if (inputValue) {
      setFields(newFields);
    }
  };
  const removeLastField = (fieldName: string) => {
    setFields((pv) => pv.filter((field) => field.name !== fieldName));
  };
  const filterLanguages = languages.filter(
    (lang) => !fields.some((field) => field.name === lang),
  );

  return (
    <div className="rounded-base border border-gray-200 bg-white p-4 shadow-soft md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-main">Languages</h3>
        <IconButton
          onClick={open}
          className="rounded border border-solid border-gray-200 p-2"
        >
          <Edit className="h-5 w-5" />
        </IconButton>
      </div>
      <FormModal
        open={isModalOpen}
        onClose={close}
        onSubmit={handleUpdate}
        fields={fields}
        title="Edit Your Languages"
        removeField={fields.length > 1 ? removeLastField : undefined}
        initialValues={languagesValues}
      >
        <div className="border-t border-gray-200 p-4">
          <label className="font-semibold">Add Language</label>
          <SearchableSelect
            className={`w-full bg-white`}
            id={"language"}
            defaultValue=""
            options={filterLanguages.map((lang) => ({
              value: lang,
              label: lang,
            }))}
            displayEmpty
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            onChange={(e) => addNewField(e.target.value as string)}
            renderValue={(selected) => {
              return (
                <span className="text-neutral-400">
                  {(selected as string) || "Select Language"}
                </span>
              );
            }}
          />
        </div>
      </FormModal>

      <div>
        {!languageData.length && (
          <p className="text-muted-foreground">No Language data found.</p>
        )}

        {languageData.map((language, index) => (
          <div key={index}>
            <p className="my-2 text-muted-foreground">
              <LanguageOutlined className="mr-2 inline-block" color="primary" />
              <span className="font-semibold text-main">
                {language.name} :
              </span>{" "}
              {language.proficiency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerLanguageCard;
