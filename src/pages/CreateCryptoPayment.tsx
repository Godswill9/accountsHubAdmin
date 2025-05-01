
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import UserHeader from '@/components/UserHeader';
import Footer from '@/components/Footer';
import { PAYMENT_ENDPOINTS } from '@/config/api';

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

const CreateCryptoPayment = () => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('Wallet funding with cryptocurrency');
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

  const handleCreateCryptoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const paymentData = {
        price_amount: parseFloat(amount),
        order_id: `wallet-${userId}-${Date.now()}`,
        order_description: description || 'Wallet funding with cryptocurrency'
      };
      
      const response = await apiRequest(PAYMENT_ENDPOINTS.CREATE_CRYPTO, 'POST', paymentData);
      
      if (response.data) {
        // Save payment details in localStorage for reference
        localStorage.setItem('pendingCryptoPayment', JSON.stringify({
          payment_type: 'wallet_funding',
          payment_status: 'pending',
          payment_gateway: 'crypto',
          amount,
          transaction_type: 'deposit',
          user_id: userId,
          payment_data: response.data
        }));
        
        // Redirect to the crypto checkout URL or payment page
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else {
          // If no direct URL is provided, navigate to a local page that will handle the checkout
          navigate('/crypto-checkout', { state: { paymentData: response.data } });
        }
      }
    } catch (error) {
      console.error('Crypto payment creation error:', error);
      toast.error("Failed to create crypto payment. Please try again.");
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
              <CardTitle>Add Funds via Cryptocurrency</CardTitle>
              <CardDescription>
                Securely add funds to your wallet using cryptocurrency
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleCreateCryptoPayment}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="5"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum amount: $5.00</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Wallet funding with cryptocurrency"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Cryptocurrency payment information</p>
                      <ul className="mt-1 list-disc list-inside">
                        <li>Pay with Bitcoin, Ethereum, Litecoin, and more</li>
                        <li>Instant conversion to USD at current market rates</li>
                        <li>Funds will be available in your wallet after confirmation</li>
                      </ul>
                    </div>
                  </div>
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
                  {isLoading ? "Processing..." : "Continue with Crypto Payment"}
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

export default CreateCryptoPayment;
