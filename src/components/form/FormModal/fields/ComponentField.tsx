import { FieldConfig } from "@/types";
import React from "react";

interface ComponentFieldProps {
    field: FieldConfig;
    controllerField: any;
    error: any;
}

export const ComponentField: React.FC<ComponentFieldProps> = ({
    field,
    controllerField,
    error,
}) => {
    const CustomComponent = field.component!;
    return (
        <CustomComponent
            {...controllerField}
            {...field.componentProps}
            label={field.label}
            error={!!error}
            helperText={error?.message}
        />
    );
};