import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin, adminVerifyCode } from "@/services/authService";
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

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"password" | "code">("password");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard"); // Redirect to the dashboard if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Input fields cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      // Step 1: password -> server emails a one-time code. Step 2: code -> session.
      const data = step === "password"
        ? await adminLogin({ email, password })
        : await adminVerifyCode({ email, code } as any);
      if (data.status === "otp_required") {
        setStep("code");
        toast.success("We sent a 6-digit code to your email.");
      } else if (data.status !== "success") {
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Login successful");
        // Use the login function from the AuthContext to store the admin data
        login(data); // Assuming `data` contains the admin details
        setTimeout(() => {
          navigate("/admin/dashboard"); // Adjust this route if your signed-in homepage is registered elsewhere.
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please try again.");
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
              {step === "password"
                ? "Enter your credentials to access the admin dashboard"
                : `Enter the 6-digit code we emailed to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === "code" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code">Login code</Label>
                    <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus
                      placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="admin-input text-center tracking-[0.5em] text-lg" />
                    <p className="text-xs text-muted-foreground">The code expires in 10 minutes.</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                    {isLoading ? "Checking..." : "Verify and log in"}
                  </Button>
                  <div className="flex justify-between text-xs">
                    <button type="button" className="text-primary hover:underline" onClick={() => { setStep("password"); setCode(""); }}>
                      Back
                    </button>
                    <button type="button" className="text-primary hover:underline" disabled={isLoading}
                      onClick={async () => { try { await adminLogin({ email, password }); toast.success("New code sent."); } catch { toast.error("Couldn't resend the code."); } }}>
                      Resend code
                    </button>
                  </div>
                </>
              ) : (<>
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
              </>)}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Need access? Ask an existing admin to add you.
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
