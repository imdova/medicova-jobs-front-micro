import {
  basicBlocks,
  contentBlocks,
  layoutBlocks,
} from "@/constants/pagebuilder/blocks";
import { AddBlockProps, Block, BlockButton, BlogType } from "@/types/blog";
import { Alert, Collapse } from "@mui/material";
import { useRef, useState } from "react";
import Image from "next/image";
import { useDrag } from "react-dnd";
import { ChevronDown } from "lucide-react";
import { BLOG_TEMPLATE } from "@/constants/blog";
import { useBlogStore } from "@/lib/blog/blog-store";

const BlocksPanel: React.FC = () => {
  const { errors, setBlocks, addBlock } = useBlogStore();

  const BlockError = errors?.find((x) => x.field === "content.blocks");

  return (
    <div className="mt-4">
      <div>
        {BlockError && <Alert severity="error">{BlockError?.message}</Alert>}

        {BLOG_TEMPLATE && (
          <BlockGroup title="Basic Elements" isOpen={true} addBlock={addBlock}>
            <div className="grid grid-cols-2 gap-2">
              <BlogTemplateCard
                item={BLOG_TEMPLATE}
                onClick={() => setBlocks(BLOG_TEMPLATE.content.blocks)}
              />
            </div>
          </BlockGroup>
        )}

        <BlockGroup
          title="Layout"
          blocks={layoutBlocks}
          isOpen={true}
          addBlock={addBlock}
        />
        <BlockGroup
          title="Basic"
          blocks={[...basicBlocks, ...contentBlocks]}
          isOpen={true}
          addBlock={addBlock}
        />
      </div>
    </div>
  );
};

export default BlocksPanel;

const BlockGroup: React.FC<{
  title: string;
  blocks?: BlockButton[];
  isOpen?: boolean;
  children?: React.ReactNode;
  addBlock: (props: AddBlockProps) => void;
}> = ({ title, blocks, isOpen: defaultIsOpen, children, addBlock }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen || false);
  return (
    <div className="space-y-2 border-b border-gray-200 p-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between py-2"
      >
        <h3 className="font-medium">{title}</h3>
        <ChevronDown
          className={`mx-2 h-4 w-4 duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <div className="grid grid-cols-2 gap-2">
          {blocks?.map((item, index) => (
            <AddBlockItem
              key={index}
              item={item}
              onClick={() =>
                addBlock({
                  type: item.type,
                  data: item.blockProps,
                })
              }
            />
          ))}
        </div>
        {children}
      </Collapse>
    </div>
  );
};

const AddBlockItem: React.FC<{ item: BlockButton; onClick: () => void }> = ({
  item,
  onClick,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: item.type,
    item: {
      type: item.type,
      ...item.blockProps,
      id: item.id,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);
  const Icon = item.icon;
  return (
    <div
      ref={ref as any}
      style={{ opacity }}
      key={item.id}
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 border p-2 text-muted-foreground hover:bg-gray-100"
      onClick={onClick}
    >
      <Icon className="h-8 w-8" />
      <span className="text-sm text-main">{item.label}</span>
    </div>
  );
};

const BlogTemplateCard: React.FC<{
  item: BlogType;
  onClick?: (blocks: Block[]) => void;
}> = ({ item, onClick }) => {
  return (
    <div>
      <button
        onClick={() => onClick?.(item.content.blocks)}
        className="grid h-[100px] w-[80px] grid-cols-1 grid-rows-1 overflow-hidden rounded-base"
      >
        <Image
          src={item.photo}
          width={80}
          height={100}
          alt={item.title}
          className="col-start-1 row-start-1 h-full object-cover"
        />
        <div className="col-start-1 row-start-1 flex h-full w-full items-center justify-center bg-black/20 p-2">
          <p className="line-clamp-2 text-center font-bold text-white">
            {item.title}
          </p>
        </div>
      </button>
      <p className="w-[80px] text-nowrap">{item.name}</p>
    </div>
  );
};
