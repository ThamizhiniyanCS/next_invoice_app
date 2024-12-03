import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Container from "@/components/Container";

const InvoiceDetail = async ({ params }: { params: { invoiceId: string } }) => {
  const { invoiceId } = await params;

  const id = parseInt(invoiceId);

  if (isNaN(id)) throw new Error("Invalid Invoice ID");

  const [result] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  if (!result) notFound();

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center text-3xl gap-4 font-semibold">
            Invoice {result.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                result.status === "open" && "bg-blue-500",
                result.status === "paid" && "bg-green-500",
                result.status === "void" && "bg-zinc-500",
                result.status === "uncollectible" && "bg-red-500"
              )}
            >
              {result.status}
            </Badge>
          </h1>
        </div>

        <p className="text-4xl">$ {(result.value / 100).toFixed(2)}</p>
        <p className="mt-4">Checking this form</p>

        <h2 className="font-bold text-2xl mt-12">Billing Details</h2>

        <div className="flex mt-4">
          <p className="w-[150px]">Invoice ID</p>
          <p>{result.id}</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Invoice Date</p>
          <p>{new Date(result.createTimeStamp).toLocaleDateString()}</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Billing Name</p>
          <p>Will be updated !!!</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Billing Email</p>
          <p>Will be updated !!!</p>
        </div>
      </Container>
    </main>
  );
};

export default InvoiceDetail;
