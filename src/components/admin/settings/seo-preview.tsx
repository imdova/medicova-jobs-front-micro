import { Globe } from "lucide-react";
import Image from "next/image";
import { Tabs, Tab, Box, Typography, Chip } from "@mui/material";
import { useState } from "react";

interface SEOPreviewProps {
  title: string;
  description: string;
  url: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
}

type Color = "primary" | "warning" | "error";

function checkSEOLength(
  metaTitle: string,
  metaDescription: string,
): {
  titleColor: Color;
  descriptionColor: Color;
} {
  const evaluate = (
    length: number,
    idealMin: number,
    idealMax: number,
  ): Color => {
    if (length >= idealMin && length <= idealMax) {
      return "primary";
    } else if (
      (length >= idealMin - 5 && length < idealMin) ||
      (length > idealMax && length <= idealMax + 10)
    ) {
      return "warning";
    } else {
      return "error";
    }
  };

  const titleResult = evaluate(metaTitle.length, 50, 60);
  const descriptionResult = evaluate(metaDescription.length, 150, 160);

  return {
    titleColor: titleResult,
    descriptionColor: descriptionResult,
  };
}

export function SEOPreview({
  title,
  description,
  url,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard,
}: SEOPreviewProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  // text-error text-warning
  const result = checkSEOLength(title, description);
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <Typography
          variant="h6"
          component="h2"
          className="mb-2 flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          Live Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See how your content will appear across platforms
        </Typography>
      </div>

      <div className="p-6">
        <Box sx={{ width: "100%" }}>
          <Tabs value={tabValue} onChange={handleTabChange} className="mb-4">
            <Tab label="Google" />
            <Tab label="Facebook" />
            <Tab label="Twitter" />
          </Tabs>

          {tabValue === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4">
                <div className="space-y-1">
                  <div className="text-xs text-green-700">{url}</div>
                  <div className="cursor-pointer text-lg font-medium text-blue-600 hover:underline break-all">
                    {title || "Page Title"}
                  </div>
                  <div className="text-sm leading-relaxed text-gray-600 break-all">
                    {description || "Meta description will appear here..."}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground space-y-1 text-xs">
                <div>
                  <span className={`text-${result.titleColor}`}>
                    Title: {title.length}/60 characters
                  </span>
                </div>
                <div>
                  <span className={`text-${result.descriptionColor}`}>
                    Description: {description.length}/160 characters
                  </span>
                </div>
              </div>
            </div>
          )}

          {tabValue === 1 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border bg-white">
                {ogImage && (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <Image
                      src={ogImage || "/placeholder.svg"}
                      alt="OG Preview"
                      width={600}
                      height={315}
                      className="max-h-full max-w-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2 p-4">
                  <div className="text-xs uppercase text-gray-500">
                    {new URL(url).hostname}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {ogTitle || title || "Page Title"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {ogDescription ||
                      description ||
                      "Meta description will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tabValue === 2 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border bg-white">
                {twitterImage && twitterCard === "summary_large_image" && (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <Image
                      src={twitterImage || "/placeholder.svg"}
                      alt="Twitter Preview"
                      width={600}
                      height={315}
                      className="max-h-full max-w-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2 p-4">
                  <div className="font-semibold text-gray-900">
                    {twitterTitle || title || "Page Title"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {twitterDescription ||
                      description ||
                      "Meta description will appear here..."}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new URL(url).hostname}
                  </div>
                </div>
                {twitterImage && twitterCard === "summary" && (
                  <div className="flex justify-end p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
                      <Image
                        src={twitterImage || "/placeholder.svg"}
                        alt="Twitter Preview"
                        width={64}
                        height={64}
                        className="max-h-full max-w-full rounded object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  label={twitterCard || "summary_large_image"}
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}
