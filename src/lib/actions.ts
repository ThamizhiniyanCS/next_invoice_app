"use server";

import { Invoices, Customers, type Status } from "@/db/schema";
import { db } from "@/db";
import { NewInvoiceFormSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function CreateNewInvoiceAction(
  formdata: z.infer<typeof NewInvoiceFormSchema>
) {
  /**
   * Checking whether the request is made with authentication
   */
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const parsed = await NewInvoiceFormSchema.safeParseAsync(formdata);

  if (parsed.success) {
    const value = Math.floor(parseFloat(parsed.data.value) * 100);
    const description = parsed.data.description;
    const name = parsed.data.name;
    const email = parsed.data.email;

    const [customer] = await db
      .insert(Customers)
      .values({ name, email, userId, organizationId: orgId || null })
      .returning({ id: Customers.id });

    const results = await db
      .insert(Invoices)
      .values({
        value,
        status: "open",
        description,
        userId,
        customerId: customer.id,
        organizationId: orgId || null,
      })
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
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const id = formdata.get("id") as string;
  const status = formdata.get("status") as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  revalidatePath(`/invoices/${id}`, "page");
}

export async function DeleteInvoiceAction(formdata: FormData) {
  /**
   * Checking whether the request is made with authentication
   */
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const id = formdata.get("id") as string;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect("/dashboard");
}
