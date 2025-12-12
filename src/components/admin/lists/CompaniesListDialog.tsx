import Avatar from "@/components/UI/Avatar";
import { Company } from "@/types";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import { BookUser, MapPin } from "lucide-react";
import { formatLocation } from "@/util/general";

const CompaniesListDialog: React.FC<{
  companies: Company[];
}> = ({ companies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Companies</DialogTitle>
          <DialogDescription>
            This is the list of companies assigned to this employee
          </DialogDescription>
        </DialogHeader>
        <div className="scroll-bar-minimal max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
          {companies?.map((company) => {
            const location = formatLocation(company);
            return (
              <div
                key={company.id}
                className="rounded-base flex items-center gap-2 border p-2"
              >
                <Avatar size={45} src={company.avatar} alt={company.name} />
                <div>
                  <Link
                    href={`/admin/employers/${company.username}`}
                    className="hover:underline"
                  >
                    {company.name}
                  </Link>
                  <div className="flex space-x-2">
                    <p className="text-muted-foreground text-xs">
                      <MapPin className="text-primary mr-1 inline-block h-4 w-4" />
                      {location}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      <BookUser className="text-primary mr-1 inline-block h-4 w-4" />
                      {company.companySectorName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>

      <div className="flex -space-x-3 text-xs">
        {companies?.length === 0 && 0}
        {companies?.slice(0, 4)?.map((company) => (
          <Tooltip key={company.id}>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1"
            >
              <Avatar size={30} src={company.avatar} alt={company.name} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{company.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {companies?.length > 4 ? (
          <Tooltip>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1"
            >
              <Avatar
                className="bg-gray-300"
                size={30}
                fallback={"+" + (companies?.length - 4).toString() || ""}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {companies
                  .slice(4)
                  ?.map((company) => company.name)
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : companies?.length > 0 ? (
          <Tooltip>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1"
            >
              <Avatar className="bg-gray-300" size={30} fallback={"View"} />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {companies
                  .slice(4)
                  ?.map((company) => company.name)
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </Dialog>
  );
};

export default CompaniesListDialog;
