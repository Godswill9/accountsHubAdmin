import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/userService";
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
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  fullName: string;
  verified: string;
  acc_status: string;
  wallet_balance: Number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        response.forEach((item, i)=>{
          // console.log(item.id)
          updateUserSeen(item.id)
        })
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  console.log(users);
  const filteredUsers = users.filter((user) =>
    // user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

   const updateUserSeen = async (userId: string) => {
    try {
      const response = await axios.put(
        `https://aitool.asoroautomotive.com/api/users/updateSeen/${userId}`
      );
      console.log("user marked as seen:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking user as seen:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and view all registered users
          </p>
        </div>
        {/* <Button className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button> */}
      </div>

     <Card className="glass-card">
  <CardHeader className="pb-3">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <CardTitle>All Users</CardTitle>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Wallet balance</TableHead>
            <TableHead>Verification status</TableHead>
            <TableHead>Id</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className={`transition-colors duration-300 ${
                  user.seen === null
                    ? "bg-yellow-50 border-l-4 border-yellow-400 font-semibold"
                    : ""
                }`}
              >
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>${Number(user.wallet_balance)}</TableCell>
                <TableCell>
                  {user.verified === "true" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      Unverified
                    </span>
                  )}
                </TableCell>
                 <TableCell>{user.id}</TableCell>
                <TableCell className="text-right space-x-2">
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

export default UsersPage;
