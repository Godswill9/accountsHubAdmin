import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
// import { resetPassword, verifyPasswordResetToken } from "@/services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!token) {
    //     toast.error("Reset token is missing");
    //     navigate("/admin/login");
    //     return;
    // }
    // const checkToken = async () => {
    //     try {
    //         await verifyPasswordResetToken(token);
    //         setIsTokenValid(true);
    //     } catch (error) {
    //         toast.error("Invalid or expired reset token");
    //         setTimeout(() => navigate("/admin/forgot-password"), 2000);
    //     } finally {
    //         setIsTokenChecking(false);
    //     }
    // };
    // checkToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (password !== confirmPassword) {
    //         toast.error("Passwords do not match");
    //         return;
    //     }
    //     if (password.length < 6) {
    //         toast.error("Password must be at least 6 characters long");
    //         return;
    //     }
    //     setIsLoading(true);
    //     try {
    //         await resetPassword(token!, password);
    //         toast.success("Password reset successful");
    //         navigate("/admin/login");
    //     } catch (error) {
    //         // Error handling is done in the API client
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    // if (isTokenChecking) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
    //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    //         </div>
    //     );
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <Card className="glass-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Invalid Token
            </CardTitle>
            <CardDescription className="text-center">
              Your password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/admin/forgot-password">
              <Button>Request a new link</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center text-muted-foreground">
              <Link to="/admin/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
