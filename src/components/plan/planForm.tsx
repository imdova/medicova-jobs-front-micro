"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { Button, Tab, Tabs, TextField } from "@mui/material";
import { generateId } from "@/util";
import { ErrorField, FieldConfig } from "@/types";
import { validateFieldsFromConfig } from "@/util/forms";
import { Alert, AlertTitle } from "@mui/material";
import { SubscriptionPlan } from "@/types/finance";
import PlanCard from "./planCard";
import { SUBSCRIPTION_PLANS } from "@/constants/subscriptionPlans";

const fields: FieldConfig[] = [
  {
    name: "name",
    label: "Plan Name",
    type: "text",
    required: true,
    gridProps: { xs: 8, sm: 9 },
    textFieldProps: { placeholder: "Enter Plan name" },
  },
  {
    name: "badge",
    label: "Badge",
    type: "text",
    gridProps: { xs: 4, sm: 3 },
    textFieldProps: {
      placeholder: "Enter badge label (optional)",
    },
  },
  {
    name: "description",
    label: "Description",
    required: true,
    type: "textArea",
    textFieldProps: { placeholder: "Enter plan description" },
  },
  {
    name: "duration",
    required: true,
    label: "Duration (months)",
    type: "text",
    textFieldProps: { type: "number", placeholder: "1" },
  },
  {
    name: "currency",
    label: "Currency",
    gridProps: { xs: 4, sm: 2 },
    type: "select",
    options: [
      { label: "Egyptian Pound (EGP)", value: "EGP" },
      { label: "US Dollar (USD)", value: "USD" },
      { label: "Euro (EUR)", value: "EUR" },
      { label: "British Pound (GBP)", value: "GBP" },
      { label: "Japanese Yen (JPY)", value: "JPY" },
      { label: "Saudi Riyal (SAR)", value: "SAR" },
      { label: "UAE Dirham (AED)", value: "AED" },
      { label: "Canadian Dollar (CAD)", value: "CAD" },
      { label: "Australian Dollar (AUD)", value: "AUD" },
      { label: "Swiss Franc (CHF)", value: "CHF" },
    ],
    textFieldProps: { placeholder: "Select currency" },
  },
  {
    name: "price",
    required: true,
    label: "Price",
    gridProps: { xs: 4, sm: 5 },
    type: "text",
    textFieldProps: { type: "number", placeholder: "0" },
  },
  {
    name: "discountedPrice",
    label: "Discounted Price",
    gridProps: { xs: 4, sm: 5 },
    type: "text",
    textFieldProps: { type: "number", placeholder: "0" },
  },

  {
    name: "vat",
    required: true,
    label: "VAT (%)",
    type: "text",
    textFieldProps: { type: "number", placeholder: "14" },
  },
  {
    name: "vatDescription",
    required: true,
    label: "VAT Description",
    type: "textArea",
    textFieldProps: { placeholder: "Enter VAT details" },
  },
];

const featuresData: FieldConfig[] = [
  {
    name: "views",
    label: "Profile Views",
    required: true,
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 100, 1000, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
  {
    name: "unlocks",
    required: true,
    label: "Candidate Unlocks",
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 10, 50, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
  {
    name: "jobs",
    required: true,
    label: "Job Postings",
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 1, 5, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
  {
    name: "invitations",
    required: true,
    label: "Invitations",
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 20, 100, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
  {
    name: "users",
    required: true,
    label: "Users",
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 1, 10, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
  {
    name: "extraAccess",
    required: true,
    label: "Extra Access (months)",
    type: "text",
    textFieldProps: {
      placeholder: "e.g. 0, 3, or Infinity (unlimited)",
    },
    rules: {
      regex: /^(Infinity|[0-9]+)$/,
      message: "Enter a non-negative number or 'Infinity' for unlimited",
    },
  },
];

const PlanForm = ({ plan }: { plan?: SubscriptionPlan }) => {
  const isUpdate = Boolean(plan);
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState<ErrorField[]>([]);
  const [errorListener, setErrorListener] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [formData, setFormData] = useState<SubscriptionPlan>(
    plan || {
      id: generateId(),
      name: "",
      description: "",
      highlight: false,
      badge: "",
      duration: 0,
      price: 0,
      vat: 0,
      vatDescription: "",
      currency: "",
      discountedPrice: 0,
      features: [
        {
          name: "",
          tag: "",
        },
      ],
      views: 0,
      unlocks: 0,
      jobs: 0,
      invitations: 0,
      users: 0,
      extraAccess: 0,
      created_at: "",
      status: "inactive",
    },
  );

  const onSubmit = async () => {
    const isValid = validateFieldsFromConfig(
      [
        ...fields.map((x) => ({ ...x, tab: 0 })),
        ...featuresData.map((x) => ({ ...x, tab: 2 })),
      ],
      formData,
    );
    setErrorListener(true);
    if (isValid === true) {
      setErrors([]);

      console.log(formData);
    } else if (Array.isArray(isValid) && isValid.length > 0) {
      const errorTab = isValid[0].tab as number;
      if (errorTab >= 0) {
        setTabValue(errorTab as number);
      }
      setErrors(isValid);
    }
  };

  useEffect(() => {
    if (!errorListener) return;
    const isValid = validateFieldsFromConfig(
      [
        ...fields.map((x) => ({ ...x, tab: 0 })),
        ...featuresData.map((x) => ({ ...x, tab: 2 })),
      ],
      formData,
    );
    console.log("🚀 ~ useEffect ~ isValid:", isValid);
    if (isValid === true) return setErrors([]);
    setErrors(isValid);
  }, [errorListener, formData]);

  return (
    <div className="p-8">
      <Link href="/admin/plans" className="group flex items-center">
        <ArrowLeft className="mr-2 h-8 w-8 rounded-full bg-gray-200 p-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:bg-primary group-hover:text-white" />
        <span className="group-hover:underline">Back to Plans List</span>
      </Link>
      <div className="my-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isUpdate ? "Update Plan" : "Create New Plan"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdate
              ? plan?.name
                ? `Update your "${plan.name}" plan`
                : "Update your plan"
              : "Fill out the form below to create a new plan."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onSubmit}
            variant="contained"
            endIcon={isUpdate ? <ChevronRight size={14} /> : <Plus size={14} />}
          >
            {isUpdate ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1">
            <div className="col-span-1 mb-2 rounded-base bg-gray-200 p-2">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  minHeight: "35px",
                  height: "35px",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "white",
                    height: "35px",
                    borderRadius: "8px",
                    zIndex: 0,
                  },
                  "& .Mui-selected": {
                    color: "var(--primary)",
                    zIndex: 1,
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    minHeight: "35px",
                    height: "35px",
                    borderRadius: "8px",
                    margin: "0 2px",
                  },
                }}
              >
                <Tab label="General" className="flex-1" />
                <Tab label="Features List" className="flex-1" />
                <Tab label="Features Data" className="flex-1" />
              </Tabs>
            </div>
          </div>
          <div className="shadow-base rounded-base border border-gray-200 p-4">
            {tabValue === 0 && (
              <div
                className={"scroll-bar-minimal overflow-y-auto bg-background"}
              >
                <div className={"mt-1 grid grid-cols-12 gap-4"}>
                  {fields.map((field) => {
                    const gridProps = field.gridProps ?? {};
                    const xs = gridProps.xs ?? 12;
                    const sm = gridProps.sm ?? xs;
                    const md = gridProps.md ?? sm;
                    const rowXs = gridProps.rowXs ?? 1;
                    const rowSm = gridProps.rowSm ?? rowXs;
                    const rowMd = gridProps.rowMd ?? rowSm;
                    const classNames = [
                      `col-span-${xs}`,
                      sm !== xs ? `sm:col-span-${sm}` : "",
                      md !== sm ? `md:col-span-${md}` : "",
                      `row-span-${rowXs}`,
                      rowSm !== rowXs ? `sm:row-span-${rowSm}` : "",
                      rowMd !== rowSm ? `md:row-span-${rowMd}` : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <div className={classNames} key={String(field.name)}>
                        <FormField
                          errors={errors}
                          key={field.name}
                          field={field}
                          data={formData}
                          setData={setFormData}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tabValue === 1 && (
              <div className="grid grid-cols-12 gap-3">
                <h2 className="col-span-9 font-semibold">Feature Name</h2>
                <h2 className="col-span-3 font-semibold">Feature Tag</h2>
                {formData.features.map((feature, index) => (
                  <React.Fragment key={index}>
                    <div className="col-span-9 flex items-center gap-2">
                      <TextField
                        name="name"
                        className="w-full"
                        placeholder="Feature name"
                        value={feature.name}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = {
                            ...newFeatures[index],
                            name: e.target.value,
                          };
                          setFormData({ ...formData, features: newFeatures });
                        }}
                      />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <TextField
                        name="tag"
                        placeholder="Feature Tag"
                        value={feature.tag || ""}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = {
                            ...newFeatures[index],
                            tag: e.target.value,
                          };
                          setFormData({ ...formData, features: newFeatures });
                        }}
                      />
                      <button
                        onClick={() => {
                          const newFeatures = formData.features.filter(
                            (_, i) => i !== index,
                          );
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="rounded-full bg-gray-200 p-2 text-gray-500 hover:bg-red-100 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </React.Fragment>
                ))}
                <div className="col-span-12 mt-2">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        features: [...formData.features, { name: "", tag: "" }],
                      });
                    }}
                    endIcon={<Plus size={14} />}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
            )}
            {tabValue === 2 && (
              <div
                className={"scroll-bar-minimal overflow-y-auto bg-background"}
              >
                <div className={"mt-1 grid grid-cols-12 gap-4"}>
                  {featuresData.map((field) => {
                    const gridProps = field.gridProps ?? {};
                    const xs = gridProps.xs ?? 12;
                    const sm = gridProps.sm ?? xs;
                    const md = gridProps.md ?? sm;
                    const rowXs = gridProps.rowXs ?? 1;
                    const rowSm = gridProps.rowSm ?? rowXs;
                    const rowMd = gridProps.rowMd ?? rowSm;
                    const classNames = [
                      `col-span-${xs}`,
                      sm !== xs ? `sm:col-span-${sm}` : "",
                      md !== sm ? `md:col-span-${md}` : "",
                      `row-span-${rowXs}`,
                      rowSm !== rowXs ? `sm:row-span-${rowSm}` : "",
                      rowMd !== rowSm ? `md:row-span-${rowMd}` : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <div className={classNames} key={String(field.name)}>
                        <FormField
                          errors={errors}
                          key={field.name}
                          field={field}
                          data={formData}
                          setData={setFormData}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <ValidationSummary errors={errors} showSuccess={errorListener} />

          <h5 className="mb-4 text-xl font-semibold">Live Preview</h5>
          <PlanCard
            key={formData.name}
            plan={formData}
            index={SUBSCRIPTION_PLANS.findIndex((x) => x.id === plan?.id)}
            onGetStarted={() => console.log("get Started")}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanForm;

interface ValidationSummaryProps {
  errors: ErrorField[];
  showSuccess?: boolean;
}
const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  showSuccess = true,
}) => {
  const hasErrors = errors && errors.length > 0;

  return (
    <div className="mb-4">
      {hasErrors ? (
        <Alert severity="error">
          <AlertTitle>
            <strong>Please fix the following issues:</strong>
          </AlertTitle>
          <ul style={{ margin: 0, paddingLeft: 0 }}>
            {errors.map((err, idx) => (
              <li key={idx}>
                <strong>{err.field}</strong>: {err.message}
              </li>
            ))}
          </ul>
        </Alert>
      ) : (
        showSuccess && (
          <Alert severity="success">
            <AlertTitle>
              <strong>All good!</strong>
            </AlertTitle>
            Everything looks great. You can Submit .
          </Alert>
        )
      )}
    </div>
  );
};
