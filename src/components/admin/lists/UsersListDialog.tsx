import Avatar from "@/components/UI/Avatar";
import Link from "next/link";
import { AdminUser } from "@/types/admin";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/UI/tooltip";

const UsersListDialog: React.FC<{
  admins: AdminUser[];
}> = ({ admins }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admins</DialogTitle>
          <DialogDescription>
            This is the list of admins assigned to this employee
          </DialogDescription>
        </DialogHeader>
        <div className="scroll-bar-minimal max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
          {admins?.map((user) => {
            return (
              <div
                key={user.id}
                className="rounded-base flex items-center gap-2 border p-2"
              >
                <Avatar size={45} src={user.avatar} alt={user.firstName} />
                <div>
                  <Link
                    href={`/admin/employers/${user.id}`}
                    className="hover:underline"
                  >
                    {user.firstName + " " + user.lastName}
                  </Link>
                  <p className="text-muted-foreground text-xs">{user.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>

      <div className="flex -space-x-3 text-xs">
        {admins?.length === 0 && 0}
        {admins?.slice(0, 4)?.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline-1"
            >
              <Avatar size={30} src={user.avatar} alt={user.firstName} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.firstName + " " + user.lastName}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {admins?.length > 4 ? (
          <Tooltip>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline-1"
            >
              <Avatar
                className="bg-gray-300"
                size={30}
                fallback={"+" + (admins?.length - 4).toString() || ""}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {admins
                  .slice(4)
                  ?.map((user) => user.firstName + " " + user.lastName)
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : admins?.length > 0 ? (
          <Tooltip>
            <TooltipTrigger
              onClick={openModal}
              className="hover:outline-primary rounded-full transition-all hover:z-10 hover:scale-125 hover:outline hover:outline-1"
            >
              <Avatar className="bg-gray-300" size={30} fallback={"View"} />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {admins
                  .slice(4)
                  ?.map((user) => user.firstName + " " + user.lastName)
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </Dialog>
  );
};

export default UsersListDialog;
