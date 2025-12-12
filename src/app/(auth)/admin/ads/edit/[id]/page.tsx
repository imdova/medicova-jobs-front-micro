"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FormField } from "@/components/form/FormModal/fields/FormField";

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    adType: "",
    targetGroup: "",
    locations: [] as string[],
    devices: [] as string[],
    categories: [] as string[],
    dailyBudget: "",
    totalBudget: "",
    startDate: "",
    endDate: "",
    headline: "",
    description: "",
    cta: "",
    link: "",
    imageUrl: "/placeholder.svg?height=200&width=400",
    agree: false,
  });

  const steps = [
    { id: 1, title: "Basic Info", description: "Campaign details and type" },
    { id: 2, title: "Targeting", description: "Audience and placement" },
    { id: 3, title: "Budget & Schedule", description: "Budget and timeline" },
    { id: 4, title: "Creative", description: "Ad content and media" },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }));
  };

  const handleDeviceToggle = (device: string) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.includes(device)
        ? prev.devices.filter((d) => d !== device)
        : [...prev.devices, device],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Link
          href="/admin/ads/campaigns"
          className="text-muted-foreground text-sm hover:underline"
        >
          ← Back to Campaigns
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Create New Campaign</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep >= step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step.id}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="shadow-base rounded-base border border-gray-200 p-4">
            <div>
              <div>
                Step {currentStep}: {steps[currentStep - 1].title}
              </div>
            </div>
            <div className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    field={{
                      name: "name",
                      label: "Campaign Name",
                      type: "text",
                      textFieldProps: { placeholder: "Enter campaign name" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                  <FormField
                    field={{
                      name: "client",
                      label: "Client Type",
                      type: "select",
                      options: [
                        { label: "Internal (Our Platform)", value: "internal" },
                        { label: "External Advertiser", value: "external" },
                      ],
                      textFieldProps: { placeholder: "Select client type" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                  <FormField
                    field={{
                      name: "adType",
                      label: "Ad Type",
                      type: "select",
                      options: [
                        { label: "Banner Ad", value: "banner" },
                        { label: "Sidebar Ad", value: "sidebar" },
                        { label: "Sponsored Job Listing", value: "sponsored" },
                        { label: "Native In-Content", value: "native" },
                        { label: "Pop-up/Slide-in", value: "popup" },
                      ],
                      textFieldProps: { placeholder: "Select ad type" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                  <FormField
                    field={{
                      name: "targetGroup",
                      label: "Target Group",
                      type: "select",
                      options: [
                        { label: "Employers", value: "employers" },
                        { label: "Job Seekers", value: "seekers" },
                        { label: "All Visitors", value: "all" },
                      ],
                      textFieldProps: { placeholder: "Select target group" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                </div>
              )}

              {/* Step 2: Targeting */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    field={{
                      name: "locations",
                      label: "Locations",
                      type: "select",
                      multiple: true,
                      options: [
                        { label: "US", value: "US" },
                        { label: "UK", value: "UK" },
                        { label: "Canada", value: "Canada" },
                        { label: "Australia", value: "Australia" },
                        { label: "Germany", value: "Germany" },
                        { label: "France", value: "France" },
                      ],
                      textFieldProps: { placeholder: "Select locations" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />

                  <FormField
                    field={{
                      name: "devices",
                      label: "Device Types",
                      type: "select",
                      multiple: true,
                      options: [
                        { label: "Desktop", value: "Desktop" },
                        { label: "Mobile", value: "Mobile" },
                        { label: "Tablet", value: "Tablet" },
                      ],
                      textFieldProps: { placeholder: "Select device types" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />

                  <FormField
                    field={{
                      name: "categories",
                      label: "Job Categories",
                      type: "select",
                      multiple: true,
                      options: [
                        { label: "Technology", value: "Technology" },
                        { label: "Healthcare", value: "Healthcare" },
                        { label: "Finance", value: "Finance" },
                        { label: "Marketing", value: "Marketing" },
                        { label: "Sales", value: "Sales" },
                        { label: "Education", value: "Education" },
                      ],
                      textFieldProps: { placeholder: "Select job categories" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                </div>
              )}

              {/* Step 3: Budget & Schedule */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      field={{
                        name: "dailyBudget",
                        label: "Daily Budget ($)",
                        type: "text",
                        textFieldProps: { type: "number", placeholder: "50" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                    <FormField
                      field={{
                        name: "totalBudget",
                        label: "Total Budget ($)",
                        type: "text",
                        textFieldProps: { type: "number", placeholder: "1000" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      field={{
                        name: "startDate",
                        label: "Start Date",
                        type: "date",
                        textFieldProps: { type: "date" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                    <FormField
                      field={{
                        name: "endDate",
                        label: "End Date",
                        type: "date",
                        textFieldProps: { type: "date" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Creative */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <FormField
                    field={{
                      name: "headline",
                      label: "Headline",
                      type: "text",
                      textFieldProps: { placeholder: "Enter ad headline" },
                    }}
                    data={formData}
                    setData={setFormData}
                  />

                  <FormField
                    field={{
                      name: "description",
                      label: "Description",
                      type: "textArea",
                      textFieldProps: {
                        placeholder: "Enter ad description",
                        minRows: 3,
                      },
                    }}
                    data={formData}
                    setData={setFormData}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      field={{
                        name: "cta",
                        label: "Call to Action",
                        type: "text",
                        textFieldProps: { placeholder: "Learn More" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                    <FormField
                      field={{
                        name: "link",
                        label: "Destination URL",
                        type: "text",
                        textFieldProps: { placeholder: "https://example.com" },
                      }}
                      data={formData}
                      setData={setFormData}
                    />
                  </div>

                  <FormField
                    field={{
                      name: "agree",
                      label: "I agree to the terms and conditions",
                      type: "checkbox",
                    }}
                    data={formData}
                    setData={setFormData}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <button
              className="btn btn-outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button className="btn btn-primary">Create Campaign</button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="shadow-base rounded-base border border-gray-200 p-4">
            <div>
              <div>Live Preview</div>
            </div>
            <div>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg border p-4">
                  <Image
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Ad Preview"
                    width={300}
                    height={150}
                    className="w-full rounded border"
                  />
                  <div className="mt-3">
                    <h4 className="font-semibold">
                      {formData.headline || "Your Headline Here"}
                    </h4>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formData.description ||
                        "Your description will appear here"}
                    </p>
                    <span className="mt-2 inline-block rounded bg-primary px-3 py-1 text-sm text-white">
                      {formData.cta || "Call to Action"}
                    </span>
                  </div>
                </div>

                {/* Selected Options */}
                <div className="space-y-3">
                  {formData.targetGroup && (
                    <div>
                      <span className="text-xs font-semibold">
                        Target Group
                      </span>
                      <span className="ml-2 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs">
                        {formData.targetGroup}
                      </span>
                    </div>
                  )}

                  {formData.locations.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold">Locations</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {formData.locations.map((location) => (
                          <span
                            key={location}
                            className="inline-block rounded border border-gray-300 bg-white px-2 py-0.5 text-xs"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
