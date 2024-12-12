import { type NextRequest } from "next/server";
import Stripe from "stripe";
import { UpdateInvoiceStatusAction } from "@/lib/actions";
import { redirect } from "next/navigation";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET_KEY));

export async function GET(request: NextRequest) {
  console.log("[+] Success");
  const searchParams = request.nextUrl.searchParams;
  const invoice_id = searchParams.get("invoice_id");
  const session_id = searchParams.get("session_id");

  if (Number.isNaN(invoice_id)) {
    throw new Error("Invalid Invoice ID");
  }

  let isError = false;

  const { payment_status } = await stripe.checkout.sessions.retrieve(
    String(session_id)
  );

  if (payment_status !== "paid") {
    isError = true;
  } else {
    const formData = new FormData();
    formData.append("id", String(invoice_id));
    formData.append("status", "paid");
    await UpdateInvoiceStatusAction(formData);
  }

  if (isError) {
    redirect(`/invoices/${invoice_id}/payment?error=${isError}`);
  } else {
    redirect(`/invoices/${invoice_id}`);
  }
}
