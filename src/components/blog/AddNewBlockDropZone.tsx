import { useBlogStore } from "@/lib/blog/blog-store";
import DropZone from "./dropzone";
import { IconButton } from "@mui/material";
import { ArrowDown, ArrowRight, ChevronLeft, Plus, X } from "lucide-react";
import { CSSProperties, useState } from "react";
import { FLEX_BOX_OPTIONS } from "@/constants/blog";
import { parseLayout } from "@/util/blog";
import { generateId } from "@/util";
import { Block } from "@/types/blog";

type LayoutItem = {
  width: string;
  height?: string;
};

type LayoutResult = {
  style: {
    display?: "flex" | "grid";
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    flexDirection?: CSSProperties["flexDirection"];
    flexWrap?: "wrap";
  };
  items: LayoutItem[];
};

interface StepOneProps {
  option: LayoutResult | null;
  onClick: (option: LayoutResult | null, stepNum: number) => void;
}

const AddNewBlockDropZone = () => {
  const { blocks, handleDrop, addBlock } = useBlogStore();
  const [step, setStep] = useState<{
    num: number;
    option: LayoutResult | null;
  }>({
    num: 1,
    option: null,
  });

  const getBlock = (item: LayoutItem): Block => ({
    id: generateId(),
    type: "container",
    allowNesting: true,
    blocks: [],
    styles: {
      dimensions: {
        width: item.width,
        minHeight: item.height,
      },
    },
    content: "",
    level: 1,
  });
  const onClick = (option: LayoutResult | null, stepNum: number) => {
    if (stepNum === 4) {
      const blocks =
        Number(option?.items?.length) > 1
          ? option?.items?.map((item) => getBlock(item)) || []
          : [];
      addBlock({
        type: "container",
        data: {
          allowNesting: true,
          blocks,
          styles: {
            container: {
              display: option?.style.display,
              flexDirection: option?.style.flexDirection,
              flexWrap: option?.style.flexWrap,
              gridTemplateColumns: option?.style.gridTemplateColumns,
              gridTemplateRows: option?.style.gridTemplateRows,
            },
            dimensions: {
              width: "100%",
            },
          },
        },
      });
      setStep({ num: 1, option: null });
    } else {
      setStep({ num: stepNum, option });
    }
  };

  return (
    <DropZone
      data={{
        path: String(blocks.length),
      }}
      onDrop={handleDrop}
      className="!h-full flex-grow border-2 border-dashed"
    >
      {step.num === 1 && <StepOne option={step.option} onClick={onClick} />}
      {step.num === 2 && <StepTwo option={step.option} onClick={onClick} />}
      {step.num === 3 && <StepThree option={step.option} onClick={onClick} />}
    </DropZone>
  );
};

const StepOne: React.FC<StepOneProps> = ({ onClick }) => {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center p-6">
      <div className="flex w-full items-center justify-center">
        <IconButton onClick={() => onClick(null, 2)} className="bg-gray-300">
          <Plus className="h-4 w-4" />
        </IconButton>
      </div>
      <p>Drag Block here</p>
    </div>
  );
};
const StepTwo: React.FC<StepOneProps> = ({ onClick }) => {
  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="flex justify-between">
        <IconButton className="invisible bg-gray-300">
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <IconButton
          onClick={() => onClick({ style: { display: "flex" }, items: [] }, 1)}
          className="bg-gray-300"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </div>
      <div>
        <p className="text-center text-sm text-muted-foreground">
          Which layout would you like to use?
        </p>
        <div className="flex items-center justify-center gap-5 p-5">
          <div
            onClick={() =>
              onClick({ style: { display: "flex" }, items: [] }, 3)
            }
          >
            <div className="group flex h-20 w-20 cursor-pointer gap-1">
              <div className="h-full flex-1 bg-gray-300 group-hover:bg-secondary"></div>
              <div className="flex h-full flex-1 flex-col gap-1">
                <div className="h-full flex-1 bg-gray-300 group-hover:bg-secondary"></div>
                <div className="h-full flex-1 bg-gray-300 group-hover:bg-secondary"></div>
              </div>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">Flexbox</p>
          </div>
          <div
            onClick={() =>
              onClick({ style: { display: "grid" }, items: [] }, 3)
            }
          >
            <div className="grid-row-2 group grid h-20 w-20 cursor-pointer grid-cols-2 border border-dashed border-gray-600 hover:border-transparent">
              <div className="border border-dashed group-hover:bg-secondary"></div>
              <div className="border border-dashed group-hover:bg-secondary"></div>
              <div className="border border-dashed group-hover:bg-secondary"></div>
              <div className="border border-dashed group-hover:bg-secondary"></div>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">Grid</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const StepThree: React.FC<StepOneProps> = ({ option, onClick }) => {
  const getStyle = (cols: number, rows: number): LayoutResult => ({
    style: {
      display: "grid",
      gridTemplateColumns: cols > 0 ? `repeat(${cols}, minmax(0, 1fr))` : "",
      gridTemplateRows: rows > 0 ? `repeat(${rows}, minmax(0, 1fr))` : "",
    },
    items: [],
  });

  const clickHandler = (cols: number, rows: number) => {
    const style = getStyle(cols, rows);
    onClick(style, 4);
  };
  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="flex justify-between">
        <IconButton onClick={() => onClick(option, 2)} className="bg-gray-300">
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <IconButton
          onClick={() => onClick({ style: { display: "flex" }, items: [] }, 1)}
          className="bg-gray-300"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </div>
      <div>
        <p className="text-center text-sm text-muted-foreground">
          Select your structure
        </p>
        {option?.style.display === "flex" && (
          <div className="grid grid-cols-4 items-center justify-center gap-5 p-5">
            {FLEX_BOX_OPTIONS?.map((item) => (
              <FlexItem key={item} item={item} onClick={onClick} />
            ))}
          </div>
        )}
        {option?.style.display === "grid" && (
          <div className="flex flex-wrap justify-center gap-5 p-5">
            <div
              onClick={() => clickHandler(2, 1)}
              className="group grid h-12 w-[77px] cursor-pointer grid-cols-2"
            >
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
            <div
              onClick={() => clickHandler(1, 2)}
              className="group grid h-12 w-[77px] cursor-pointer grid-rows-2"
            >
              <div className="border border-b-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
            <div
              onClick={() => clickHandler(3, 1)}
              className="group grid h-12 w-[77px] cursor-pointer grid-cols-3"
            >
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
            <div
              onClick={() => clickHandler(1, 3)}
              className="group grid h-12 w-[77px] cursor-pointer grid-rows-3"
            >
              <div className="border border-b-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-b-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
            <div
              onClick={() => clickHandler(2, 2)}
              className="group grid h-12 w-[77px] cursor-pointer grid-cols-2"
            >
              <div className="border border-b-0 border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-b-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
            <div
              onClick={() => clickHandler(3, 2)}
              className="group grid h-12 w-[77px] cursor-pointer grid-cols-3"
            >
              <div className="border border-b-0 border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-b-0 border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-b-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-r-0 border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
              <div className="border border-dashed border-gray-400 group-hover:border-white group-hover:bg-secondary"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FlexItemProps {
  item: string;
  onClick: (option: LayoutResult | null, stepNum: number) => void;
}
const FlexItem: React.FC<FlexItemProps> = ({ item, onClick }) => {
  const parsedLayout = parseLayout(item);
  const { style, items } = parsedLayout;
  return (
    <div
      style={style}
      onClick={() => onClick(parsedLayout, 4)}
      className="group h-12 w-20 cursor-pointer"
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            width: item.width,
            height: item.height,
            display: item.display,
            flexDirection: item.flexDirection,
          }}
          className="flex items-center justify-center border border-white bg-gray-300 group-hover:bg-secondary"
        >
          {items.length === 1 ? (
            style.flexDirection === "row" ? (
              <ArrowRight className="h-4 w-4 text-white" />
            ) : (
              <ArrowDown className="h-4 w-4 text-white" />
            )
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default AddNewBlockDropZone;
