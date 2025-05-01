
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Clock, ArrowUpDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalletHeader from '@/components/wallet/WalletHeader';
import TransactionItem from '@/components/wallet/TransactionItem';
import AddFundsForm from '@/components/wallet/AddFundsForm';
import WithdrawFundsForm from '@/components/wallet/WithdrawFundsForm';
import { getWalletBalance } from '@/services/walletService';
import { getUserPayments } from '@/services/paymentService';
import { toast } from '@/hooks/use-toast';
import { Transaction } from '@/types/wallet';

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    document.title = "My Wallet - AccsMarket";

    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
        
        if (!userDetails.id) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please log in to access your wallet.",
          });
          return;
        }
        
        const data = await getWalletBalance(userDetails.id);
        setBalance(data.balance || 0);
        
        // Fetch transactions
        setTransactionsLoading(true);
        try {
          const paymentsData = await getUserPayments(userDetails.id);
          
          // Convert payment data to transaction format
          const formattedTransactions: Transaction[] = paymentsData.payments.map(payment => ({
            id: payment.id || `payment-${Date.now()}-${Math.random()}`,
            type: payment.transaction_type === 'deposit' ? 'deposit' : 
                  payment.transaction_type === 'withdrawal' ? 'withdrawal' : 'transfer',
            amount: payment.amount,
            currency: payment.currency || 'USD',
            status: payment.payment_status,
            date: payment.created_at || new Date().toISOString(),
            description: payment.description,
            payment_gateway: payment.payment_gateway,
            payment_type: payment.payment_type,
            transaction_type: payment.transaction_type,
            ref: payment.ref,
            user_id: payment.user_id
          }));
          
          setTransactions(formattedTransactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          // Don't show an error for transactions, just leave them empty
        } finally {
          setTransactionsLoading(false);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load wallet",
          description: "There was an error loading your wallet data. Please refresh the page.",
        });
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const refreshWallet = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
      const data = await getWalletBalance(userDetails.id);
      setBalance(data.balance || 0);
      toast({
        title: "Wallet refreshed",
        description: "Your wallet balance has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to refresh wallet",
        description: "There was an error refreshing your wallet data.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center mb-2">
            <Wallet className="h-6 w-6 mr-2 text-blue-600" />
            My Wallet
          </h1>
          <p className="text-gray-600">Manage your funds and track your transactions</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <WalletHeader 
                balance={balance} 
                onAddFundsClick={() => document.getElementById('add-funds-tab')?.click()} 
                onWithdrawClick={() => document.getElementById('withdraw-tab')?.click()}
              />
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={refreshWallet}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Refresh balance
                </button>
              </div>
            </div>
            
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="add-funds" id="add-funds-tab">Add Funds</TabsTrigger>
                <TabsTrigger value="withdraw" id="withdraw-tab">Withdraw</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="mt-0">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  </div>
                  
                  {transactionsLoading ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading transactions...</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {transactions.length > 0 ? (
                        transactions.map(tx => (
                          <TransactionItem key={tx.id} transaction={tx} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p>No transactions yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="add-funds" className="mt-0">
                <div className="max-w-xl mx-auto">
                  <AddFundsForm />
                </div>
              </TabsContent>
              
              <TabsContent value="withdraw" className="mt-0">
                <div className="max-w-xl mx-auto">
                  <WithdrawFundsForm currentBalance={balance} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WalletPage;
