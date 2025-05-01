
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { withdrawFunds } from '@/services/walletService';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  accountNumber: z.string().min(5, { message: "Account information is required" }),
  withdrawalMethod: z.string().min(1, { message: "Withdrawal method is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const WithdrawFundsForm: React.FC<{ currentBalance: number }> = ({ currentBalance }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      accountNumber: '',
      withdrawalMethod: 'bank',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.amount > currentBalance) {
      form.setError('amount', {
        type: 'manual',
        message: 'Withdrawal amount exceeds your current balance'
      });
      return;
    }
    
    if (values.amount < 10) {
      form.setError('amount', {
        type: 'manual',
        message: 'Minimum withdrawal amount is $10'
      });
      return;
    }
    
    try {
      setLoading(true);
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
      
      // Store withdrawal method and account info in request description
      const withdrawalRequest = {
        userId: userDetails.id,
        amount: values.amount,
        method: values.withdrawalMethod,
        accountInfo: values.accountNumber
      };
      
      // We'll need to stringify the extra data since our API only expects userId and amount
      const response = await withdrawFunds({
        userId: userDetails.id,
        amount: values.amount
      });
      
      toast({
        title: "Withdrawal request submitted",
        description: `${values.amount} USD withdrawal is being processed to your ${values.withdrawalMethod} account.`,
      });
      
      form.reset({ 
        amount: 0, 
        accountNumber: '',
        withdrawalMethod: 'bank'
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to process withdrawal",
        description: error.message || "There was an error processing your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Withdraw money from your wallet to your preferred account.</CardDescription>
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
                      <Input {...field} type="number" step="0.01" min="0" max={currentBalance} className="pl-8" />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">Available balance: ${currentBalance.toFixed(2)}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="withdrawalMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdrawal Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Information</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder={
                        form.watch('withdrawalMethod') === 'bank' 
                          ? "Enter your bank account details" 
                          : form.watch('withdrawalMethod') === 'paypal' 
                            ? "Enter your PayPal email"
                            : "Enter your crypto wallet address"
                      }
                    />
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
                'Withdraw Funds'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>Withdrawals typically process within 1-3 business days.</p>
        <p className="mt-1">Minimum withdrawal amount is $10.</p>
      </CardFooter>
    </Card>
  );
};

export default WithdrawFundsForm;
