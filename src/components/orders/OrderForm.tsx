
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.coerce.number().int().positive({ message: "Quantity must be a positive number" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      notes: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await createOrder(values);
      toast({
        title: "Order created successfully",
        description: `Your order #${response.orderId} has been placed.`,
      });
      navigate(`/order/${response.orderId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create order",
        description: "There was an error processing your order. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any special requirements or notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        All orders are subject to our Terms and Conditions.
      </CardFooter>
    </Card>
  );
};

export default OrderForm;
