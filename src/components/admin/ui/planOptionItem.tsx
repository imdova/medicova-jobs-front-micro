import { Badge } from "@/components/UI/Badge";
import { BadgeVariant } from "@/types";
import { SubscriptionPlan } from "@/types/finance";
import { cn } from "@/util";
import { SelectChangeEvent } from "@mui/material";

interface PlanItemProps {
  plan: SubscriptionPlan;
  onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  value?: string;
}

const badgeVariant: Record<string, BadgeVariant> = {
  Free: "neutral",
  Basic: "info",
  Pro: "success",
  Business: "premium",
};

const PlanOptionItem: React.FC<PlanItemProps> = ({ plan, onChange, value }) => {
  const isSelected = plan.id === value;
  const clickHandler = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: plan.id },
      } as unknown as SelectChangeEvent<string>;
      onChange(syntheticEvent, null);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border bg-white p-4 text-sm shadow-soft transition-all",
        isSelected ? "border-primary bg-primary/10" : "hover:bg-gray-50",
      )}
      onClick={clickHandler}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="text-lg font-bold">{plan.name}</div>
          {plan.badge && (
            <Badge variant={badgeVariant[plan.name]} >
              {plan.badge}
            </Badge>
          )}
        </div>
        <div className="mb-1 font-bold">
          {plan.discountedPrice === 0
            ? "Free"
            : `${plan.currency} ${plan.discountedPrice?.toLocaleString()}`}
          {plan.discountedPrice !== plan.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {plan.currency} {plan.price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <p>
        {plan.features.map((feature) => (
          <span
            className="inline-block rounded-lg mr-1 mb-1 bg-primary/10 p-1 px-2 text-xs"
            key={feature.name}
          >
            {feature.name}
          </span>
        ))}
      </p>
    </div>
  );
};

export default PlanOptionItem;
