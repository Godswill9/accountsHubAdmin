
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface WalletHeaderProps {
  balance: number;
  currency?: string;
  onAddFundsClick?: () => void;
  onWithdrawClick?: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ 
  balance, 
  currency = 'USD',
  onAddFundsClick,
  onWithdrawClick
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <CardHeader className="pb-2">
        <CardDescription className="text-white/80 flex items-center">
          <Wallet className="h-4 w-4 mr-1" />
          Your Wallet Balance
        </CardDescription>
        <CardTitle className="text-3xl font-bold">
          {currency} {balance.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div 
            className="bg-white/20 p-3 rounded-lg flex items-center justify-between hover:bg-white/30 cursor-pointer transition-colors"
            onClick={onAddFundsClick}
          >
            <div className="flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2" />
              <span>Add Funds</span>
            </div>
          </div>
          <div 
            className="bg-white/20 p-3 rounded-lg flex items-center justify-between hover:bg-white/30 cursor-pointer transition-colors"
            onClick={onWithdrawClick}
          >
            <div className="flex items-center">
              <ArrowDownLeft className="h-5 w-5 mr-2" />
              <span>Withdraw</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletHeader;
