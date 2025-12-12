import { FormField } from "@/components/form/FormModal/fields/FormField";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import { FieldConfig, Industry } from "@/types";
import { UseFormReturn } from "react-hook-form";

interface LocationSectionProps {
  formMethods: UseFormReturn<any>;
}
const CategorySelect: React.FC<LocationSectionProps> = ({ formMethods }) => {
  const { control, watch, getValues, setValue } = formMethods;
  const categoryId = watch("categoryId");

  const {
    categories: {
      data: { data: categories },
      loading: categoriesLoading,
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
  const resetValues = (fieldNames: string[]) => {
    fieldNames.forEach((name) => {
      setValue(String(name), "", {
        shouldDirty: true,
      });
    });
  };
  return (
    <div className="w-full space-y-4">
      <div className="md:w-1/2">
        <FormField
          field={{
            name: "categoryId",
            type: "select",
            label: "Category*",
            resetFields: ["specialityId", "careerLevelId"],
            options: categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
            gridProps: { xs: 7 },
          }}
          control={control}
          formValues={getValues()}
          resetValues={resetValues}
        />
      </div>
      <div className="flex w-full gap-4">
        <div className="md:w-1/2">
          <FormField
            field={{
              name: "specialityId",
              type: "select",
              dependsOn: "categoryId",
              label: "Specialty*",
              options: specialities.map((speciality) => ({
                value: speciality.id,
                label: speciality.name,
              })),
              gridProps: { xs: 6 },
            }}
            dependsOnField={
              {
                name: "categoryId",
                label: "Category*",
              } as FieldConfig
            }
            control={control}
            formValues={getValues()}
            resetValues={resetValues}
          />
        </div>
        <div className="md:w-1/2">
          <FormField
            field={{
              name: "careerLevelId",
              type: "select",
              dependsOn: "categoryId",
              label: "Career Level*",
              options: careerLevels.map((careerLevel) => ({
                value: careerLevel.id,
                label: careerLevel.name,
              })),
              gridProps: { xs: 6 },
            }}
            dependsOnField={
              {
                name: "categoryId",
                label: "Category*",
              } as FieldConfig
            }
            control={control}
            formValues={getValues()}
            resetValues={resetValues}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
