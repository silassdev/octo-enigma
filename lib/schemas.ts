import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: z.enum(["active", "completed", "on-hold", "in-progress"]),
  budget: z.number().min(0, "Budget must be positive"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
});

export const UserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().max(500, "Bio is too long").optional(),
});

export const InvoiceSchema = z.object({
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
});
