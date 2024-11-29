"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NewInvoiceFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  value: z.string().min(2).max(50),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(150, {
      message: "Description must not be longer than 150 characters.",
    }),
});

const NewInvoiceForm = () => {
  const form = useForm<z.infer<typeof NewInvoiceFormSchema>>({
    resolver: zodResolver(NewInvoiceFormSchema),
    defaultValues: {
      name: "",
      email: "",
      value: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof NewInvoiceFormSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-col justify-start h-full w-full gap-6 max-w-5xl mx-auto my-12">
      <h1 className="text-5xl font-bold">Create New Invoice</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Billing Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  The name you want on your bill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Billing Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.com" {...field} />
                </FormControl>
                <FormDescription>
                  The email address you want on your bill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Value</FormLabel>
                <FormControl>
                  <Input placeholder="Value" {...field} />
                </FormControl>
                <FormDescription>
                  The value you want on your bill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a nice description."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The description you want on your bill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewInvoiceForm;
