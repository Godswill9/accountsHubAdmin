
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import UserHeader from '@/components/UserHeader';
import Footer from '@/components/Footer';
import { PAYMENT_ENDPOINTS } from '@/config/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Helper function for API requests
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

const CreateCurrencyPayment = () => {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [description, setDescription] = useState<string>('Wallet funding');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>('wallet_funding');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get userId and other data from location state or localStorage
  const userId = location.state?.userId || localStorage.getItem('userId') || '';
  
  useEffect(() => {
    // Check if user is logged in
    if (!userId) {
      toast.error("Please log in to add funds");
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const paymentData = {
        amount: parseFloat(amount),
        currency,
        description,
        payment_method_types: ["card"],
        userId,
        payment_type: paymentType
      };
      
      const response = await apiRequest(PAYMENT_ENDPOINTS.CREATE_CURRENCY, 'POST', paymentData);
      
      if (response.sessionId) {
        // Save payment details in localStorage for reference
        localStorage.setItem('pendingPayment', JSON.stringify({
          payment_type: paymentType,
          payment_status: 'pending',
          payment_gateway: 'stripe',
          amount,
          transaction_type: 'deposit',
          user_id: userId
        }));
        
        // Redirect to Stripe checkout
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: response.sessionId
          });
        } else {
          throw new Error("Failed to load Stripe");
        }
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      toast.error("Failed to create payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds via Credit Card</CardTitle>
              <CardDescription>
                Securely add funds to your wallet using Stripe
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleCreatePayment}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-200"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Wallet funding"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/wallet')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateCurrencyPayment;
