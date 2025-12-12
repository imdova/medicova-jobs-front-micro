"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, ArrowLeft } from "lucide-react";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { FieldConfig } from "@/types";
import Link from "next/link";
import { SEOPreview } from "@/components/admin/settings/seo-preview";

interface SEOFormData {
  urlPath: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string; // website, article, product, profile
  };
  twitter: {
    title: string;
    description: string;
    image: string;
    type: string; // summary, summary_large_image, player, app
  };
}

export default function NewSEOPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SEOFormData>({
    urlPath: "",
    title: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    noIndex: false,
    noFollow: false,
    openGraph: {
      title: "",
      description: "",
      image: "",
      type: "website",
    },
    twitter: {
      title: "",
      description: "",
      image: "",
      type: "summary_large_image",
    },
  });
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/seo");
      }
    } catch (error) {
      console.error("Failed to save SEO data:", error);
    } finally {
      setSaving(false);
    }
  };

  const getCharacterCount = (text: string, recommended: number) => {
    const count = text.length;
    const color =
      count === 0
        ? "text-muted-foreground"
        : count <= recommended
          ? "text-green-600"
          : "text-red-600";
    return (
      <span className={`text-xs ${color}`}>
        {count}/{recommended}
      </span>
    );
  };

  // Field configurations for FormField components
  const generalFields: FieldConfig[] = [
    {
      name: "urlPath",
      type: "text",
      required: true,
      label: "URL Path *",
      textFieldProps: {
        placeholder: "/about, /blog/my-article, etc.",
        helperText: "Enter the path relative to your domain (e.g., /about)",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Page Title *",
      textFieldProps: {
        placeholder: "Enter page title",
      },
    },
    {
      name: "metaDescription",
      type: "textArea",
      required: true,
      label: "Meta Description *",
      textFieldProps: {
        placeholder: "Enter meta description",
        rows: 3,
      },
    },
    {
      name: "metaKeywords",
      type: "multi-text",
      label: "Meta Keywords (Optional)",
      textFieldProps: {
        placeholder: "keyword1, keyword2, keyword3",
        helperText: "Comma-separated keywords (not required for modern SEO)",
      },
    },
    {
      name: "canonicalUrl",
      type: "text",
      label: "Canonical URL",
      textFieldProps: {
        placeholder: "https://example.com/canonical-url",
        helperText:
          "Specify a canonical URL to prevent duplicate content issues",
      },
      rules: {
        pattern: {
          value: /^https?:\/\/.+/,
          message: "Please enter a valid URL starting with http:// or https://",
        },
        validate: {
          validUrl: (value: string) => {
            if (!value) return true; // Allow empty
            try {
              new URL(value);
              return true;
            } catch {
              return "Please enter a valid URL format";
            }
          },
        },
      },
    },
  ];

  const socialFields: FieldConfig[] = [
    {
      name: "openGraph.title",
      type: "text",
      label: "OG Title",
      textFieldProps: {
        placeholder: "Leave empty to use page title",
      },
    },
    {
      name: "openGraph.description",
      type: "textArea",
      label: "OG Description",
      textFieldProps: {
        placeholder: "Leave empty to use meta description",
        rows: 3,
      },
    },
    {
      name: "openGraph.image",
      type: "text",
      label: "OG Image URL",
      textFieldProps: {
        placeholder: "https://example.com/og-image.jpg",
      },
    },
    {
      name: "openGraph.type",
      type: "select",
      label: "OG Type",
      options: [
        { value: "website", label: "Website" },
        { value: "article", label: "Article" },
        { value: "product", label: "Product" },
        { value: "profile", label: "Profile" },
      ],
    },
    {
      name: "twitter.card",
      type: "select",
      label: "Card Type",
      options: [
        { value: "summary", label: "Summary" },
        { value: "summary_large_image", label: "Summary Large Image" },
        { value: "player", label: "Player" },
        { value: "app", label: "App" },
      ],
    },
    {
      name: "twitter.title",
      type: "text",
      label: "Twitter Title",
      textFieldProps: {
        placeholder: "Leave empty to use page title",
      },
    },
    {
      name: "twitter.description",
      type: "textArea",
      label: "Twitter Description",
      textFieldProps: {
        placeholder: "Leave empty to use meta description",
        rows: 3,
      },
    },
    {
      name: "twitter.image",
      type: "text",
      label: "Twitter Image URL",
      textFieldProps: {
        placeholder: "https://example.com/twitter-image.jpg",
      },
    },
  ];

  const advancedFields: FieldConfig[] = [
    {
      name: "language",
      type: "select",
      label: "Language",
      textFieldProps: {
        label: "Language",
      },
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "it", label: "Italian" },
        { value: "pt", label: "Portuguese" },
      ],
    },
  ];

  const schemaFields: FieldConfig[] = [
    {
      name: "schema",
      type: "code",
      label: "JSON-LD Schema",
      textFieldProps: {
        label: "JSON-LD Schema",
        placeholder:
          '{"@context": "https://schema.org", "@type": "WebPage", "name": "Page Name"}',
      },
    },
  ];

  return (
    <div className="py-4">
      {/* Header */}
      <Link href="/admin/site-settings/seo" className="group flex items-center">
        <ArrowLeft className="mr-2 h-8 w-8 rounded-full bg-gray-200 p-2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:bg-primary group-hover:text-white" />
        <span className="group-hover:underline">Back to SEO List</span>
      </Link>
      <div className="my-6 flex items-center justify-between">
        <div>
          <Typography variant="h4" component="h1" className="font-bold">
            Add New SEO Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create SEO metadata for a new URL
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !formData.urlPath}
          startIcon={<Save className="h-4 w-4" />}
        >
          {saving ? "Saving..." : "Save SEO Data"}
        </Button>
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
                  <Tab label="General" className="flex-1" />
                  <Tab label="Social" className="flex-1" />
                  <Tab label="Advanced" className="flex-1" />
                  <Tab label="Schema" className="flex-1" />
                </Tabs>
              </div>
            </div>

            {tabValue === 0 && (
              <div className="space-y-6">
                {/* URL and Basic Information */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Typography variant="h6" component="h2" className="mb-2">
                    URL and Basic Information
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-4"
                  >
                    Start by specifying the URL path and basic SEO data
                  </Typography>

                  <div className="space-y-4">
                    {generalFields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <FormField
                          field={field}
                          data={formData}
                          setData={setFormData}
                        />
                        {(field.name === "title" ||
                          field.name === "metaDescription") && (
                          <div className="flex items-center justify-between">
                            {getCharacterCount(
                              field.name === "title"
                                ? formData.title
                                : formData.metaDescription,
                              field.name === "title" ? 60 : 160,
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="space-y-4">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.noIndex}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                noIndex: e.target.checked,
                              })
                            }
                          />
                        }
                        label="No Index (prevent search engines from indexing)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.noFollow}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                noFollow: e.target.checked,
                              })
                            }
                          />
                        }
                        label="No Follow (prevent search engines from following links)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 1 && (
              <div className="space-y-6">
                {/* Open Graph */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Typography variant="h6" component="h2" className="mb-2">
                    Open Graph (Facebook, LinkedIn)
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-4"
                  >
                    Control how your content appears when shared on social media
                  </Typography>

                  <div className="space-y-4">
                    {socialFields.slice(0, 4).map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        data={formData}
                        setData={setFormData}
                      />
                    ))}
                  </div>
                </div>

                {/* Twitter Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Typography variant="h6" component="h2" className="mb-2">
                    Twitter Card
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-4"
                  >
                    Optimize how your content appears on Twitter
                  </Typography>

                  <div className="space-y-4">
                    {socialFields.slice(4).map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        data={formData}
                        setData={setFormData}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                {/* Advanced Settings */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Typography variant="h6" component="h2" className="mb-2">
                    Advanced Settings
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-4"
                  >
                    Additional SEO configuration options
                  </Typography>

                  <div className="space-y-4">
                    {advancedFields.map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        data={formData}
                        setData={setFormData}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tabValue === 3 && (
              <div className="space-y-6">
                {/* Schema Markup */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Typography variant="h6" component="h2" className="mb-2">
                    Schema Markup (JSON-LD)
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-4"
                  >
                    Add structured data to help search engines understand your
                    content
                  </Typography>

                  <div className="space-y-2">
                    {schemaFields.map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        data={formData}
                        setData={setFormData}
                      />
                    ))}
                    <Typography variant="caption" color="text.secondary">
                      Enter valid JSON-LD structured data. Use tools like
                      Google&apos;s Structured Data Testing Tool to validate.
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SEOPreview
              title={formData.title || "Page Title"}
              description={
                formData.metaDescription || "Meta description will appear here"
              }
              url={`https://example.com${formData.urlPath || "/your-url"}`}
              ogTitle={formData.openGraph.title || formData.title}
              ogDescription={
                formData.openGraph.description || formData.metaDescription
              }
              ogImage={formData.openGraph.image}
              twitterTitle={formData.twitter.title || formData.title}
              twitterDescription={
                formData.twitter.description || formData.metaDescription
              }
              twitterImage={formData.twitter.image}
              twitterCard={formData.twitter.type}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
