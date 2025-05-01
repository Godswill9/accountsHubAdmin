
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Transaction } from '@/types/wallet';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const statusIcon = {
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-red-500" />
  };

  const typeIcon = {
    deposit: <ArrowUpRight className="h-5 w-5 text-green-500" />,
    withdrawal: <ArrowDownLeft className="h-5 w-5 text-red-500" />,
    transfer: <ArrowDownLeft className="h-5 w-5 text-blue-500 rotate-90" />
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="bg-gray-100 p-2 rounded-full mr-3">
          {typeIcon[transaction.type]}
        </div>
        <div>
          <h4 className="font-medium">
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </h4>
          <p className="text-sm text-gray-500">
            {transaction.description || transaction.ref || `${transaction.type} transaction`}
          </p>
          {transaction.payment_gateway && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {transaction.payment_gateway}
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end mb-1">
          <span className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'deposit' ? '+' : '-'} {transaction.currency} {transaction.amount.toFixed(2)}
          </span>
          <span className="ml-2">{statusIcon[transaction.status]}</span>
        </div>
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
