import { db } from "@/db";
import { Invoices } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Home() {
  const results = await db.select().from(Invoices);

  return (
    <div className="flex flex-col justify-start h-full w-full text-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold">Invoices</h1>
        <p>
          <Button variant="ghost" className="inline-flex gap-2" asChild>
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </p>
      </div>

      <Table className="">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left p-4">Date</TableHead>
            <TableHead className="text-left p-4">Customer</TableHead>
            <TableHead className="text-left p-4">Email</TableHead>
            <TableHead className="text-center p-4">Status</TableHead>
            <TableHead className="text-right p-4">Value</TableHead>
          </TableRow>
        </TableHeader>
        {results.map((result) => (
          <TableBody key={result.id}>
            <TableRow>
              <TableCell className="text-left font-bold p-0">
                <Link href={`/invoices/${result.id}`} className="block p-4">
                  {new Date(result.createTimeStamp).toLocaleDateString()}
                </Link>
              </TableCell>
              <TableCell className="text-left font-bold p-0">
                <Link href={`/invoices/${result.id}`} className="block p-4">
                  whoami
                </Link>
              </TableCell>
              <TableCell className="text-left p-0">
                <Link href={`/invoices/${result.id}`} className="block p-4">
                  whoami@root.com
                </Link>
              </TableCell>
              <TableCell className="text-center p-0">
                <Link href={`/invoices/${result.id}`} className="block p-4">
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
                </Link>
              </TableCell>
              <TableCell className="text-right p-0">
                <Link href={`/invoices/${result.id}`} className="block p-4">
                  ${(result.value / 100).toFixed(2)}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </div>
  );
}
