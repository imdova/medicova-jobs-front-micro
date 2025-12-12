import { PaintBucket } from "lucide-react";
import { BOX_SHADOWS_OPTIONS } from "@/constants/blog";
import { extractUrl, getValue } from "@/util/blog";
import SectionCollapse from "../SectionCollapse";
import { ColorSelector } from "../ColorSelector";
import { UploadAreaField } from "@/components/form/FormModal/fields/upload-area-field";
import { Selector } from "../Selector";
import { StyleSlider } from "../styleSlider";
import { useBlogStore } from "@/lib/blog/blog-store";

const StyleBackground: React.FC = () => {
  const { getActiveBlock, updateBlockStyle, currentBreakpoint } =
    useBlogStore();
  const block = getActiveBlock();
  const styles = block?.styles || {};
  return (
    <SectionCollapse
      title={"Background"}
      defaultValue={true}
      icon={<PaintBucket size={16} className="text-primary" />}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Background Color</p>
          <ColorSelector
            value={getValue(
              styles?.background?.backgroundColor || "",
              currentBreakpoint,
            )}
            onChange={(value) =>
              updateBlockStyle("background", "backgroundColor", value)
            }
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Background Image</p>
          <UploadAreaField
            field={{
              name: "backgroundImage",
              type: "text",
              fileProps: {
                acceptedFileTypes: ["image/jpeg", "image/png"],
                maxFiles: 1,
                maxSize: 5,
                previewType: "image",
                urlField: true,
                autoUpload: true,
              },
            }}
            controllerField={{
              value: extractUrl(
                String(styles?.background?.backgroundImage || ""),
              ),
              onChange: (value) =>
                updateBlockStyle(
                  "background",
                  "backgroundImage",
                  `url(${value})`,
                ),
            }}
          />
        </div>
        {styles?.background?.backgroundImage && (
          <>
            <Selector
              label="Background Size"
              value={styles?.background?.backgroundSize}
              placeholder="Select Font Family"
              onChange={(value) =>
                updateBlockStyle("background", "backgroundSize", value)
              }
              options={["cover", "contain", "auto"].map((x) => ({
                value: x,
                label: x,
              }))}
            />
            <Selector
              label="Background Repeat"
              value={styles?.background?.backgroundRepeat || "no-repeat"}
              placeholder="Select Font Family"
              onChange={(value) =>
                updateBlockStyle("background", "backgroundRepeat", value)
              }
              options={["no-repeat", "repeat", "repeat-x", "repeat-y"].map(
                (x) => ({ value: x, label: x }),
              )}
            />
          </>
        )}

        <StyleSlider
          label="Opacity"
          units={[
            {
              value: "",
              resetValue: "1",
              min: 0,
              max: 1,
              step: 0.1,
              regex: "",
            },
          ]}
          responsive={true}
          value={styles?.background?.opacity || "1"}
          onChange={(value) => updateBlockStyle("background", "opacity", value)}
        />
        <Selector
          label="Box Shadow"
          value={
            styles?.background?.boxShadow || "0px 0px 0px rgba(0, 0, 0, 0)"
          }
          placeholder="Select Font Family"
          onChange={(value) =>
            updateBlockStyle("background", "boxShadow", value)
          }
          options={BOX_SHADOWS_OPTIONS}
        />
      </div>
    </SectionCollapse>
  );
};

export default StyleBackground;
