
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteOrder } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, Edit, Trash2 } from 'lucide-react';

interface OrderDetailProps {
  order: {
    id: string;
    productName: string;
    productId: string;
    quantity: number;
    date: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    totalAmount: number;
    notes?: string;
    paymentMethod?: string;
  };
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(order.id);
        toast({
          title: "Order deleted",
          description: `Order #${order.id} has been deleted successfully.`,
        });
        navigate('/orders');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete order",
          description: "There was an error deleting your order. Please try again.",
        });
      }
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              Order #{order.id}
              <Badge variant="outline" className={`ml-3 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>Placed on {new Date(order.date).toLocaleString()}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {order.status === 'pending' && (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate(`/edit-order/${order.id}`)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Product Information</h3>
            <div className="mt-2 border rounded-md p-3">
              <p><span className="font-medium">Product Name:</span> {order.productName}</p>
              <p><span className="font-medium">Product ID:</span> {order.productId}</p>
              <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
            <div className="mt-2 border rounded-md p-3">
              <p><span className="font-medium">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Wallet'}</p>
              <p>
                <span className="font-medium">Payment Status:</span> 
                <span className={order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                  {order.status === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {order.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
            <div className="mt-2 border rounded-md p-3">
              <p>{order.notes}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500">Order Timeline</h3>
          <div className="mt-2 space-y-3">
            <div className="flex items-start">
              <div className="flex-none mr-3">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Order placed</p>
                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
              </div>
            </div>
            {/* Add more timeline events as needed */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Button>
        {order.status === 'completed' && (
          <Button>
            Download Receipt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderDetail;
