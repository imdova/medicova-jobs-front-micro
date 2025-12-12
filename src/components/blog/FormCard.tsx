import { useBlogStore } from "@/lib/blog/blog-store";
import { FormItem } from "@/types/blog";
import { cn } from "@/util";
import { Button, IconButton } from "@mui/material";
import { X } from "lucide-react";

interface FormCardProps {
  form: FormItem;
}
const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const { selectForm, selectedFormId, removeForm } = useBlogStore();
  const isSelected = selectedFormId === form.id;

  return (
    <div className={`flex rounded border`}>
      <Button
        className={cn(
          "flex-1 justify-start rounded-none p-2 text-sm normal-case text-muted-foreground",
          isSelected && "bg-primary/10",
        )}
        onClick={() => selectForm(form.id)}
      >
        {form.name}{" "}
        <span className="text-xs">({form.fields.length} Fields)</span>
      </Button>

      <IconButton
        onClick={() => removeForm(form.id)}
        className="rounded-none border-l border-solid border-gray-200 p-3 hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  );
};

export default FormCard;
