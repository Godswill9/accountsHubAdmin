import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderDetail from "@/components/orders/OrderDetail";
import { getOrder } from "@/services/orderService";
import { toast } from "@/hooks/use-toast";

// Mock order detail
const mockOrderDetail = {
  id: "ORD-1234",
  productName: "Instagram Account (10K Followers)",
  productId: "PROD-5678",
  quantity: 1,
  date: "2023-05-20T14:30:00",
  status: "completed" as const,
  totalAmount: 99.99,
  notes: "Please ensure the account has posts related to travel niche.",
  paymentMethod: "Wallet",
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    document.title = `Order #${orderId} - AccsMarket`;

    const fetchOrderDetails = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data.order);
      } catch (error) {
        setError("Failed to load order details");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    // For demo, use mock data instead of making an API call
    // In production, uncomment the fetchOrderDetails() function
    // fetchOrderDetails();

    // Mock loading delay for demo
    setTimeout(() => {
      setOrder(mockOrderDetail);
      setLoading(false);
    }, 700);
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : order ? (
          <OrderDetail order={order} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Order not found
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
