import { FormField } from "@/components/form/FormModal/fields/FormField";
import { useLocationData } from "@/hooks/useLocationData";
import { FieldConfig } from "@/types";

interface LocationSectionProps {
  formMethods: any;
}

function LocationSelect({ formMethods }: LocationSectionProps) {
  const { control, getValues, setValue, watch } = formMethods;
  const country = watch("country.code") as string | null;

  const { countries, states } = useLocationData(country || "");

  const locationFields: FieldConfig[] = [
    {
      name: "country.code",
      type: "search-select",
      label: "Address",
      resetFields: ["state.code", "city"],
      textFieldProps: {
        placeholder: "Select your country (e.g., Egypt)",
      },
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
      onChange: (value) =>
        setValue(
          "country.name",
          (countries.find((c) => c.isoCode === value)?.name || "") as any,
        ),
    },
    {
      name: "state.code",
      type: "search-select",
      label: "State/Province",
      dependsOn: "country.code",
      textFieldProps: {
        placeholder: "Select your governorate (e.g., Cairo, Alexandria)",
      },
      onChange: (value) =>
        setValue(
          "state.name",
          (states.find((s) => s.isoCode === value)?.name || "") as any,
        ),
      options: states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
    },
    {
      name: "city",
      type: "text",
      label: "City",
      textFieldProps: {
        placeholder: "e.g., Cairo, Giza",
      },
      rules: {
        minLength: { value: 2, message: "City must be at least 2 characters" },
      },
    },
  ];

  const resetValues = (fieldNames: (string | number)[]) => {
    fieldNames.forEach((name) => {
      const field = locationFields.find((f) => f.name === name);
      if (field) {
        setValue(field.name, "", {
          shouldDirty: true,
        });
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mt-1 grid grid-cols-12 gap-4">
        {locationFields.map((field) => {
          return (
            <div className="col-span-6 md:col-span-4" key={String(field.name)}>
              <FormField
                field={field}
                control={control}
                formValues={getValues()}
                dependsOnField={locationFields.find(
                  (f) => f.name === field.dependsOn,
                )}
                resetValues={resetValues}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LocationSelect;
