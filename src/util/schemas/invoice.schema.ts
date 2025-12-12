import { z } from "zod";

export const invoiceSchema = z.object({
  name: z.string().trim().min(1, "Invoice name is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_type: z.enum(["one-time", "recurring"]),
  from: z.object({
    name: z.string().trim().min(1, "Item name is required"),
    address: z.string().trim().min(1, "Item description is required"),
    email: z.string().trim().min(1, "Item description is required"),
    phone: z.string().trim().min(1, "Item description is required"),
  }),
  to: z.object({
    name: z.string().trim().min(1, "Item name is required"),
    address: z.string().trim().min(1, "Item description is required"),
    email: z.string().trim().min(1, "Item description is required"),
    phone: z.string().trim().min(1, "Item description is required"),
  }),
  employer_id: z.string().min(1, "Employer ID is required"),
  items: z.array(
    z.object({
      name: z.string().trim().min(1, "Item name is required"),
      description: z.string().trim().min(1, "Item description is required"),
      price: z.number().min(1, "Item price is required"),
      quantity: z.number().min(1, "Item quantity is required"),
      total: z.number(),
    }),
  ),
  subtotal: z.number().min(1, "Subtotal is required"),
  discount: z.number().min(1, "Discount is required"),
  tax: z.number().min(1, "Tax is required"),
  total: z.number().min(1, "Total is required"),
  currency: z.string().min(1, "Currency is required"),
});
