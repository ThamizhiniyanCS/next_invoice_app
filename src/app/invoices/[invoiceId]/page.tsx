import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./invoice";

const InvoiceDetail = async ({ params }: { params: { invoiceId: string } }) => {
  const { invoiceId } = await params;

  const { userId }: { userId: string | null } = await auth();

  if (!userId) return;

  const id = parseInt(invoiceId);

  if (isNaN(id)) throw new Error("Invalid Invoice ID");

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, id), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) notFound();

  return <Invoice invoice={result} />;
};

export default InvoiceDetail;
