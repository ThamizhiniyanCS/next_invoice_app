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

/**
 *
 * Continue from 01:20:11 - List Invoices in a DataTable
 */

export default function Home() {
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
        <TableBody>
          <TableRow>
            <TableCell className="text-left font-bold p-4">10/20/30</TableCell>
            <TableCell className="text-left font-bold p-4">Whoami</TableCell>
            <TableCell className="text-left p-4">whoami@root.com</TableCell>
            <TableCell className="text-center p-4">
              <Badge className="rounded-full">Open</Badge>
            </TableCell>
            <TableCell className="text-right p-4">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
