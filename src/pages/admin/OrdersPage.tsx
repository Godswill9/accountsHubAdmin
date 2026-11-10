import { useEffect, useState } from "react";
import { getOrders, updateOrder, deleteOrder } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
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
import { getPlatformImage } from "@/lib/platformImages";
import Person from "@/components/admin/Person";
import MessageAccountDialog from "@/components/admin/MessageAccountDialog";

interface Order {
  order_id: string;
  status: string;
  amount: number;
  items?: any[];
  buyer_id?: string;
  buyer_email?: string;
  created_at: string;
  updatedAt?: string;
  item_name?: string;
  seller_id?: string;
  seen_by_admin?:string;
  buyer_name?: string; buyer_account_email?: string;
  seller_name?: string; seller_email?: string;
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
        ordersResponse.forEach((item, i)=>{
          // console.log(item)
          updateOrdersSeen(item.order_id)
        })
        setOrders(ordersResponse);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchOrders();
  }, []);

      const updateOrdersSeen = async (OrdersId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin-order-seen/${OrdersId}`
      );
      console.log("Orders marked as seen:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking Orders as seen:", error);
    }
  };

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
          order.buyer_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `${order.buyer_name || ""} ${order.buyer_account_email || ""} ${order.seller_name || ""} ${order.seller_email || ""}`
          .toLowerCase().includes(searchQuery.toLowerCase())
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
            <TableHead>Platform</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            {/* <TableHead>Seen</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order: Order) => (
              <TableRow
                key={order.order_id}
                className={order.seen_by_admin === null ? "bg-yellow-50 border-l-[5px] border-yellow-400" : ""}
              >
                <TableCell className="font-medium">
                  <img
                    src={getPlatformImage(order.item_name)}
                    alt=""
                    className="inline-block h-8 w-8 mr-2 object-contain"
                  />
                </TableCell>

                <TableCell className="font-medium">
                  {order.order_id}
                </TableCell>
                <TableCell><Person name={order.buyer_name} email={order.buyer_account_email || order.buyer_email} id={order.buyer_id} /></TableCell>
                <TableCell><Person name={order.seller_name} email={order.seller_email} id={order.seller_id} /></TableCell>

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
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </TableCell>

                <TableCell>${Number(order.amount).toFixed(2)}</TableCell>

                {/* <TableCell>
                  {order.seen_by_admin === null ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      New
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      Seen
                    </span>
                  )}
                </TableCell> */}

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(order, true)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>

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
                    Item Name
                  </Label>
                  <p className="font-medium">{selectedOrder.item_name}</p>{" "}
                  <img
                    src={getPlatformImage(selectedOrder.item_name)}
                    alt=""
                    className="inline-block h-8 w-8 mr-2 object-contain"
                  />
                </div>
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
                    Buyer
                  </Label>
                  <Person name={selectedOrder.buyer_name} email={selectedOrder.buyer_account_email || selectedOrder.buyer_email} id={selectedOrder.buyer_id} />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Seller
                  </Label>
                  <Person name={selectedOrder.seller_name || (selectedOrder.seller_id ? null : "AccountsHub")} email={selectedOrder.seller_email} id={selectedOrder.seller_id} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedOrder.buyer_id && (
                  <MessageAccountDialog recipientId={selectedOrder.buyer_id} recipientType="user" name={selectedOrder.buyer_name} label="Message buyer" />
                )}
                {selectedOrder.seller_id && selectedOrder.seller_id !== "admin" && (
                  <MessageAccountDialog recipientId={selectedOrder.seller_id} recipientType="seller" name={selectedOrder.seller_name} label="Message seller" />
                )}
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
