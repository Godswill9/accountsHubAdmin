import { useEffect, useState } from "react";
import { getAllSellers } from "@/services/sellersServices.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCircle } from "lucide-react"
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
interface Seller {
  seller_id: string;
  email: string;
  fullName: string;
  avatar?: string;
  created_at: Date;
  country?: string;
  phoneNumber?: string;
  preferred_currency?: string;
  verification_status?: string;
  preferred_language?: string;
  acc_status: string;
  wallet_balance: Number;
  seen: string
}

const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [SellerStatus, setSellerStatus] = useState("");
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isViewMode, setIsViewMode] = useState(false);

      const [actionType, setActionType] = useState(null); // "suspend" | "ban" | null
const [suspensionDate, setSuspensionDate] = useState("");


  useEffect(() => {
    const fetchsellers = async () => {
      try {
        const response = await getAllSellers();
        console.log(response);
        setSellers(response);
         response.forEach((item, i)=>{
          updateSellerSeen(item.seller_id)
        })
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchsellers();
  }, []);


    const handleOpenDialog = (seller:Seller, viewMode = false) => {
    setSelectedSeller(seller);
    setSellerStatus(seller.acc_status);
    setIsViewMode(viewMode);
    setIsDialogOpen(true);
    setSuspensionDate("")
  };



  const handleBanSeller = async (sellerId) => {
  try {
    await axios.put(`https://aitool.asoroautomotive.com/api/sellers/${sellerId}/account-status`, {
      acc_status: "Banned",
    });
    toast.success("Seller banned successfully");
    setIsDialogOpen(false);
  } catch (error) {
    toast.error("Failed to ban seller.");
  }
};
  const revokeBanSeller = async (sellerId) => {
  try {
    await axios.put(`https://aitool.asoroautomotive.com/api/sellers/${sellerId}/account-status`, {
      acc_status: "Okay",
    });
    toast.success("Seller unbanned successfully");
    setIsDialogOpen(false);
  } catch (error) {
    toast.error("Failed to unban seller.");
  }
};

  const handleSuspendSeller = async (date, sellerId) => {
  if (!date) {
    toast.error("Please select a suspension expiry date.");
    return;
  }

  try {
    await axios.put(`https://aitool.asoroautomotive.com/api/sellers/${sellerId}/suspension-dates`, {
     date_unsuspended: new Date(date).toISOString()
    });
    toast.success("Seller suspended successfully");
    setIsDialogOpen(false);
  } catch (error) {
    toast.error("Failed to suspend seller.");
  }
};



  console.log(sellers);
  const filteredsellers = sellers.filter((seller) =>
    // seller.sellername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

     const updateSellerSeen = async (sellerId: string) => {
    try {
      const response = await axios.put(
        `https://aitool.asoroautomotive.com/api/sellers/updateSeen/${sellerId}`
      );
      console.log("seller marked as seen:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking seller as seen:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground">
            Manage and view all registered sellers
          </p>
        </div>
        {/* <Button className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add seller
        </Button> */}
      </div>

    <Card className="glass-card">
  <CardHeader className="pb-3">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <CardTitle>All sellers</CardTitle>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search sellers..."
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
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Verification status</TableHead>
            <TableHead>Wallet balance</TableHead>
            <TableHead>Account status</TableHead>
            <TableHead>Id</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredsellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No sellers found
              </TableCell>
            </TableRow>
          ) : (
            filteredsellers.map((seller) => (
              <TableRow
                key={seller.seller_id}
                className={`transition-colors duration-300 ${
                  seller.seen === null
                    ? "bg-blue-50 border-l-4 border-blue-600 font-semibold"
                    : ""
                }`}
              >
                <TableCell>{seller.fullName}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {seller.verification_status === "true" || seller.verification_status=="verified" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      Unverified
                    </span>
                  )}
                </TableCell>
                <TableCell>${Number(seller.wallet_balance)}</TableCell>
                <TableCell>{seller.acc_status}</TableCell>
                <TableCell>{seller.seller_id}</TableCell>
                   <TableCell className="text-right space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenDialog(seller, true)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
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
  <DialogContent className="w-[90%] h-[80%] max-w-md mx-auto rounded-lg overflow-y-auto">
    <DialogHeader>
        {selectedSeller?.avatar ? (
    <img
      src={selectedSeller.avatar}
      alt="Seller"
      className="h-20 w-20 rounded-full object-cover mb-2"
    />
  ) : (
    <UserCircle className="h-20 w-20 text-gray-400 mb-2" />
  )}
      <DialogTitle>
        {isViewMode ? "Seller Details" : "Update Seller Status"}
      </DialogTitle>
      <DialogDescription>
        {isViewMode
          ? "View this Seller's details"
          : "Change the status of this Seller"}
      </DialogDescription>
    </DialogHeader>

    {selectedSeller && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Full Name</Label>
            <p className="font-medium">{selectedSeller.fullName}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Sellername</Label>
            <p className="font-medium">{selectedSeller.fullName}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
           <p className="font-medium break-words whitespace-normal text-sm leading-relaxed">
  {selectedSeller.email}
</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Seller ID</Label>
          <p className="font-medium break-words whitespace-normal text-sm leading-relaxed">
  {selectedSeller.seller_id}
</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Created At</Label>
            <p className="font-medium">
              {new Date(selectedSeller.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Wallet Balance</Label>
            <p className="font-medium">
              ${Number(selectedSeller.wallet_balance).toFixed(2)}
            </p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Verified</Label>
            <p className="font-medium capitalize">
              {selectedSeller.verification_status == "true" || selectedSeller.verification_status == "verified"? "Verified": "No"}
            </p>
          </div>
        </div>

        {isViewMode ? (
          <div>
            <Label className="text-sm text-muted-foreground">Status</Label>
            <p className="font-medium capitalize">
              {selectedSeller.acc_status}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
          </div>
        )}
      </div>
    )}

    {actionType === "suspend" && (
  <div className="mt-4 space-y-3">
    <Label htmlFor="suspend-date" className="font-medium text-sm text-gray-700">
      Suspension Expires On
    </Label>
    <Input
      type="datetime-local"
      id="suspend-date"
      value={suspensionDate}
      onChange={(e) => setSuspensionDate(e.target.value)}
      className="w-full"
    />

    <Button
      className="w-full mt-2"
      onClick={() => handleSuspendSeller(suspensionDate, selectedSeller.seller_id)}
    >
      Confirm Suspension
    </Button>
  </div>
)}

 {selectedSeller && (
  <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6 border-t pt-4">
    {selectedSeller.acc_status === "Suspended" ? (
      <div className="text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md font-medium">
        Seller is currently suspended
      </div>
    ) : (
      <Button
        variant="destructive"
        onClick={() => setActionType("suspend")}
      >
        Suspend Seller
      </Button>
    )}

    {selectedSeller.acc_status === "Banned" ? (
      <Button
        variant="default"
        onClick={() => revokeBanSeller(selectedSeller.seller_id)}
      >
        Unban Seller
      </Button>
    ) : (
      <Button
        variant="destructive"
        onClick={() => handleBanSeller(selectedSeller.seller_id)}
      >
        Ban Seller
      </Button>
    )}
  </DialogFooter>
)}


  </DialogContent>
</Dialog>

    </div>
  );
};

export default Sellers;
