import { Globe } from "lucide-react";
import Image from "next/image";
import { Typography } from "@mui/material";
import { TabsContent } from "@/components/UI/tabs";
import { AssetsData, BrandingData, ColorsData } from "@/types/branding";
import { getTextColorForBackground } from "@/util/branding";

interface BrandingPreviewProps {
  tabValue: number;
  data: BrandingData;
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

export function BrandingPreview({ tabValue, data }: BrandingPreviewProps) {
  const result = checkSEOLength(
    data.generalData.siteTitle,
    data.generalData.siteDescription,
  );
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

      <div className="p-3">
        <div className="w-full">
          {tabValue === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4">
                <div className="space-y-1">
                  <div className="text-xs text-green-700">
                    https://medicova.com
                  </div>
                  <div className="flex cursor-pointer items-center gap-2 text-lg font-medium text-blue-600 hover:underline">
                    {data.assetsData.favicon && (
                      <Image
                        src={data.assetsData.favicon || "/favicon.ico"}
                        alt="Favicon"
                        width={16}
                        height={16}
                      />
                    )}
                    {data.generalData.siteTitle || "Page Title"}
                  </div>
                  <div className="text-sm leading-relaxed text-gray-600">
                    {data.generalData.siteDescription ||
                      "Meta description will appear here..."}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground space-y-1 text-xs">
                <div>
                  <span className={`text-${result.titleColor}`}>
                    Title: {data.generalData.siteTitle.length}/60 characters
                  </span>
                </div>
                <div>
                  <span className={`text-${result.descriptionColor}`}>
                    Description: {data.generalData.siteDescription.length}/160
                    characters
                  </span>
                </div>
              </div>
            </div>
          )}
          {tabValue === 1 && <PreviewAssets assets={data.assetsData} />}
          {tabValue === 2 && <ColorPreview colors={data.colorsData} />}
        </div>
      </div>
    </div>
  );
}

const PreviewAssets: React.FC<{
  assets: AssetsData;
}> = ({ assets }) => {
  const assetLabels: { key: keyof AssetsData; label: string }[] = [
    { key: "primaryLogo", label: "Primary Logo" },
    { key: "secondaryLogo", label: "Secondary Logo" },
    { key: "footerIcon", label: "Footer Icon" },
    { key: "invoiceIcon", label: "Invoice Icon" },
    { key: "favicon", label: "Favicon" },
    { key: "appIcon", label: "App Icon" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assetLabels.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
          {assets[key] ? (
            <Image
              src={assets[key]}
              alt={label}
              width={100}
              height={100}
              className="h-24 w-24 object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ColorPreview: React.FC<{
  colors: ColorsData;
}> = ({ colors }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(colors).map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-2 gap-2 rounded-xl border bg-white p-2 shadow-sm"
        >
          <div className="col-span-2 flex items-center justify-between">
            <span className="line-clamp-1 text-xs font-medium text-gray-700">
              {key}
            </span>
          </div>
          {/* Background Preview */}
          <div
            className="rounded p-1"
            style={{
              backgroundColor: value,
            }}
          >
            <span
              className="text-xs"
              style={{
                color: getTextColorForBackground(value),
              }}
            >
              {value.toUpperCase()}
            </span>
          </div>

          {/* Border Preview */}
          <div
            className="rounded border p-1"
            style={{
              borderColor: value,
            }}
          >
            <span className="text-xs" style={{ color: value }}>
              Border
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
