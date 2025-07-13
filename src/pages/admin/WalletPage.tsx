
import { useState, useEffect} from "react";
import { getWalletBalance, addFunds, withdrawFunds, transferFunds } from "@/services/walletService";
import {getAllPayments } from "@/services/paymentService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Check, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";

const getGatewayLogo = (gateway) => {
  switch (gateway) {
    case "flutterwave":
      return <img src="data:image/png;base64,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" className="h-4" alt="flutterwave" />;
    case "paypal":
      return <img src="data:image/jpeg;base64,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" className="h-4" alt="paypal" />;
    case "payoneer":
      return <img src="data:image/png;base64,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" className="h-4" alt="payoneer" />;
    case "crypto":
      return <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsLiobisWgxu9dK2-iI76EjvQQmwr8ltav8Q&s" className="h-4" alt="crypto" />;
    default:
      return null;
  }
};



const WalletPage = () => {
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
const [showUserModal, setShowUserModal] = useState(false);
const [loadingUser, setLoadingUser] = useState(false);
const [userMap, setUserMap] = useState<{ [key: string]: any }>({});

 const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("flutterwave");
  const [details, setDetails] = useState<any>({});
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [isBankValid, setIsBankValid] = useState(false);
const [bankCheckLoading, setBankCheckLoading] = useState(false);
const [accountName, setAccountName] = useState("");

const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);

const handleViewMoreDetails = (payment_id: string) => {
  const withdrawal = filteredWithdrawals.find(w => w.payment_id === payment_id);
  console.log(withdrawal)
  if (!withdrawal) {
    setSelectedWithdrawal(null);
    setShowUserModal(true);
    return;
  }
  setSelectedWithdrawal(withdrawal);
  setShowUserModal(true);
};
    const [filterType, setFilterType] = useState("all");
const [withdrawals, setWithdrawals] = useState([]);
  type User = {
    id?: string;
    fullName?: string;
    email?: string;
    wallet_balance?: number;
  };
  const [user, setUser] = useState<User>({});
  type Seller = {
    seller_id?: string;
    fullName?: string;
    email?: string;
    wallet_balance?: number;
  };
  const [seller, setseller] = useState<Seller>({});
  const [activeTab, setActiveTab] = useState("myAcc");
  
  const queryClient = useQueryClient();

  const { data: balanceData, isLoading } = useQuery({
    queryKey: ['walletBalance', walletId],
    queryFn: () => getWalletBalance(walletId),
    enabled: false, // Don't run query on component mount
  });

  const { admin, isAuthenticated } = useAuth();

  const [newNotification, setNewNotification] = useState({
    adminId: "",
    priority: "",
    details: "",
    email: "",
    title: "",
    notification_type: "",
  });

   

  useEffect(() => {
    if (admin?.admin_id) {
      console.log(admin)
      setUser({})
      
      // fetchNotifications(admin.admin_id);
    }
        setResult(null);
    // setAdmin(admin)
  }, [admin]);

  useEffect(() => {
  if (result === "success") {
    // Wait a moment for the user to see the success message, then reload
    const timeout = setTimeout(() => {
      window.location.reload();
    }, 1000); 

    return () => clearTimeout(timeout);
  }
}, [result]);
  

  const addFundsMutation = useMutation({
    mutationFn: (data: { userId: string, amount: number }) => addFunds(data),
    onSuccess: () => {
      toast.success("Funds added successfully");
      queryClient.invalidateQueries({ queryKey: ['walletBalance', walletId] });
      setAmount("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add funds");
    }
  });

  const withdrawFundsMutation = useMutation({
    mutationFn: (data: { userId: string, amount: number }) => withdrawFunds(data),
    onSuccess: () => {
      toast.success("Funds withdrawn successfully");
      queryClient.invalidateQueries({ queryKey: ['walletBalance', walletId] });
      setAmount("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to withdraw funds");
    }
  });

  const transferFundsMutation = useMutation({
    mutationFn: (data: { senderId: string, recipientId: string, amount: number }) => transferFunds(data),
    onSuccess: () => {
      toast.success("Funds transferred successfully");
      queryClient.invalidateQueries({ queryKey: ['walletBalance', walletId] });
      setAmount("");
      setRecipientId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to transfer funds");
    }
  });

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) {
      toast.error("Please enter a wallet ID");
      return;
    }
     try {
    const res = await axios.get(
      `https://aitool.asoroautomotive.com/api/users/${walletId}`
    );

  //  console.log(res.data)
   setUser(res.data)
  } catch (error) {
    toast.error("Failed to fetch buyer");
    // console.error("Error fetching notifications:", error);
  }
    
  };


 useEffect(() => {
  const loadWithdrawalsWithUsers = async () => {
  try {
   const res = await getAllPayments();
    const rawWithdrawals = res.payments.filter(
      (p: any) => p.transaction_type === "withdrawal"
    );

    const uniqueUserIds = [...new Set(rawWithdrawals.map(w => w.user_id))];
    const userCache: { [key: string]: any } = {};

    for (const userId of uniqueUserIds) {
      try {
        // Try as buyer
        const resUser = await axios.get(`https://aitool.asoroautomotive.com/api/users/${userId}`);
        userCache[userId] = {
          ...resUser.data,
          userRole: "buyer"
        };
      } catch (err1) {
        try {
          // Try as seller
          const resSeller = await axios.get(`https://aitool.asoroautomotive.com/api/sellers/${userId}`);
          userCache[userId] = {
            ...resSeller.data.seller,
            userRole: "seller"
          };
        } catch (err2) {
          console.warn("Unknown user type for ID:", userId);
          userCache[userId] = {
            name: "Admin",
            email: "-",
            userRole: "Admin"
          };
        }
      }
    }

    const enrichedWithdrawals = rawWithdrawals.map(w => ({
      ...w,
      user: userCache[w.user_id],
      userRole: userCache[w.user_id]?.userRole || "unknown"
    }));

    console.log(enrichedWithdrawals)

    setUserMap(userCache);
    setWithdrawals(enrichedWithdrawals);
  } catch (err) {
    console.error("Failed to load withdrawals:", err);
  }
};

    loadWithdrawalsWithUsers();
}, []);


// Filter logic
const filteredWithdrawals = withdrawals.filter((w) => {
  if (filterType === "all") return true;
  if (filterType === "buyer") return w.userRole === "buyer";
  if (filterType === "seller") return w.userRole === "seller";
  if (filterType === "pending") return w.payment_status === "pending";
  if (filterType === "completed") return w.payment_status === "completed";
  return true;
});


const handleSortByDate = () => {
  setWithdrawals((prev) =>
    [...prev].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );
};

const handleConfirmWithdrawal = async (paymentId: string) => {
  try {
    const res = await axios.post(`https://aitool.asoroautomotive.com/api/confirm-withdrawal/${paymentId}`);

    if (res.status === 200 && res.data?.message === "Withdrawal confirmed and wallet updated") {
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.payment_id === paymentId
            ? { ...w, payment_status: "completed" }
            : w
        )
      );
      toast.success("Withdrawal marked as completed.");
          const timeout = setTimeout(() => {
      window.location.reload();
    }, 1000); 

    return () => clearTimeout(timeout);
    } else {
      console.error("Unexpected response:", res.data);
      toast.error("Unexpected response from server.");
    }
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";
    console.error("Confirm withdrawal error:", error);
    toast.error("Failed to confirm withdrawal: " + errorMsg);
  }
};

const handleRejectWithdrawal = async (paymentId: string) => {
  const confirm = window.confirm("Are you sure you want to reject and delete this withdrawal request?");
  if (!confirm) return;

  try {
    const res = await axios.delete(`https://aitool.asoroautomotive.com/api/reject-withdrawalReq/${paymentId}`);

    if (res.data.status === "success") {
      toast.success("Withdrawal request rejected and removed.");
      setWithdrawals((prev) => prev.filter((w) => w.payment_id !== paymentId));
          const timeout = setTimeout(() => {
      window.location.reload();
    }, 1000); 

    return () => clearTimeout(timeout);
    } else {
      toast.error(res.data.message || "Failed to reject withdrawal.");
    }
  } catch (error: any) {
    console.error("Rejection error:", error);
    toast.error(error?.response?.data?.message || "An error occurred while rejecting withdrawal.");
  }
};

 const renderStep = () => {
    if (result) {
      return (
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          {result === "success" ? (
            <CheckCircle2 className="text-green-600 h-12 w-12" />
          ) : (
            <XCircle className="text-red-600 h-12 w-12" />
          )}
          <h2 className="text-xl font-semibold">
            {result === "success" ? "Withdrawal Request Sent" : "Failed to Withdraw"}
          </h2>
          <p className="text-muted-foreground">
            {result === "success"
              ? "Your funds will arrive within 24 hours."
              : "There was a problem processing your request. Try again."}
          </p>
        </div>
      );
    }
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label>Select Withdrawal Method</Label>
            <select
              className="w-full border p-2 rounded"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                setDetails({});
              }}
            >
              <option value="flutterwave">Bank Transfer (Flutterwave)</option>
              <option value="paypal">PayPal</option>
              <option value="payoneer">Payoneer</option>
              <option value="crypto">Crypto (USDT, BTC)</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {method === "flutterwave" && (
             <>
 <Label>Bank</Label>
<select
  className="w-full border p-2 rounded"
  value={details.bankCode || ""}
  onChange={(e) => {
    const bankCode = e.target.value;
    const updatedDetails = { ...details, bankCode };
    setDetails(updatedDetails);
  }}
>
  <option value="">Select your bank</option>
  <option value="044">Access Bank</option>
  <option value="050">Ecobank</option>
  <option value="070">Fidelity Bank</option>
  <option value="011">First Bank of Nigeria</option>
  <option value="214">FCMB</option>
  <option value="058">GTBank</option>
  <option value="232">Sterling Bank</option>
  <option value="057">Zenith Bank</option>
  <option value="033">UBA</option>
  <option value="035">Wema Bank</option>
  <option value="215">Unity Bank</option>
  <option value="221">Stanbic IBTC Bank</option>
  <option value="082">Keystone Bank</option>
  <option value="030">Heritage Bank</option>
  <option value="032">Union Bank</option>
  <option value="090110">VFD Microfinance Bank</option>
  <option value="999991">OPay (Paycom)</option>

</select>

  <Input
    placeholder="Account Number"
    value={details.accountNumber || ""}
    onChange={(e) => {
      const accountNumber = e.target.value;
      const updatedDetails = { ...details, accountNumber };
      setDetails(updatedDetails);
      verifyBankDetails(updatedDetails.bankCode || "", accountNumber);
    }}
  />

  {bankCheckLoading && (
    <div className="text-sm text-muted-foreground flex items-center gap-1">
      <Loader2 className="animate-spin h-4 w-4" /> Verifying...
    </div>
  )}
  {!bankCheckLoading && details.bankCode && details.accountNumber && (
    <div
      className={`text-sm font-medium ${
        isBankValid ? "text-green-600" : "text-red-600"
      }`}
    >
      {isBankValid ? accountName: "Invalid bank details"}
    </div>
  )}
</>

            )}
           {method === "paypal" && (
  <>
    <Input
      placeholder="PayPal Email"
      value={details.paypalEmail || ""}
      onChange={(e) => setDetails({ ...details, paypalEmail: e.target.value })}
    />
    {details.paypalEmail && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.paypalEmail) && (
      <div className="text-xs text-red-600 mt-1">
        Please enter a valid email address.
      </div>
    )}
  </>
)}
            {method === "payoneer" && (
               <>
                <Input
                placeholder="Payoneer Email"
                value={details.payoneerEmail || ""}
                onChange={(e) => setDetails({ ...details, payoneerEmail: e.target.value })}
              />
               {details.payoneerEmail && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.payoneerEmail) && (
      <div className="text-xs text-red-600 mt-1">
        Please enter a valid email address.
      </div>
    )}
               </>
            )}
            {method === "crypto" && (
              <>
                <Input
                  placeholder="Coin (e.g. USDT)"
                  value={details.coin || ""}
                  onChange={(e) => setDetails({ ...details, coin: e.target.value })}
                />
                <Input
                  placeholder="Wallet Address"
                  value={details.wallet || ""}
                  onChange={(e) => setDetails({ ...details, wallet: e.target.value })}
                />
              </>
            )}
            {loadingField && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4" /> Validating...
              </div>
            )}
            {/* <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> Bank account name must match your profile. Funds arrive in 24 hours.
            </div> */}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available:${Number(admin.wallet_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  
 const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };


  const verifyBankDetails = async (bankCode: string, accountNumber: string) => {
    setAccountName("")
  if (bankCode.length < 3 || accountNumber.length < 10) return;

  try {
    setBankCheckLoading(true);
    const res = await axios.post("https://aitool.asoroautomotive.com/api/flutterwave/checkBankDet", {
      bank_code: bankCode,
      account_number: accountNumber,
    });

    console.log(res.data)

    if (res.data.status === "success") {
      setIsBankValid(true);
      setAccountName(res.data.account_name || "Unknown Account");
    } else {
      setIsBankValid(false);
    }
  } catch (error) {
    console.error("Verification failed:", error);
      // onComplete("fail", "Check internet connection or try again later");
    // setIsBankValid(false);
  } finally {
    setBankCheckLoading(false);
  }
};


  const handleWithdraw = async () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > Number(admin.wallet_balance)) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/flutterwave/withdraw/${admin.admin_id}`,
        {
          method,
          details,
          amount: numericAmount,
        }
      );

      if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaypalWithdraw = async () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > Number(admin.wallet_balance)) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/paypal/${admin.admin_id}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

     if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePayoneerWithdraw = async () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > Number(admin.wallet_balance)) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/payoneer/${admin.admin_id}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

       if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCryptoWithdraw = async () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      // onComplete("fail", "Invalid amount");
      return;
    }

    if (numericAmount > Number(admin.wallet_balance)) {
      // onComplete("fail", "Insufficient wallet balance");
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `https://aitool.asoroautomotive.com/api/withdraw/crypto/${admin.admin_id}`,
        {
          method,
          details,
          amount: numericAmount
        }
      );

    if (response.data.status === "success") {
        setResult("success");
        // onComplete("success", "Withdrawal request submitted successfully");
      } else {
        setResult("fail");
        // onComplete("fail", "Failed to submit withdrawal request");
      }
    } catch (error) {
      setResult("fail");
      // onComplete("fail"," An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWithdraw = () => {
  if (method === "flutterwave") {
    handleWithdraw();
  } else if (method === "paypal") {
    handlePaypalWithdraw();
  } else if (method === "payoneer") {
    handlePayoneerWithdraw();
  } else if (method === "crypto") {
    handleCryptoWithdraw();
  }
};


 
 
  const handleCheckSellerBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) {
      toast.error("Please enter a wallet ID");
      return;
    }
     try {
    const res = await axios.get(
      `https://aitool.asoroautomotive.com/api/sellers/${walletId}`
    );

  //  console.log(res.data)
   setseller(res.data)
  } catch (error) {
    toast.error("Failed to fetch seller");
    // console.error("Error fetching notifications:", error);
  }
    
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) {
      toast.error("Please enter a wallet ID");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    addFundsMutation.mutate({
      userId: walletId,
      amount: parseFloat(amount)
    });
  };

  const handleWithdrawFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) {
      toast.error("Please enter a wallet ID");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    withdrawFundsMutation.mutate({
      userId: walletId,
      amount: parseFloat(amount)
    });
  };

  const handleTransferFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) {
      toast.error("Please enter a sender wallet ID");
      return;
    }
    if (!recipientId) {
      toast.error("Please enter a recipient wallet ID");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    transferFundsMutation.mutate({
      senderId: walletId,
      recipientId,
      amount: parseFloat(amount)
    });
  };

  const isPending = addFundsMutation.isPending || 
                    withdrawFundsMutation.isPending || 
                    transferFundsMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
        <p className="text-muted-foreground">
          Manage user wallets, add or withdraw funds
        </p>
      </div>

      <Tabs defaultValue="check" onValueChange={setActiveTab} value={activeTab}>
        
        <TabsList className="flex flex-wrap gap-2 w-full md:grid md:grid-cols-3 lg:grid-cols-4">
  <TabsTrigger value="myAcc">Admin Balance</TabsTrigger>
  {/* <TabsTrigger value="check">Check Balance (Users)</TabsTrigger> */}
  {/* <TabsTrigger value="checkSellers">Check Balance (Sellers)</TabsTrigger> */}
  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
    {/* <TabsTrigger value="add">Add Funds</TabsTrigger> */}
  {/* <TabsTrigger value="transfer">Transfer</TabsTrigger> */}
  <TabsTrigger value="withdrawalRequests">View withdrawal requests</TabsTrigger>
</TabsList>

{/* <TabsList
  className="grid w-full gap-2
             grid-cols-1
             sm:grid-cols-2
             md:grid-cols-3
             lg:grid-cols-4"
>
  <TabsTrigger value="myAcc">Admin Balance</TabsTrigger>
  <TabsTrigger value="check">Check Balance (Users)</TabsTrigger>
  <TabsTrigger value="checkSellers">Check Balance (Sellers)</TabsTrigger>
  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
  <TabsTrigger value="transfer">Transfer</TabsTrigger>
</TabsList> */}

        
    <div className="mt-32 md:mt-16 lg:mt-16">
          <TabsContent value="myAcc">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>
                  View your current balance
                </CardDescription>
              </CardHeader>
             {admin && (
  <CardFooter className="flex flex-col items-start border-t mt-4">
    <div className="w-full bg-muted/50 p-5 rounded-xl shadow-sm">
      <h4 className="text-base font-semibold text-primary mb-4">Admin Wallet Info</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground font-medium">Wallet ID</span>
          <span className="text-[15px] font-semibold">{admin.admin_id}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-muted-foreground font-medium">Current Balance</span>
         <span className="text-lg font-bold text-green-600">
  ${Number(admin.wallet_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</span>

        </div>
      </div>
    </div>
  </CardFooter>
)}

            </Card>
          </TabsContent>
          {/* <TabsContent value="check">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Check Wallet Balance (Users)</CardTitle>
                <CardDescription>
                  View the current balance for a user's wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckBalance} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Wallet ID (User ID)</Label>
                    <Input
                      id="walletId"
                      placeholder="Enter wallet ID"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Check Balance"}
                  </Button>
                </form>
              </CardContent>
              
             {user?.id && (
  <CardFooter className="flex flex-col items-start border-t">
    <div className="bg-muted p-4 rounded-md w-full mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">User:</p>
        <p className="font-medium">{user.fullName}</p>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">User Email:</p>
        <p className="font-medium">{user.email}</p>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">Wallet ID:</p>
        <p className="font-medium">{user.id}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Current Balance:</p>
        <p className="text-xl font-bold text-primary">
          ${Number(user.wallet_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  </CardFooter>
)}

            </Card>
          </TabsContent> */}
          {/* <TabsContent value="checkSellers">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Check Wallet Balance (Sellers)</CardTitle>
                <CardDescription>
                  View the current balance for a seller's wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckSellerBalance} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Wallet ID (seller ID)</Label>
                    <Input
                      id="walletId"
                      placeholder="Enter wallet ID"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Check Balance"}
                  </Button>
                </form>
              </CardContent>
              
             {seller?.seller_id && (
  <CardFooter className="flex flex-col items-start border-t">
    <div className="bg-muted p-4 rounded-md w-full mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">seller:</p>
        <p className="font-medium">{seller.fullName}</p>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">seller Email:</p>
        <p className="font-medium">{seller.email}</p>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">Wallet ID:</p>
        <p className="font-medium">{seller.seller_id}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Current Balance:</p>
        <p className="text-xl font-bold text-primary">
          ${Number(seller.wallet_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  </CardFooter>
)}

            </Card>
          </TabsContent> */}
          
          {/* <TabsContent value="add">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
                <CardDescription>
                  Add funds to a user's wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFunds} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Wallet ID (User ID)</Label>
                    <Input
                      id="walletId"
                      placeholder="Enter wallet ID"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {addFundsMutation.isPending ? "Processing..." : "Add Funds"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}
          
          <TabsContent value="withdraw">
  <Card className="glass-card max-w-2xl mx-auto w-full">
    <CardHeader>
      <CardTitle className="text-xl">Place Withdrawal</CardTitle>
      <CardDescription className="text-muted-foreground">
       Record your withdrawals
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Step UI */}
      <div className="space-y-4">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={
              (step === 2 && method === "flutterwave" && !isBankValid) ||
              (step === 2 && method === "paypal" &&
                (!details.paypalEmail ||
                  !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.paypalEmail))) ||
              (step === 2 && method === "payoneer" &&
                (!details.payoneerEmail ||
                  !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.payoneerEmail)))
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmitWithdraw} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Withdrawal"}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
</TabsContent>

          
          {/* <TabsContent value="transfer">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Transfer Funds</CardTitle>
                <CardDescription>
                  Transfer funds between user wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransferFunds} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderId">From Wallet ID (Sender)</Label>
                    <Input
                      id="senderId"
                      placeholder="Enter sender wallet ID"
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientId">To Wallet ID (Recipient)</Label>
                    <Input
                      id="recipientId"
                      placeholder="Enter recipient wallet ID"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {transferFundsMutation.isPending ? "Processing..." : "Transfer Funds"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}

         <TabsContent value="withdrawalRequests">
  <Card className="glass-card w-full max-w-full md:max-w-6xl mx-auto">
    <CardHeader>
      <CardTitle>Withdrawal Requests</CardTitle>
      <CardDescription>
        View and confirm withdrawal requests from users
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <select
          className="border rounded px-3 py-1"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {/* <Button variant="outline" onClick={handleSortByDate}>
          Sort by Date
        </Button> */}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((w) => (
                  <TableRow key={w.payment_id}>
                    <TableCell>{w.user?.fullName || w.user_id}</TableCell>
                   <TableCell className="capitalize">
  <span
    className={`px-2 py-1 rounded text-xs font-medium
      ${w.userRole === "seller" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
  >
    {w.userRole}
  </span>
</TableCell>

                    <TableCell>${Number(w.amount).toFixed(2)}</TableCell>
                    <TableCell>{w.payment_gateway}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          w.payment_status === "completed"
                            ? "default"
                            : w.payment_status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {w.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(w.created_at, "yyyy-MM-dd HH:mm")}</TableCell>
                 <TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    {/* View User Details */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleViewMoreDetails(w.payment_id)}
        title="View User Details"
      >
        <Eye className="w-5 h-5 text-blue-600" />
      </Button>

    {/* Confirm Withdrawal */}
    {w.payment_status !== "completed" && (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleConfirmWithdrawal(w.payment_id)}
          className="text-green-700 border-green-500 hover:bg-green-50"
          title="Mark as Completed"
        >
          Confirm
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRejectWithdrawal(w.payment_id)}
          className="text-red-700 border-red-500 hover:bg-red-50"
          title="Reject Withdrawal"
        >
          Reject
        </Button>
      </>
    )}
  </div>
</TableCell>



                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <p className="text-muted-foreground">
                      No withdrawal requests found.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

        </div>
      </Tabs>

<Dialog open={showUserModal} onOpenChange={setShowUserModal}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">User Information</DialogTitle>
    </DialogHeader>

    {/* Top: User Details */}
    <div className="space-y-2 text-sm border-b pb-4 mb-4">
      {loadingUser ? (
        <p className="text-muted-foreground">Loading user details...</p>
      ) : selectedWithdrawal?.user ? (
        <>
          <p><strong>Name:</strong> {selectedWithdrawal.user.fullName}</p>
          <p><strong>Email:</strong> {selectedWithdrawal.user.email}</p>
          <p><strong>Role:</strong> {selectedWithdrawal.userRole}</p>
          <p><strong>Joined:</strong> {selectedWithdrawal.user.created_at ? formatDate(selectedWithdrawal.user.created_at, "yyyy-MM-dd HH:mm") : "-"}</p>
        </>
      ) : (
        <p className="text-destructive">User not found</p>
      )}
    </div>

    {/* Bottom: Withdrawal Details */}
    <div className="space-y-2 text-sm">

      {/* Wallet and Base Info */}
      <div className="grid grid-cols-2 gap-2">
        <p><strong>Wallet ID:</strong> {selectedWithdrawal?.user_id || "-"}</p>
        <p><strong>Amount:</strong> <span className="text-green-600 font-medium">${selectedWithdrawal?.amount ?? "-"}</span></p>
        <p className="col-span-2">
          <strong>Payment Gateway:</strong>{" "}
          <span className="inline-flex items-center gap-2 px-2 py-1 border rounded-md bg-gray-100 text-sm">
            {getGatewayLogo(selectedWithdrawal?.payment_gateway)}
            {selectedWithdrawal?.payment_gateway || "-"}
          </span>
        </p>
        <p className="col-span-2">
          <strong>Status:</strong>{" "}
          <span
            className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
              selectedWithdrawal?.payment_status === "completed"
                ? "bg-green-100 text-green-700"
                : selectedWithdrawal?.payment_status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedWithdrawal?.payment_status || "-"}
          </span>
        </p>
        <p className="col-span-2">
          <strong>Date:</strong> {selectedWithdrawal?.created_at ? formatDate(selectedWithdrawal.created_at, "yyyy-MM-dd HH:mm") : "-"}
        </p>
      </div>

      {/* Payment-specific Fields */}
      {selectedWithdrawal?.payment_gateway === "paypal" && selectedWithdrawal.withdrawal_email && (
        <div className="mt-2">
          <label className="text-xs text-muted-foreground">PayPal Email</label>
          <p className="px-3 py-2 rounded-md bg-blue-50 border text-blue-700 font-medium">{selectedWithdrawal.withdrawal_email}</p>
        </div>
      )}

      {selectedWithdrawal?.payment_gateway === "payoneer" && selectedWithdrawal.withdrawal_email && (
        <div className="mt-2">
          <label className="text-xs text-muted-foreground">Payoneer Email</label>
          <p className="px-3 py-2 rounded-md bg-purple-50 border text-purple-700 font-medium">{selectedWithdrawal.withdrawal_email}</p>
        </div>
      )}

      {selectedWithdrawal?.payment_gateway === "crypto" && (
        <>
          {selectedWithdrawal.coin && (
            <div className="mt-2">
              <label className="text-xs text-muted-foreground">Cryptocurrency</label>
              <p className="px-3 py-2 rounded-md bg-yellow-50 border text-yellow-800 font-semibold">{selectedWithdrawal.coin}</p>
            </div>
          )}
          {selectedWithdrawal.wallet_address && (
            <div>
              <label className="text-xs text-muted-foreground">Wallet Address</label>
              <p className="px-3 py-2 rounded-md bg-gray-50 border font-mono text-gray-700 break-all">{selectedWithdrawal.wallet_address}</p>
            </div>
          )}
        </>
      )}

      {selectedWithdrawal?.payment_gateway === "flutterwave" && (
        <>
          {selectedWithdrawal.account_name && (
            <div className="mt-2">
              <label className="text-xs text-muted-foreground">Account Name</label>
              <p className="px-3 py-2 rounded-md bg-slate-50 border text-slate-800 font-medium">{selectedWithdrawal.account_name}</p>
            </div>
          )}
          {selectedWithdrawal.account_number && (
            <div>
              <label className="text-xs text-muted-foreground">Account Number</label>
              <p className="px-3 py-2 rounded-md bg-slate-50 border text-slate-700 font-mono">{selectedWithdrawal.account_number}</p>
            </div>
          )}
          {selectedWithdrawal.bank_code && (
            <div>
              <label className="text-xs text-muted-foreground">Bank Code</label>
              <p className="px-3 py-2 rounded-md bg-slate-100 border text-slate-600">{selectedWithdrawal.bank_code}</p>
            </div>
          )}
        </>
      )}
    </div>
  </DialogContent>
</Dialog>



      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("check")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Check Balance
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("add")}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("withdraw")}>
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => setActiveTab("transfer")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Transfer Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the <strong>Wallet ID</strong> to identify the user's wallet.</li>
              <li>Wallet ID is typically the same as the User ID in the system.</li>
              <li>All transactions are logged for auditing purposes.</li>
              <li>When withdrawing funds, ensure the wallet has sufficient balance.</li>
              <li>For large transactions, double-check the wallet ID to avoid errors.</li>
              <li>Please follow company policies regarding fund manipulations.</li>
            </ul>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default WalletPage;
