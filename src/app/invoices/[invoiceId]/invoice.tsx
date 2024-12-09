"use client";

import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ChevronDown, Trash2, Ellipsis, CreditCard } from "lucide-react";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { UpdateInvoiceStatusAction, DeleteInvoiceAction } from "@/lib/actions";
import { useOptimistic } from "react";

const Invoice = ({
  invoice,
}: {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}) => {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      await UpdateInvoiceStatusAction(formData);
    } catch (error) {
      setCurrentStatus(originalStatus);
    }
  }

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center text-3xl gap-4 font-semibold">
            Invoice {invoice.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                currentStatus === "open" && "bg-blue-500",
                currentStatus === "paid" && "bg-green-500",
                currentStatus === "void" && "bg-zinc-500",
                currentStatus === "uncollectible" && "bg-red-500"
              )}
            >
              {currentStatus}
            </Badge>
          </h1>

          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Change Status <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map((status) => (
                  <DropdownMenuItem key={status.id}>
                    <form
                      action={handleOnUpdateStatus}
                      className="w-full h-full"
                    >
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={status.id} />
                      <button type="submit" className="w-full h-full text-left">
                        {status.label}
                      </button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button
                        type="submit"
                        className="w-full h-full text-left flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-auto" />
                        Delete
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <form
                      action={DeleteInvoiceAction}
                      className="w-full h-full"
                    >
                      <input type="hidden" name="payment" value={invoice.id} />
                      <button
                        type="submit"
                        className="w-full h-full text-left flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-auto" />
                        Payment
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                    <form
                      action={DeleteInvoiceAction}
                      className="w-full h-full"
                    >
                      <input type="hidden" name="id" value={invoice.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        className="w-full h-full text-left flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-auto" />
                        Delete
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <p className="text-4xl">$ {(invoice.value / 100).toFixed(2)}</p>
        <p className="mt-4">Checking this form</p>

        <h2 className="font-bold text-2xl mt-12">Billing Details</h2>

        <div className="flex mt-4">
          <p className="w-[150px]">Invoice ID</p>
          <p>{invoice.id}</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Invoice Date</p>
          <p>{new Date(invoice.createTimeStamp).toLocaleDateString()}</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Billing Name</p>
          <p>{invoice.customer.name}</p>
        </div>

        <div className="flex mt-4">
          <p className="w-[150px]">Billing Email</p>
          <p>{invoice.customer.email}</p>
        </div>
      </Container>
    </main>
  );
};

export default Invoice;
