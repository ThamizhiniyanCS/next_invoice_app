"use server";

import { Invoices, type Status } from "@/db/schema";
import { db } from "@/db";
import { NewInvoiceFormSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function CreateNewInvoiceAction(
  formdata: z.infer<typeof NewInvoiceFormSchema>
) {
  /**
   * Checking whether the request is made with authentication
   */
  const { userId }: { userId: string | null } = await auth();
  if (!userId) return null;

  const parsed = await NewInvoiceFormSchema.safeParseAsync(formdata);

  if (parsed.success) {
    const value = Math.floor(parseFloat(parsed.data.value) * 100);
    const description = parsed.data.description;

    const results = await db
      .insert(Invoices)
      .values({ value, status: "open", description, userId })
      .returning({ id: Invoices.id });

    redirect(`/invoices/${results[0].id}`);
  } else {
    return {
      message: "Invalid data",
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
}

export async function UpdateInvoiceStatusAction(formdata: FormData) {
  /**
   * Checking whether the request is made with authentication
   */
  const { userId }: { userId: string | null } = await auth();
  if (!userId) return null;

  const id = formdata.get("id") as string;
  const status = formdata.get("status") as Status;

  await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  revalidatePath(`/invoices/${id}`, "page");
}

export async function DeleteInvoiceAction(formdata: FormData) {
  /**
   * Checking whether the request is made with authentication
   */
  const { userId }: { userId: string | null } = await auth();
  if (!userId) return null;

  const id = formdata.get("id") as string;

  await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  redirect("/dashboard");
}
