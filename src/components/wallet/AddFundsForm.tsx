
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addFunds } from '@/services/walletService';
import { createCurrencyPayment, savePaymentDetails } from '@/services/paymentService';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  paymentMethod: z.enum(['stripe', 'crypto', 'other']),
});

type FormValues = z.infer<typeof formSchema>;

const AddFundsForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'stripe',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
      
      if (values.paymentMethod === 'stripe') {
        // Create Stripe payment session
        const paymentResponse = await createCurrencyPayment({
          amount: values.amount,
          currency: 'USD',
          description: 'Add funds to wallet',
          payment_method_types: ['card']
        });
        
        if (paymentResponse.sessionId) {
          // Save payment details
          await savePaymentDetails({
            payment_type: 'wallet_funding',
            payment_status: 'pending',
            payment_gateway: 'stripe',
            amount: values.amount,
            transaction_type: 'deposit',
            ref: `wallet-funding-${Date.now()}`,
            user_id: userDetails.id
          });
          
          // Redirect to Stripe checkout
          window.location.href = `https://checkout.stripe.com/pay/${paymentResponse.sessionId}`;
        } else {
          throw new Error('No session ID returned from payment service');
        }
      } else if (values.paymentMethod === 'crypto') {
        // For crypto payments, we'd redirect to the crypto payment page
        toast({
          title: "Crypto payment",
          description: "Redirecting to crypto payment gateway...",
        });
        
        // Implementation would redirect to crypto payment page
        // For now, just add funds directly for demo
        await addFunds({
          userId: userDetails.id,
          amount: values.amount
        });
        
        toast({
          title: "Funds added successfully",
          description: `${values.amount} USD has been added to your wallet.`,
        });
        
        form.reset({ amount: 0, paymentMethod: 'stripe' });
      } else {
        // Direct wallet funding (for testing purposes)
        await addFunds({
          userId: userDetails.id,
          amount: values.amount
        });
        
        toast({
          title: "Funds added successfully",
          description: `${values.amount} USD has been added to your wallet.`,
        });
        
        form.reset({ amount: 0, paymentMethod: 'stripe' });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add funds",
        description: error.message || "There was an error processing your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Funds</CardTitle>
        <CardDescription>Add money to your wallet to make purchases on our platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input {...field} type="number" step="0.01" min="0" className="pl-8" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="stripe" />
                        </FormControl>
                        <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="crypto" />
                        </FormControl>
                        <FormLabel className="font-normal">Cryptocurrency</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other Method</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || form.formState.isSubmitting}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Add Funds'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>Funds will be available immediately after processing.</p>
        <p className="mt-1">For larger amounts, please contact support.</p>
      </CardFooter>
    </Card>
  );
};

export default AddFundsForm;
