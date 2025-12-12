import { PlusIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/UI/AvatarHelper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface AvatarGroupDropdownProps {
  avatars: {
    src?: string | null;
    fallback: string;
    name: string;
  }[];
}

const AvatarGroupDropdown: React.FC<AvatarGroupDropdownProps> = ({
  avatars,
}) => {
  if (!avatars.length) return "-";
  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, 3).map((avatar, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <Avatar className="ring-background ring-2 transition-all duration-300 ease-in-out hover:z-1 hover:-translate-y-1 hover:shadow-md">
              <AvatarImage src={avatar.src || ""} alt={avatar.name} />
              <AvatarFallback className="text-xs">
                {avatar.fallback}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{avatar.name}</TooltipContent>
        </Tooltip>
      ))}
      {avatars.length > 3 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-muted has-focus-visible:ring-ring/50 ring-background flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full ring-2">
              <PlusIcon className="size-4" />
              <span className="sr-only">Add</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {avatars.slice(3).map((avatar, index) => (
              <DropdownMenuItem key={index}>
                <Avatar>
                  <AvatarImage src={avatar.src || ""} alt={avatar.name} />
                  <AvatarFallback className="text-xs">
                    {avatar.fallback}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{avatar.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AvatarGroupDropdown;
