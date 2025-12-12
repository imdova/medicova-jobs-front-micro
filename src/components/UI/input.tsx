import { cn } from "@/util";
import * as React from "react";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
  {
    variants: {
      variant: {
        default:
          "h-9 border-input focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        ghost1:
          "border-0 shadow-none h-auto p-0 focus-visible:bg-white focus-visible:ring-0 focus-visible:border-0 placeholder:text-muted-foreground/70 rounded-none ",
        ghost2:
          "border-0 shadow-none h-auto p-0 focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] placeholder:text-muted-foreground/70 rounded-none ",
        outline:
          "h-9 border border-input bg-background focus-visible:ring-[3px] focus-visible:ring-primary/50",
        filled:
          "h-9 border border-input bg-muted text-foreground focus-visible:border-primary focus-visible:ring-[3px]",
      },
      fieldSize: {
        sm: "h-8 text-sm px-2",
        md: "h-9 text-base px-3",
        lg: "h-10 text-lg px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      fieldSize: "md",
    },
  },
);

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

function Input({ className, variant, fieldSize, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, fieldSize }), className)}
      {...props}
    />
  );
}

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        placeholder="Password"
        className={cn("pe-9", className)}
        {...props}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible((prevState) => !prevState)}
        className="text-muted-foreground/70 focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
      >
        {isVisible ? <EyeOff /> : <Eye />}
        <span className="sr-only">
          {isVisible ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}

export { Input, PasswordInput };
