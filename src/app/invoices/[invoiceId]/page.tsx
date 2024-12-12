import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./invoice";

const InvoiceDetail = async ({
  params,
}: {
  params: { invoiceId: string };
}) => {
  const { invoiceId } = await params;

  const { userId, orgId } = await auth();

  if (!userId) return;

  const id = parseInt(invoiceId);

  if (isNaN(id)) throw new Error("Invalid Invoice ID");

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)))
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) notFound();

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
};

export default InvoiceDetail;
