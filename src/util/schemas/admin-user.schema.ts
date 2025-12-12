import { z } from "zod";
import { emailSchema, nameSchema, phoneSchema } from "./schemas";
import { RegisterCategory } from "@/constants/enums/register-category.enum";

const roleOptionSchema = z.object({
  value: z.uuid({ message: "Role value must be a valid UUID" }),
  label: z.string().min(1, { message: "Role label cannot be empty" }),
});

const baseSchema = z.object({
  id: z.uuid({ message: "Id must be a valid UUID" }).optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
  email: emailSchema,
  phone: phoneSchema,
  title: nameSchema,
  category: z.enum(Object.values(RegisterCategory)),
  departmentId: z
    .uuid({ message: "DepartmentId must be a valid UUID" })
    .optional(),
  rolesIds: z.array(roleOptionSchema).optional(),
});

// Apply cross-field validation
export const userFormSchema = baseSchema.superRefine((data, ctx) => {
  // Condition 1: Department is required only for ADMIN_EMPLOYEE.
  if (data.id) {
    return;
  }

  if (data.category === RegisterCategory.ADMIN_EMPLOYEE && !data.departmentId) {
    ctx.addIssue({
      code: "custom", // instead of z.ZodIssueCode.custom
      message: "Department is required for Admin Employees.",
      path: ["departmentId"],
    });
  }

  // Condition 2: Roles are required for everyone EXCEPT SUPER_ADMIN.
  if (data.category !== RegisterCategory.SUPER_ADMIN) {
    if (!data.rolesIds || data.rolesIds.length === 0) {
      ctx.addIssue({
        code: "custom", // instead of z.ZodIssueCode.custom
        message: "At least one role is required.",
        path: ["rolesIds"],
      });
    }
  }
});

export type InviteAdminFormValues = z.infer<typeof userFormSchema>;
