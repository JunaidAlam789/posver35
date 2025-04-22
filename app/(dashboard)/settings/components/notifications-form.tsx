"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "sonner"

const notificationsFormSchema = z.object({
  orderUpdates: z.boolean().default(true).optional(),
  newProducts: z.boolean().default(true).optional(),
  stockAlerts: z.boolean().default(true).optional(),
  marketing: z.boolean().default(false).optional(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

const defaultValues: Partial<NotificationsFormValues> = {
  orderUpdates: true,
  newProducts: true,
  stockAlerts: true,
  marketing: false,
}

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationsFormValues) {
    toast.success("Notification preferences updated!")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="orderUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Order Updates</FormLabel>
                  <FormDescription>Receive notifications about your order status.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newProducts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>New Products</FormLabel>
                  <FormDescription>Get notified when new products are added.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Stock Alerts</FormLabel>
                  <FormDescription>Get notified when products are running low on stock.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormDescription>Receive emails about new products, features, and more.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update notifications</Button>
      </form>
    </Form>
  )
}
