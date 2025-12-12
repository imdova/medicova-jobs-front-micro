"use client";

import { useState } from "react";
import { Eye, Save, Settings } from "lucide-react";
import { Button, Tab, Tabs } from "@mui/material";
import { TabsContent } from "@/components/UI/tabs";
import { Option } from "@/types";
import { Image as ImageIcon, Palette } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import BrandAssets from "@/components/admin/settings/branding/BrandAssets";
import { BrandingData } from "@/types/branding";
import Generals from "@/components/admin/settings/branding/Generals";
import ColorSystem from "@/components/admin/settings/branding/ColorSystem";
import { BrandingPreview } from "@/components/admin/settings/branding/branding-preview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchBrandingData } from "@/store/slices/brandingSlice";

const tabs: Option[] = [
  {
    label: "Generals",
    value: "generals",
    icon: <Settings className="h-4 w-4" />,
  },
  { label: "Assets", value: "assets", icon: <ImageIcon className="h-4 w-4" /> },
  { label: "Colors", value: "colors", icon: <Palette className="h-4 w-4" /> },
  // {
  //   label: "Typography",
  //   value: "typography",
  //   icon: <Type className="h-4 w-4" />,
  // },
  // { label: "Themes", value: "themes", icon: <ThemeIcon className="h-4 w-4" /> },
];

export default function BrandingControlPage() {
  const branding = useAppSelector((state) => state.branding.data);
  const dispatch = useAppDispatch();

  const [tabValue, setTabValue] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const formMethods = useForm<BrandingData>({
    defaultValues: branding,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = formMethods;

  const onSubmit = formMethods.handleSubmit((data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    dispatch(patchBrandingData(data));
  });

  const onPreview = formMethods.handleSubmit((data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    dispatch(patchBrandingData(data));
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Branding Control</h1>
              <p className="text-muted-foreground mt-1">
                Manage your brand&apos;s visual identity across all touchpoints
              </p>
            </div>
            <div className="flex gap-3">
              {/* <Button
            variant="outlined"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? "Exit Preview" : "Preview Changes"}
          </Button> */}
              <Button
                type="button"
                onClick={onPreview}
                variant="outlined"
                disabled={!isDirty}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button type="submit" variant="contained" disabled={!isDirty}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="w-full">
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
                      {tabs.map((tab) => (
                        <Tab
                          key={tab.value}
                          label={tab.label}
                          icon={<span>{tab.icon}</span>}
                          iconPosition="start"
                          className="flex-1"
                        />
                      ))}
                    </Tabs>
                  </div>
                </div>

                {tabValue === 0 && <Generals />}
                {tabValue === 1 && <BrandAssets />}
                {tabValue === 2 && <ColorSystem />}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <BrandingPreview tabValue={tabValue} data={watch()} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
