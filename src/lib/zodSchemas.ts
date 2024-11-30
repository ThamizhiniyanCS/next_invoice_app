import { z } from "zod";

export const NewInvoiceFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  value: z.string().min(2).max(50),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(150, {
      message: "Description must not be longer than 150 characters.",
    }),
});
