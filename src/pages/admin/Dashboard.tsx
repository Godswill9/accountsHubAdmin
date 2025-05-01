import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetrics, getOrders, getAllUsers } from "@/services/adminService";
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

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsResponse, usersResponse, ordersResponse] =
          await Promise.all([getMetrics(), getAllUsers(), getOrders()]);

        setMetrics(metricsResponse.metrics);
        setUsers(usersResponse);
        setOrders(ordersResponse);

        // Process metrics for chart data
        const salesMetrics = metricsResponse.metrics.filter(
          (metric: any) => metric.name === "sales"
        );

        // Format data for chart
        const formattedData = salesMetrics.map((metric: any) => ({
          date: new Date(metric.date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          sales: metric.value,
        }));

        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary metrics
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.amount) * Number(order.quantity),
    0
  );
  const salesGrowth =
    salesData.length > 1
      ? (
          ((salesData[salesData.length - 1]?.sales - salesData[0]?.sales) /
            salesData[0]?.sales) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
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
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoading ? "..." : totalSales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${salesGrowth}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to first month
            </p>
          </CardContent>
        </Card>
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
                  <YAxis />
                  <Tooltip />
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
                      <p className="text-sm font-medium">
                        Order #{order.order_id}
                      </p>
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
