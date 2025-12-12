import { API_REGISTER_USER } from "@/api/users";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { Button } from "@/components/UI/button";
import LeaveConfirmationModal from "@/components/UI/LeaveConfirmationModal";
import ProfileImage from "@/components/UI/ProfileImage";
import { RegisterCategory } from "@/constants/enums/register-category.enum";
import { useFormState } from "@/hooks/useFormState";
import useIsLeaving from "@/hooks/useIsLeaving";
import { usePermissions } from "@/hooks/usePermissions";
import uploadFiles from "@/lib/files/imageUploader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeDrawer } from "@/store/slices/admins.slice";
import { Option, registerData } from "@/types";
import { Drawer } from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";

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

interface AddAdminUserForm {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
  title: string;
  rolesIds: string[];
  category: RegisterCategory;
  adminIds: string[];
  companyIds: string[];
  department?: string;
}

const AdminUserDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, defaultValues } = useAppSelector((state) => state.admins);
  const onClose = () => dispatch(closeDrawer());
  const { roles, departments } = usePermissions();
  const formMethods = useFormState(isOpen, [], defaultValues, "onChange");
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
    setValue,
    control,
    getValues,
  } = formMethods;

  const { isLeaving, setLeavingManually, handleUserDecision } = useIsLeaving({
    preventDefault: isOpen && isDirty,
  });

  const handleReset = () => {
    reset(defaultValues);
    onClose();
  };

  const handleCancel = () => {
    handleReset();
    onClose?.();
  };

  const submit = async (formData: AddAdminUserForm) => {
    if (formData.id) {
      // dispatch(editAdmin(formData));
      toast.error("Cant update Admin right now", {
        description: "there is error happened",
        position: "bottom-right",
      });
    } else {
      const body: registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: "admin",
        rolesIds: formData.rolesIds || [],
        category: formData.category,
        metaData: {
          title: formData.title,
          departmentId: formData.department,
        },
      };
      const response = await fetch(API_REGISTER_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error("Error Adding user", {
          description: errorResponse.message,
          position: "bottom-right",
          style: {
            "--normal-bg": "color-mix(in oklab, var(--destructive) 5%, white)",
            "--normal-text": "var(--destructive)",
            "--normal-border":
              "color-mix(in oklab, var(--destructive) 25%, white)",
          } as React.CSSProperties,
        });
        return;
      }
      toast.success("Admin Invitation Send Successfully", {
        description: "Ask the user to check their email for the invitation.",
        position: "bottom-right",
        style: {
          "--normal-bg": "color-mix(in oklab, var(--primary) 10%, white)",
          "--normal-text": "var(--primary)",
          "--normal-border": "var(--primary)",
        } as React.CSSProperties,
      });
    }
    onClose();
    reset(defaultValues);
  };

  const avatar = watch("avatar");
  const category: RegisterCategory = watch("category");

  const updateImage = async (file: File) => {
    const [avatar] = await uploadFiles([file]);
    setValue("avatar", avatar, { shouldDirty: true });
  };

  return (
    <>
      <LeaveConfirmationModal
        isOpen={isLeaving}
        onLeave={() => {
          handleUserDecision(true);
          handleCancel();
        }}
        onStay={() => {
          setLeavingManually(false);
          handleUserDecision(false);
        }}
      />
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            maxHeight: "100dvh",
            minWidth: { xs: "100%", md: "600px" },
          },
        }}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="">
            <h6 className="text-xl font-semibold">Add Admin User</h6>
            <p className="text-sm text-gray-500">
              Fill this information to invite a new admin user
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-2 p-4">
          <div className="flex items-start gap-4">
            <div>
              <ProfileImage
                currentImageUrl={avatar || ""}
                alt={" user image"}
                size="xLarge"
                onImageUpdate={updateImage}
                imageClassName="border-4 border-white shadow-soft"
              />
            </div>
            <div>
              <div className="flex w-full gap-3">
                <div className="flex-1">
                  <FormField
                    field={{
                      label: "First Name*",
                      name: "firstName",
                      type: "text",
                      required: true,
                    }}
                    control={control}
                    formValues={getValues()}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    field={{
                      label: "Last Name*",
                      name: "lastName",
                      type: "text",
                      required: true,
                    }}
                    control={control}
                    formValues={getValues()}
                  />
                </div>
              </div>
              <FormField
                field={{
                  label: "Title*",
                  name: "title",
                  type: "text",
                }}
                control={control}
                formValues={getValues()}
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <FormField
                field={{
                  label: "Email",
                  name: "email",
                  type: "email",
                  required: true,
                }}
                control={control}
                formValues={getValues()}
              />
            </div>
            <div className="flex-1">
              <FormField
                field={{
                  label: "Phone Number",
                  name: "phone",
                  type: "phone",
                  required: true,
                }}
                control={control}
                formValues={getValues()}
              />
            </div>
          </div>
          <FormField
            field={{
              label: "Job Level",
              name: "category",
              type: "select",
              options: categoriesOptions,
              required: true,
              onChange: (value) => {
                if (value === RegisterCategory.SUPER_ADMIN) {
                  setValue("role", "");
                }
                if (value !== RegisterCategory.ADMIN_EMPLOYEE) {
                  setValue("department", "");
                }
              },
            }}
            control={control}
            formValues={getValues()}
          />
          {category !== RegisterCategory.SUPER_ADMIN && (
            <FormField
              field={{
                label: "Role",
                name: "rolesIds",
                type: "select",
                multiple: true,
                options: roles.map((role) => ({
                  label: role?.name,
                  value: role?.id,
                })),
                required: true,
              }}
              control={control}
              formValues={getValues()}
            />
          )}
          {category === RegisterCategory.ADMIN_EMPLOYEE && (
            <FormField
              field={{
                label: "Department",
                name: "department",
                type: "select",
                options: departments.map((department) => ({
                  label: department?.name,
                  value: department?.id,
                })),
                required: true,
              }}
              control={control}
              formValues={getValues()}
            />
          )}
          <div className="!mt-5 flex justify-end border-t pt-4">
            <Button
              onClick={handleReset}
              variant="ghost"
              type="button"
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Drawer>
    </>
  );
};

export default AdminUserDrawer;
