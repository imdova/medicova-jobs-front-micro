import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { usePermissions } from "@/hooks/usePermissions";

// Forms and Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { nameSchema } from "@/util/schemas/schemas";
import { formatDate } from "@/util";
import { ColumnDef } from "@tanstack/react-table";
import { createRole, updateRole } from "@/store/slices/roles.slice";
import PermissionsTable from "../settings/PermissionsManager";
import { mapKeysToIds } from "../admin/settings/PermissionCheckboxList";

// Types
import { Role } from "@/types/next-auth";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";

// UI Components
import { Pen, ShieldPlus } from "lucide-react";
import { Separator } from "@/components/UI/separator";
import { Button } from "@/components/UI/button";
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
} from "@/components/UI/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/UI/sheet";
import { Checkbox } from "@/components/UI/checkbox";
import { Textarea } from "@/components/UI/textarea";

export const getRolesColumns = (): ColumnDef<Role>[] => [
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
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => row.original.permissions.length,
  },
  {
    id: "hidden",
    accessorKey: "permissions",
    header: "hidden",
    enableHiding: true,
    enableColumnFilter: true,
    accessorFn: (row) =>
      row.permissions.map((permission) => permission.name).join(", "),
    cell: () => null,
  },
  {
    header: "Actions",
    size: 50,
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* <Button variant="outline" size="iconSm">
          <ShieldPlus />
        </Button> */}
        <RoleDialogForm defaultValues={row.original}>
          <Button variant="outline" size="iconSm">
            <Pen />
          </Button>
        </RoleDialogForm>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

const formSchema = z.object({
  name: nameSchema,
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be at most 255 characters long"),
  permissions: z.array(z.string()).min(1, "Permissions are required"),
});

export const RoleDialogForm = ({
  defaultValues,
  children,
}: {
  defaultValues?: Role;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { permissions } = usePermissions();
  const [open, setOpen] = useState(false); // 👈 controlled state

  const isEdit = Boolean(defaultValues);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      permissions: defaultValues?.permissions
        ? defaultValues?.permissions.map((permission) => permission.key)
        : [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const oldPermissions = values?.permissions as Permission_Keys[];
    values.permissions = mapKeysToIds(permissions, oldPermissions);
    console.log("🚀 ~ onSubmit ~ values:", values);
    if (isEdit && defaultValues?.id) {
      dispatch(
        updateRole({
          id: defaultValues?.id,
          updates: {
            name: values.name,
            description: values.description,
            permissionsIds: values.permissions,
          },
        }),
      );
    } else {
      dispatch(
        createRole({
          name: values.name,
          description: values.description,
          permissionsIds: values.permissions,
          forUserType: "admin",
          companyId: undefined,
        }),
      );
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
          <DialogTitle>{isEdit ? "Edit" : "Add"} Role</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit a role in your organization."
              : "Add a new role to your organization."}
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
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="eg. Super Admin, Admin, Frontend, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="describe what this role does"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Permissions{" "}
                      <span className="text-muted-foreground text-xs">
                        ({field.value?.length || 0})
                      </span>
                    </FormLabel>
                    <PermissionSheetField
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <Button type="button" variant="outline" className="w-fit">
                        <ShieldPlus />
                        Add Permission
                      </Button>
                    </PermissionSheetField>
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
                {isEdit ? "Update Role" : "Save Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const PermissionSheetField = ({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Permissions to Role</SheetTitle>
          <SheetDescription>
            Select the permissions you want to add to this role.
          </SheetDescription>
        </SheetHeader>
        <PermissionsTable value={value} onChange={onChange} />
      </SheetContent>
    </Sheet>
  );
};
