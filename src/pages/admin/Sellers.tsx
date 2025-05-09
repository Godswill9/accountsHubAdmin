import { useEffect, useState } from "react";
import { getAllSellers } from "@/services/sellersServices.ts";
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
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
}

const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchsellers = async () => {
      try {
        const response = await getAllSellers();
        console.log(response);
        setSellers(response);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchsellers();
  }, []);
  console.log(sellers);
  const filteredsellers = sellers.filter((seller) =>
    // seller.sellername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  {/* <TableHead>Name</TableHead> */}
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Verification status</TableHead>
                  <TableHead>Wallet balance</TableHead>
                  <TableHead>Account status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredsellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      No sellers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredsellers.map((seller) => (
                    <TableRow key={seller.seller_id}>
                      {/* <TableCell className="font-medium">
                        {seller.sellername}
                      </TableCell> */}
                      <TableCell>{seller.fullName}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>
                        {new Date(seller.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {seller.verification_status === "true" ? (
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
                      <TableCell className="text-right space-x-2">
                        {/* <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button> */}
                        <Button variant="ghost" size="icon">
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
    </div>
  );
};

export default Sellers;
