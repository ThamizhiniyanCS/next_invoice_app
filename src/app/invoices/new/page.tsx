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
import { NewInvoiceFormSchema } from "@/lib/zodSchemas";
import { CreateNewInvoiceAction } from "@/lib/actions";
import { Loader } from "lucide-react";

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

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof NewInvoiceFormSchema>) {
    await CreateNewInvoiceAction(values);
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
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
            disabled={isSubmitting}
          >
            {!isSubmitting && <span>Submit</span>}
            {isSubmitting && <Loader className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewInvoiceForm;
