import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders, updateOrder, deleteOrder } from "@/services/orderService";
// import { getMetrics, getOrders, getAllUsers } from "@/services/adminService";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllUsers } from "@/services/userService";
import { getAllSellers } from "@/services/sellersServices";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [salesGrowth, setSalesGrowth] = useState<string>("0");

  // 👇 Main useEffect to fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch everything in parallel
        const [ordersResponse, usersResponse, sellersResponse] =
          await Promise.all([getOrders(), getAllUsers(), getAllSellers()]);

        setOrders(ordersResponse);
        setUsers(usersResponse);
        setSellers(sellersResponse);

        // Build chart data from orders
        const formattedData = ordersResponse.map((order: any) => ({
          date: new Date(order.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          sales: Number(order.amount),
        }));

        setSalesData(formattedData);

        // Group sales by month
        const monthGroups = formattedData.reduce((acc, item) => {
          if (!acc[item.date]) acc[item.date] = 0;
          acc[item.date] += item.sales;
          return acc;
        }, {} as Record<string, number>);

        // Sort dates to get latest and previous months
        const sortedMonths = Object.keys(monthGroups).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        if (sortedMonths.length >= 2) {
          const prevMonth = sortedMonths[sortedMonths.length - 2];
          const currMonth = sortedMonths[sortedMonths.length - 1];

          const prevSales = monthGroups[prevMonth];
          const currSales = monthGroups[currMonth];

          const growth =
            prevSales > 0
              ? (((currSales - prevSales) / prevSales) * 100).toFixed(1)
              : "0";

          setSalesGrowth(growth);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate summary metrics
  const totalUsers = users.length;
  const totalSellers = sellers.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.amount) * Number(order.quantity),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalUsers}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +12% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalSellers}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +12% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalOrders}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +18% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalSales)}
            </div>

            {/* <p className="text-xs text-muted-foreground">
              +25% from last month
            </p> */}
          </CardContent>
        </Card>

        {/* total money on site (add all wallets for both sellers and buyers)
        sum of admin withdrawable money  (net sales) */}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />

                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0, // optional: round to dollars
                      }).format(value)
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        typeof value === "number" ? value : Number(value)
                      )
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.order_id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.item_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        ${Number(order.amount).toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          order.status === "completed"
                            ? "text-green-500"
                            : "text-amber-500"
                        }`}
                      >
                        {order.payment_status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
