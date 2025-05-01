
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description?: string;
  payment_gateway?: string;
  payment_type?: string;
  transaction_type?: string;
  ref?: string;
  user_id?: string;
}
