
import { useState, useEffect} from "react";
import { getWalletBalance, addFunds, withdrawFunds, transferFunds } from "@/services/walletService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";


const WalletPage = () => {
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [user, setUser] = useState({});
  const [seller, setseller] = useState({});
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
    // setAdmin(admin)
  }, [admin]);
  

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
  <TabsTrigger value="check">Check Balance (Users)</TabsTrigger>
  <TabsTrigger value="checkSellers">Check Balance (Sellers)</TabsTrigger>
  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
    {/* <TabsTrigger value="add">Add Funds</TabsTrigger> */}
  <TabsTrigger value="transfer">Transfer</TabsTrigger>
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
          <TabsContent value="check">
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
          </TabsContent>
          <TabsContent value="checkSellers">
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
          </TabsContent>
          
          <TabsContent value="add">
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
          </TabsContent>
          
          <TabsContent value="withdraw">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Withdraw funds from a user's wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdrawFunds} className="space-y-4">
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
                    {withdrawFundsMutation.isPending ? "Processing..." : "Withdraw Funds"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transfer">
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
          </TabsContent>
        </div>
      </Tabs>

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
