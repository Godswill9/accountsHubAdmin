import { useEffect, useState } from "react";
import { getOrders, updateOrder, deleteOrder } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Order {
  order_id: string;
  status: string;
  amount: number;
  items?: any[];
  buyer_id?: string;
  buyer_email?: string;
  created_at: string;
  updatedAt?: string;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await getOrders();
        // console.log(ordersResponse);
        setOrders(ordersResponse);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchOrders();
  }, []);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (orderData: any) => updateOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const filteredOrders =
    orders?.filter(
      (order: Order) =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.buyer_id &&
          order.buyer_id.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  const handleOpenDialog = (order: Order, viewMode = false) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setIsViewMode(viewMode);
    setIsDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    if (!selectedOrder) return;

    updateOrderMutation.mutate({
      id: selectedOrder.order_id,
      status: orderStatus,
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error loading orders: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order: Order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">
                        {order.order_id}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>${Number(order.amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(order, true)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(order, false)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOrder(order.order_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isViewMode ? "Order Details" : "Update Order Status"}
            </DialogTitle>
            <DialogDescription>
              {isViewMode
                ? "View the details for this order"
                : "Update the status of this order"}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Order ID
                  </Label>
                  <p className="font-medium">{selectedOrder.order_id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Total Amount
                  </Label>
                  <p className="font-medium">
                    ${Number(selectedOrder.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Buyer ID
                  </Label>
                  <p className="font-medium">
                    {selectedOrder.buyer_id || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Buyer Email
                  </Label>
                  <p className="font-medium">
                    {selectedOrder.buyer_email || "N/A"}
                  </p>
                </div>
              </div>

              {isViewMode ? (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Status
                  </Label>
                  <p className="font-medium capitalize">
                    {selectedOrder.status}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">Items</Label>
                  <ul className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.name || item.product_name || "Item"} x{" "}
                        {item.quantity} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* <DialogFooter>
            {!isViewMode && (
              <Button
                type="button"
                onClick={handleUpdateOrder}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
              </Button>
            )}
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
