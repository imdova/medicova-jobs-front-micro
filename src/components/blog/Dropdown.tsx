import SelectField from "../form/FormModal/fields/SelectField";

type Option = {
  value: string;
  label: string;
};
const Dropdown = ({
  name,
  value,
  options,
  onChange,
  icon,
}: {
  name: string;
  value: string;
  options: string[] | Option[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) => {
  return (
    <SelectField
      field={{
        name,
        options: options.map((x) => ({
          value: typeof x === "object" && "value" in x ? x.value : x,
          label: typeof x === "object" && "label" in x ? x.label : x,
        })),
        textFieldProps: {
          label: name,
          InputProps: {
            startAdornment: icon,
          },
        },
      }}
      controllerField={{
        name: name,
        value,
        onChange: (e) => onChange(e?.target?.value || e),
      }}
    />
  );
};

export default Dropdown;
