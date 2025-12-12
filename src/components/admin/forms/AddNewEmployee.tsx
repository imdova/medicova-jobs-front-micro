import { Option } from "@/types";
import { AdminUser } from "@/types/admin";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
import { useEffect, useRef, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/UI/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/form";
import { Button } from "@/components/UI/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/UI/sheet";
import { Separator } from "@/components/UI/separator";
import { Input } from "@/components/UI/input";
import { ProfileImageField } from "@/components/UI/ProfileImageField";
import PhoneNumberInput from "@/components/UI/phoneNumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import MultipleSelector from "@/components/UI/multi-select";
import {
  InviteAdminFormValues,
  userFormSchema,
} from "@/util/schemas/admin-user.schema";
import { deepEqual } from "@/util/forms";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { inviteAdmin, updateAdminProfile } from "@/store/slices/admins.slice";
import { User } from "next-auth";

const categoriesOptions: Option[] = [
  {
    label: "Super Admin",
    value: RegisterCategory.SUPER_ADMIN,
  },
  {
    label: "Admin",
    value: RegisterCategory.GENERAL_ADMIN,
  },
  {
    label: "Account Manager",
    value: RegisterCategory.ACCOUNT_MANAGER,
  },
  {
    label: "Employee",
    value: RegisterCategory.ADMIN_EMPLOYEE,
  },
];

interface AddNewEmployeeDialogProps {
  defaultValues?: AdminUser;
  children: React.ReactNode;
  user: User;
}
interface AddNewEmployeeFormProps {
  defaultValues?: AdminUser;
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}

export const AddNewEmployeeDialog: React.FC<AddNewEmployeeDialogProps> = ({
  defaultValues,
  children,
  user,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AddNewEmployeeForm
      defaultValues={defaultValues}
      open={open}
      setOpen={setOpen}
      user={user}
    >
      {children}
    </AddNewEmployeeForm>
  );
};

export const AddNewEmployeeForm: React.FC<AddNewEmployeeFormProps> = ({
  defaultValues: initialValues,
  open,
  setOpen,
  user,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.admins);
  const { roles, departments } = usePermissions();
  const isEdit = Boolean(initialValues?.id);

  const defaultValues: InviteAdminFormValues = {
    id: initialValues?.id,
    avatar: initialValues?.avatar,
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    title: initialValues?.title ?? "",
    rolesIds: [],
    category: RegisterCategory.ADMIN_EMPLOYEE,
  };

  const form = useForm<InviteAdminFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onSubmit",
    defaultValues: defaultValues,
  });

  const prevDefaultsRef = useRef(defaultValues);

  useEffect(() => {
    if (open) {
      const hasChanged = !deepEqual(prevDefaultsRef.current, defaultValues);
      if (hasChanged) {
        form.reset(defaultValues);
        prevDefaultsRef.current = defaultValues;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  async function onSubmit(values: InviteAdminFormValues) {
    if (isEdit) {
      dispatch(
        updateAdminProfile({
          id: initialValues?.id!,
          updates: {
            firstName: values.firstName,
            lastName: values.lastName,
            title: values.title,
            phone: values.phone,
          },
        }),
      );
    } else {
      if (values.category === RegisterCategory.SUPER_ADMIN) {
        const superAdminRole = roles.find(
          (role) => role.name === "Super Admin",
        );
        values.rolesIds = [
          {
            value: superAdminRole?.id || "",
            label: superAdminRole?.name || "",
          },
        ];
      }
      dispatch(inviteAdmin({ values, user }));
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {isEdit ? "Edit" : "Add"} Medicova Employee
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Edit a employee in your organization."
              : "Add a new employee to your organization."}
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            noValidate
          >
            <div className="grid gap-4 px-5">
              <div className="grid grid-cols-12 items-start gap-3">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProfileImageField
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="col-span-5">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="eg. James"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="col-span-5">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="eg. Bond"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className={isEdit ? "col-span-12" : "col-span-6"}>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="eg. CEO, Sales, etc."
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isEdit && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="eg. johndoe@example.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneNumberInput
                        placeholder="eg. +20123456789"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Job Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Job Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!isEdit &&
                form.watch("category") !== RegisterCategory.SUPER_ADMIN && (
                  <FormField
                    control={form.control}
                    name="rolesIds"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Role</FormLabel>
                        <MultipleSelector
                          defaultOptions={roles.map((role) => ({
                            value: role.id,
                            label: role.name,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select admin roles"
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No roles found
                            </p>
                          }
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              {!isEdit &&
                form.watch("category") === RegisterCategory.ADMIN_EMPLOYEE && (
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Department</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Job Level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.id}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>

            <Separator />
            <DialogFooter className="px-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || loading}
              >
                {loading
                  ? "Loading..."
                  : isEdit
                    ? "Update Employee"
                    : "Invite User To Join Medicova"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
