import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/services/userService";
import {
  getTickets,
  assignTicket,
  closeTicket,
  deleteTicket,
} from "@/services/ticketsService";
import * as products from "@/services/productService";
import {
  getAllPayments,
  getUserPayments,
  deletePayment,
  getPaymentStatus,
} from "@/services/paymentService";
import { getAllSellers } from "@/services/sellersServices.ts";
import { getOrders, updateOrder, deleteOrder } from "@/services/orderService";
import {
  Users,
  ShoppingCart,
  BarChart3,
  Package,
  MessageSquare,
  Tag,
  Home,
  Settings,
  LogOut,
  CreditCard,
  Wallet,
  FileText,
  User,
  LayoutDashboard,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getMessagesByTicketId } from "@/services/messagesService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  count?: number;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  onClick,
  count,
}: SidebarLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.startsWith(href);


  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigate(href);
  };

return (
  <a
    href={href}
    onClick={handleClick}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground"
    )}
  >
    <Icon className="h-4 w-4" />
    <span className="flex items-center gap-2">
      {label}
      {typeof count === "number" && count > 0 && (
        <span className="rounded-full bg-orange-600 text-white text-xs px-2 py-0.5">
          {count}
        </span>
      )}
    </span>
  </a>
);

};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const isMobile = useIsMobile()

   const [payments, setPayments] = useState([])
  const [sellers, setSellers] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [data, setData] = useState([])
  const [allData, setallData] = useState([])
    const [allTickets, setTickets]=useState([])
      const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
const totalUnreadConversations = Object.keys(unreadCounts).length;
  // Your existing fetch functions (do NOT remove or modify):

  
  useEffect(()=>{
fetchPayments();
  fetchOrders();
  fetchData();
  fetchSellers();
  fetchUsers();
fetchTickets()
  },[])



  const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    const unSeenUsers = response.filter(user => user.seen === "NOT_SEEN");
    // console.log(unSeenUsers);
    setUsers(unSeenUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    // setIsLoading(false);
  }
};


const fetchTickets = async () => {
  try {
    const response = await getTickets();
    setTickets(response.tickets)
    // console.log(unSeenTickets);
    // setTickets(unSeenTickets);
  } catch (error) {
    console.error("Error fetching Tickets:", error);
  } finally {
    // setIsLoading(false);
  }
};

const fetchSellers = async () => {
  try {
    const response = await getAllSellers();
    const unSeenSellers = response.filter(seller => seller.seen === "UN-SEEN");
    // console.log(unSeenSellers);
    setSellers(unSeenSellers);
  } catch (error) {
    console.error("Error fetching sellers:", error);
  } finally {
    // setIsLoading(false);
  }
};


const fetchData = async () => {
  try {
    const fetchedProducts = await products.fetchAllProducts();

    // Filter pending and unseen products
    const filteredProducts = fetchedProducts
      .filter(product => product.status === "pending")
      .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
   
      const filteredProducts2 = fetchedProducts
      .filter(product => product.status !== "pending" && product.seen_by_admin === null)
      .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());

    setData(filteredProducts);
    setallData(filteredProducts2)
    // console.log(filteredProducts);
  } catch (error) {
    toast.error("Failed to fetch products");
  } finally {
    // setIsLoading(false);
  }
};

  // Fetch messages for all tickets (log only for now)
useEffect(() => {
  const fetchUnreadCounts = async () => {
    const counts: Record<string, number> = {};

    for (const ticket of allTickets) {
      try {
        const messages = await getMessagesByTicketId(ticket.ticket_id);
        const unseen = messages.result.filter(
          (msg) => msg.seen_by_admin === 0
        ).length;

        if (unseen > 0) {
          counts[ticket.ticket_id] = unseen;
        }
      } catch (err) {
        console.error("Error fetching messages for ticket", ticket.ticket_id, err);
      }
    }
    // const totalUnreadConversations = Object.keys(counts).length;
    // console.log(totalUnreadConversations)
    setUnreadCounts(counts);
  };

  if (allTickets.length > 0) {
    fetchUnreadCounts();
  }
}, [allTickets]);



const fetchOrders = async () => {
  try {
    const ordersResponse = await getOrders();

    if (!ordersResponse) {
      setOrders([]);
      return;
    }

    // Filter orders unseen by admin
    const unseenOrders = ordersResponse.filter(
      (order) => order.seen_by_admin === null
    );

    // Sort by created_at descending (newest first)
    const sortedOrders = unseenOrders.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    setOrders(sortedOrders);
    // console.log(sortedOrders)
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};


  const fetchPayments = async () => {
  try {
    const paymentResponse = await getAllPayments();

    if (!paymentResponse.payments) {
      setPayments([]);
      return;
    }

    // Filter payments where seen_by_admin is false
    const unseenPayments = paymentResponse.payments.filter(
      (payment) => payment.seen_by_admin === null
    );

    // Sort by created_at descending (newest first)
    const sortedPayments = unseenPayments.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    setPayments(sortedPayments);
    // console.log(sortedPayments)
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <img
              src="https://accountshub.onrender.com/lovable-uploads/b8bc2363-f8b3-49a4-bec6-1490e3aa106a-removebg-preview.png"
              alt="AccountsHub Logo"
              className="h-10 w-auto bg-white p-2 rounded-full"
            />
            <span className="text-sm bg-white p-2 rounded-full">
              AccountsHub Admin Dashboard
            </span>
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-2 px-4">
          <nav className="flex flex-col gap-1">
            <SidebarLink
              href="/admin/dashboard"
              icon={Home}
              label="Dashboard"
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/users"
              icon={Users}
              label="Users Management"
              count={users.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/sellers"
              icon={Users}
              label="Sellers Management"
              count={sellers.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/digital-products"
              icon={FileText}
              label="Digital Products"
               count={allData.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/pending-digital-products"
              icon={FileText}
              label="Pending digital products"
              count={data.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/orders"
              icon={ShoppingCart}
              label="Orders"
              count={orders.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/payments"
              icon={CreditCard}
              label="Payments"
              count={payments.length}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/coupons"
              icon={Tag}
              label="Coupons"
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/tickets"
              icon={MessageSquare}
              label="Support Tickets"
               count={totalUnreadConversations}
              onClick={onClose}
            />
            <SidebarLink
              href="/admin/dashboard/wallet"
              icon={Wallet}
              label="Wallet Management"
              onClick={onClose}
            />
            {/* <SidebarLink
              href="/admin/dashboard/analytics"
              icon={BarChart3}
              label="Analytics"
              onClick={onClose}
            /> */}
            {/* <SidebarLink
              href="/admin/dashboard/profile"
              icon={User}
              label="Profile"
              onClick={onClose}
            /> */}
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
