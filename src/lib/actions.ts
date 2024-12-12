"use server";

import { Invoices, Customers, type Status } from "@/db/schema";
import { db } from "@/db";
import { NewInvoiceFormSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET_KEY));

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
        and(
          eq(Invoices.id, Number.parseInt(id)),
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, Number.parseInt(id)),
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

export async function CreatePaymentAction(formData: FormData) {
  const headersList = headers();
  const origin = (await headersList).get("origin");
  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  /**
   * https://docs.stripe.com/checkout/quickstart?client=next
   * https://docs.stripe.com/api/checkout/sessions/create#create_checkout_session-line_items
   * https://docs.stripe.com/api/checkout/sessions/create#create_checkout_session-line_items-price_data
   */
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_RNHhUtAgGDEjKn",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid Session");
  }

  redirect(session.url);
}
