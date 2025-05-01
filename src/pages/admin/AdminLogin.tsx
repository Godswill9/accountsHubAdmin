import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin, verifyAdmin } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

interface AdminData {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const admin = await verifyAdmin();
  //       console.log(admin);
  //       if (admin && admin.admin_id) {
  //         // setAdmin(admin as Admin);
  //         // setIsAuthenticated(true);
  //       }
  //     } catch (error) {
  //       // setAdmin(null);
  //       // setIsAuthenticated(true);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("input fields cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      const response = await adminLogin({ email, password });
      const data = await response;
      console.log(data);
      // If the returned message is not "Please log in again.", it's a success
      if (data.message) {
        toast.error(data.message);
      } else {
        toast.error(data.status);
        // Redirect to the signed-in homepage after 2 seconds.
        setTimeout(() => {
          navigate("/"); // Adjust this route if your signed-in homepage is registered elsewhere.
        }, 2000);
      }
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an admin account?{" "}
              <Link to="/admin/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              <Link to="/" className="hover:underline">
                Return to homepage
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
