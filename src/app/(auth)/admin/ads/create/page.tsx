"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { Button } from "@mui/material";
import CampaignType from "./campaignType";

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    name: "",
    adType: "",
    targetGroup: "",
    startDate: "",
    endDate: "",
    link: "",
    image: "",
  });

  return (
    <div className="p-8">
      <Link href="/admin/ads/campaigns" className="group flex items-center">
        <ArrowLeft className="mr-2 h-8 w-8 rounded-full bg-gray-200 p-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:bg-primary group-hover:text-white" />
        <span className="group-hover:underline">Back to SEO List</span>
      </Link>
      <div className="my-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground">Create SEO metadata for a new URL</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outlined"
            LinkComponent={Link}
            href={"#"}
            startIcon={<Eye size={14} />}
          >
            Preview
          </Button>
          <Button variant="contained" startIcon={<ChevronRight size={14} />}>
            Create Campaign
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="shadow-base rounded-base border border-gray-200 p-4">
            <div className="space-y-6">
              <CampaignType
                value={formData.adType}
                onChange={(value) =>
                  setFormData((pv) => ({ ...pv, adType: value }))
                }
              />
              <FormField
                field={{
                  name: "image",
                  label: "Campaign Photo",
                  type: "upload-area",
                  fileProps: {
                    urlField: true,
                  },
                  textFieldProps: { placeholder: "Enter campaign name" },
                }}
                fieldController={{
                  value: formData.image,
                  onChange: (e: FileWithPreview[]) =>
                    setFormData((pv) => ({ ...pv, image: e[0].preview })),
                }}
              />
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
              {/* <div className="grid grid-cols-2 gap-4">
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
              </div> */}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  field={{
                    name: "startDate",
                    label: "Start Date",
                    type: "date",
                  }}
                  data={formData}
                  setData={setFormData}
                />
                <FormField
                  field={{
                    name: "endDate",
                    label: "End Date",
                    type: "date",
                  }}
                  data={formData}
                  setData={setFormData}
                />
              </div>

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
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="shadow-base rounded-base border border-gray-200 p-4">
            <h5 className="mb-4 text-xl font-semibold">Live Preview</h5>
            <div>
              <div className="space-y-4">
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt="Ad Preview"
                  width={300}
                  height={150}
                  className="w-full rounded border"
                />
                {formData.name && (
                  <h5 className="font-semibold">{formData.name}</h5>
                )}

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
                  {formData.endDate && formData.startDate && (
                    <div>
                      <span className="text-xs font-semibold">Days</span>
                      <span className="ml-2 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs">
                        {Math.ceil(
                          (new Date(formData.endDate).getTime() -
                            new Date(formData.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </span>
                    </div>
                  )}
                  {formData.link && (
                    <div>
                      <span className="text-xs font-semibold">Destination</span>
                      <span className="ml-2 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs">
                        {formData.link}
                      </span>
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
