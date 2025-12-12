import React, { useState } from "react";
import { Pen, Trash2, TriangleAlertIcon } from "lucide-react";
import { AdvancedColumnConfig, Department } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/store/slices/departments.slice";
import { Separator } from "@/components/UI/separator";
import { Button } from "../UI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nameSchema } from "@/util/schemas/schemas";
import { formatDate } from "@/util";
import { Checkbox } from "../UI/checkbox";

export const getDepartmentsColumns = (): AdvancedColumnConfig<Department>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "name",
    header: "Department Name",
  },
  {
    header: "Actions",
    size: 50,
    cell: ({ row }) => (
      <div className="flex gap-2">
        <DepartMentDialogForm defaultValues={row.original}>
          <Button variant="outline" size="iconSm">
            <Pen />
          </Button>
        </DepartMentDialogForm>
        <AlertDialogDepartmentDelete defaultValues={row.original}>
          <Button variant="outline" size="iconSm">
            <Trash2 />
          </Button>
        </AlertDialogDepartmentDelete>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

const formSchema = z.object({
  name: nameSchema,
});

export const DepartMentDialogForm = ({
  defaultValues,
  children,
}: {
  defaultValues?: Department;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false); // 👈 controlled state

  const isEdit = Boolean(defaultValues);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit && defaultValues?.id) {
      dispatch(updateDepartment({ id: defaultValues?.id, updates: values }));
    } else {
      dispatch(createDepartment(values));
    }
    setOpen(false);
    form.reset();
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 py-5 sm:max-w-md">
        <DialogHeader className="px-5">
          <DialogTitle>{isEdit ? "Edit" : "Add"} Department</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit a department in your organization."
              : "Add a new department to your organization."}
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            <div className="grid gap-4 px-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="eg. Marketing, Sales, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <DialogFooter className="px-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!form.formState.isDirty}>
                {isEdit ? "Update Department" : "Save Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const AlertDialogDepartmentDelete = ({
  defaultValues,
  children,
}: {
  defaultValues: Department;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    dispatch(deleteDepartment(defaultValues?.id));
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive size-6" />
          </div>
          <AlertDialogTitle className="text-center">
            Are you absolutely sure you want to delete {defaultValues?.name}{" "}
            department?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
          >
            Delete {defaultValues?.name} Department
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
