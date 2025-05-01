
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  
  useEffect(() => {
    document.title = "Payment Status - AccsMarket";
    
    // Parse query parameters to determine success/failure
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'canceled' || status === 'failed') {
      setIsSuccess(false);
    }
    
    // Try to get payment details from localStorage
    try {
      const paymentData = localStorage.getItem('currentPayment');
      if (paymentData) {
        setPaymentDetails(JSON.parse(paymentData));
        // Clear the payment data from localStorage
        localStorage.removeItem('currentPayment');
      }
    } catch (error) {
      console.error('Error parsing payment details', error);
    }
  }, [location]);
  
  const handleRedirect = () => {
    // Redirect the user based on payment type
    if (paymentDetails.paymentType === 'order') {
      navigate('/orders');
    } else {
      navigate('/wallet');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`p-6 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            ) : (
              <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            )}
            
            <h1 className="text-2xl font-bold mb-2">
              {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isSuccess 
                ? 'Your payment has been processed successfully.' 
                : 'There was an issue processing your payment. Please try again.'}
            </p>
            
            {paymentDetails.amount && (
              <div className="bg-white p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${paymentDetails.amount}</span>
                </div>
                
                {paymentDetails.paymentType && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-semibold capitalize">{paymentDetails.paymentType}</span>
                  </div>
                )}
                
                {paymentDetails.method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-semibold capitalize">{paymentDetails.method}</span>
                  </div>
                )}
              </div>
            )}
            
            <Button 
              onClick={handleRedirect}
              className={isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {isSuccess ? (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
