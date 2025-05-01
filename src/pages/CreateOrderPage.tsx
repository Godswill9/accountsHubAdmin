
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderForm from '@/components/orders/OrderForm';
import { ShoppingCart } from 'lucide-react';

const CreateOrderPage: React.FC = () => {
  useEffect(() => {
    document.title = "Create Order - AccsMarket";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center mb-2">
            <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
            Create New Order
          </h1>
          <p className="text-gray-600">Fill out the form below to place your order</p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <OrderForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateOrderPage;
