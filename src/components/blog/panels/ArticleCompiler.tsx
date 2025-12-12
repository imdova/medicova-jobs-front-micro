import { BlogType, BreakPoints, FormItem } from "@/types/blog";
import BlockItem from "./BlockItem";

const ArticleCompiler: React.FC<{
  blog: BlogType;
  breakpoint?: BreakPoints;
  forms?: FormItem[];
}> = ({ blog, breakpoint, forms }) => {
  return (
    <div className="space-y-4">
      {blog.content.blocks.map((block) => (
        <BlockItem
          key={block.id}
          block={block}
          breakpoint={breakpoint}
          forms={forms}
        />
      ))}
    </div>
  );
};

export default ArticleCompiler;
