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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import axios from "axios";
import { UserCircle } from "lucide-react"
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  fullName: string;
  verified: string;
  acc_status: string;
  wallet_balance: Number;
  seen?:string;
  profilePhoto?:string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [UserStatus, setUserStatus] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

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


  const handleUserAction= (action)=>{
    console.log(action)
  }


  
    const handleBanUser = async (userId) => {
    try {
      await axios.put(`https://aitool.asoroautomotive.com/api/users/${userId}/account-status`, {
        acc_status: "Banned",
      });
      toast.success("User banned successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to ban User.");
    }
  };
    const revokeBanUser = async (userId) => {
    try {
      await axios.put(`https://aitool.asoroautomotive.com/api/users/${userId}/account-status`, {
        acc_status: "Okay",
      });
      toast.success("User unbanned successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to unban User.");
    }
  };

   const handleOpenDialog = (user:User, viewMode = false) => {
    setSelectedUser(user);
    setUserStatus(user.acc_status);
    setIsViewMode(viewMode);
    setIsDialogOpen(true);
  };

  // console.log(users);
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
                {/* <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell> */}
                  <TableCell className="text-right space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenDialog(user, true)}
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
        {selectedUser?.profilePhoto ? (
    <img
      src={selectedUser.profilePhoto}
      alt="User"
      className="h-20 w-20 rounded-full object-cover mb-2"
    />
  ) : (
    <UserCircle className="h-20 w-20 text-gray-400 mb-2" />
  )}
      <DialogTitle>
        {isViewMode ? "User Details" : "Update User Status"}
      </DialogTitle>
      <DialogDescription>
        {isViewMode
          ? "View this user's details"
          : "Change the status of this user"}
      </DialogDescription>
    </DialogHeader>

    {selectedUser && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Full Name</Label>
            <p className="font-medium">{selectedUser.fullName}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
           <p className="font-medium break-words whitespace-normal text-sm leading-relaxed">
  {selectedUser.email}
</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">User ID</Label>
          <p className="font-medium break-words whitespace-normal text-sm leading-relaxed">
  {selectedUser.id}
</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Created At</Label>
            <p className="font-medium">
              {new Date(selectedUser.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Wallet Balance</Label>
            <p className="font-medium">
              ${Number(selectedUser.wallet_balance).toFixed(2)}
            </p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Verified</Label>
            <p className="font-medium capitalize">
              {selectedUser.verified || "No"}
            </p>
          </div>
        </div>

        {isViewMode ? (
          <div>
            <Label className="text-sm text-muted-foreground">Status</Label>
            <p className="font-medium capitalize">
              {selectedUser.acc_status}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* <Label htmlFor="status">Account Status</Label>
            <Select value={UserStatus} onValueChange={setUserStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        )}
      </div>
    )}
  {/* <Button variant="destructive" onClick={() => handleUserAction("suspend")}>
    Suspend User
  </Button> */}

  {selectedUser && (
   <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
    {selectedUser.acc_status === "Banned" ? (
      <Button
        variant="default"
        onClick={() => revokeBanUser(selectedUser.id)}
      >
        Unban User
      </Button>
    ) : (
      <Button
        variant="destructive"
        onClick={() => handleBanUser(selectedUser.id)}
      >
        Ban User
      </Button>
    )}
</DialogFooter>
)}

  </DialogContent>
</Dialog>


    </div>
  );
};

export default UsersPage;
