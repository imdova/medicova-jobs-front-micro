import { useState } from "react";
import FormModal from "@/components/form/FormModal/FormModal";
import { Button, Card } from "@mui/material";
import { FieldConfig } from "@/types";

interface BrandingSettings {
  siteName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

const brandingFields: FieldConfig[] = [
  {
    name: "siteName",
    label: "Site Name",
    type: "text",
    required: true,
  },
  {
    name: "logo",
    label: "Logo URL",
    type: "text",
    required: true,
  },
  // {
  //   name: "favicon",
  //   label: "Favicon URL",
  //   type: "text",
  //   required: true,
  // },
  // {
  //   name: "primaryColor",
  //   label: "Primary Color",
  //   type: "color",
  //   required: true,
  // },
  // {
  //   name: "secondaryColor",
  //   label: "Secondary Color",
  //   type: "color",
  //   required: true,
  // },
  // {
  //   name: "accentColor",
  //   label: "Accent Color",
  //   type: "color",
  //   required: true,
  // },
  {
    name: "fontFamily",
    label: "Font Family",
    type: "select",
    options: [
      { label: "Inter", value: "Inter" },
      { label: "Roboto", value: "Roboto" },
      { label: "Open Sans", value: "Open Sans" },
      { label: "Montserrat", value: "Montserrat" },
    ],
    required: true,
  },
];

export function BrandingManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branding, setBranding] = useState<BrandingSettings>({
    siteName: "",
    logo: "",
    favicon: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#3b82f6",
    fontFamily: "Inter",
  });

  const handleSubmit = async (values: any) => {
    // TODO: Implement submit logic
    console.log(values);
    setBranding(values);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Branding Settings</h2>
        <Button onClick={() => setIsModalOpen(true)}>Edit Branding</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Current Branding</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Site Name</p>
              <p className="font-medium">{branding.siteName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Font Family</p>
              <p className="font-medium">{branding.fontFamily}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Primary Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <p className="font-medium">{branding.primaryColor}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Secondary Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                  <p className="font-medium">{branding.secondaryColor}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accent Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: branding.accentColor }}
                  />
                  <p className="font-medium">{branding.accentColor}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Assets</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Logo</p>
              {branding.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={branding.logo}
                  alt="Site Logo"
                  className="h-12 object-contain"
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Favicon</p>
              {branding.favicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={branding.favicon}
                  alt="Favicon"
                  className="h-8 w-8 object-contain"
                />
              )}
            </div>
          </div>
        </Card>
      </div>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        fields={brandingFields}
        title="Edit Branding Settings"
        initialValues={branding}
      />
    </div>
  );
}
