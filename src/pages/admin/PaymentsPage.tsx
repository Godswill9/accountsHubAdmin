import { useEffect, useState } from "react";
import {
  getAllPayments,
  getUserPayments,
  deletePayment,
  getPaymentStatus,
} from "@/services/paymentService";
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
import { Search, Trash2, RefreshCw, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Payment {
  amount: number;
  created_at: string;
  payment_gateway: string;
  payment_id: string;
  payment_status: string;
  payment_type: string;
  transaction_type: string;
  user_id: string;
}

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [isUserPayments, setIsUserPayments] = useState(false);
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [allPayments, setallPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentResponse = await getAllPayments();
        console.log(paymentResponse);
        setallPayments(paymentResponse.payments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchPayments();
  }, []);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payments", userId, isUserPayments],
    queryFn: () =>
      isUserPayments && userId ? getUserPayments(userId) : getAllPayments(),
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (userId: string) => deletePayment(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete payment");
    },
  });

  const paymentStatusMutation = useMutation({
    mutationFn: (paymentId: string) => getPaymentStatus(paymentId),
    onSuccess: (data) => {
      toast.success(`Payment status: ${data.status}`);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to get payment status");
    },
  });

  const handleSearch = () => {
    if (userId.trim()) {
      setIsUserPayments(true);
    } else {
      setIsUserPayments(false);
    }
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  const handleClearSearch = () => {
    setUserId("");
    setIsUserPayments(false);
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  const handleViewPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailOpen(true);
  };

  const handleDeletePayment = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this payment? This action cannot be undone."
      )
    ) {
      deletePaymentMutation.mutate(userId);
    }
  };

  const handleCheckStatus = (paymentId: string) => {
    paymentStatusMutation.mutate(paymentId);
  };

  const payments = data?.payments || [];

  const filteredPayments = payments.filter(
    (payment: Payment) =>
      payment.payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payment_status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "succeeded":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "cancelled":
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage and track all payment transactions
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Payment Transactions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Filter by User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-[200px]"
                />
                <Button onClick={handleSearch} variant="outline">
                  Search
                </Button>
                {isUserPayments && (
                  <Button onClick={handleClearSearch} variant="ghost">
                    Clear
                  </Button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <TableHead>Payment ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Payment for</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment: Payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell className="font-medium">
                        {payment.payment_id}
                      </TableCell>
                      <TableCell>{payment.user_id}</TableCell>
                      <TableCell>{payment.payment_type}</TableCell>
                      <TableCell>
                        {/* {payment.currency}  */}$
                        {Number(payment.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{payment.payment_gateway}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                            payment.payment_status
                          )}`}
                        >
                          {payment.payment_status}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPaymentDetails(payment)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCheckStatus(payment.payment_id)}
                          disabled={paymentStatusMutation.isPending}
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              paymentStatusMutation.isPending
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                          <span className="sr-only">Check Status</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePayment(payment.user_id)}
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

      <Dialog open={isPaymentDetailOpen} onOpenChange={setIsPaymentDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about this payment
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Payment ID
                  </Label>
                  <p className="font-medium">{selectedPayment.payment_id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    User ID
                  </Label>
                  <p className="font-medium">{selectedPayment.user_id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Payment for
                  </Label>
                  <p className="font-medium">{selectedPayment.payment_type}</p>
                </div>
                {/* <div>
                  <Label className="text-sm text-muted-foreground">
                    Order ID
                  </Label>
                  <p className="font-medium">{selectedPayment.orderId}</p>
                </div> */}
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Amount
                  </Label>
                  <p className="font-medium">
                    {/* {selectedPayment.currency} */}
                    {" $"}
                    {Number(selectedPayment.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Payment Method
                  </Label>
                  <p className="font-medium">
                    {selectedPayment.payment_gateway}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Status
                  </Label>
                  <p className="font-medium capitalize">
                    {selectedPayment.payment_status}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {new Date(selectedPayment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCheckStatus(selectedPayment.payment_id)}
                  disabled={paymentStatusMutation.isPending}
                  className="w-full"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      paymentStatusMutation.isPending ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Payment Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
