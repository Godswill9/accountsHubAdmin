
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();

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
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span>Admin Portal</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
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
            />
            <SidebarLink
              href="/admin/dashboard/users"
              icon={Users}
              label="Users Management"
            />
            <SidebarLink
              href="/admin/dashboard/digital-products"
              icon={FileText}
              label="Digital Products"
            />
            <SidebarLink
              href="/admin/dashboard/homepage-management"
              icon={LayoutDashboard}
              label="Homepage"
            />
            <SidebarLink
              href="/admin/dashboard/orders"
              icon={ShoppingCart}
              label="Orders"
            />
            <SidebarLink
              href="/admin/dashboard/payments"
              icon={CreditCard}
              label="Payments"
            />
            <SidebarLink
              href="/admin/dashboard/coupons"
              icon={Tag}
              label="Coupons"
            />
            <SidebarLink
              href="/admin/dashboard/tickets"
              icon={MessageSquare}
              label="Support Tickets"
            />
            <SidebarLink
              href="/admin/dashboard/wallet"
              icon={Wallet}
              label="Wallet Management"
            />
            <SidebarLink
              href="/admin/dashboard/analytics"
              icon={BarChart3}
              label="Analytics"
            />
            <SidebarLink
              href="/admin/dashboard/profile"
              icon={User}
              label="Profile"
            />
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
