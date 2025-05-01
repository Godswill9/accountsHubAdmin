
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [code, setVerificationCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, verifyCode, isLoading } = useAuth();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!verificationStep) {
      // Step 1: Register user
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      try {
        await signup(name, email, password, "");
        toast({
          title: "Success",
          description: "Signup successful. Please verify your email.",
          variant: "default", // Changed from 'success' to 'default'
        });
        setVerificationStep(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Signup failed";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Signup error:", error);
      }
    } else {
      // Step 2: Verify email with code
      if (!code) {
        toast({
          title: "Error",
          description: "Please enter the verification code",
          variant: "destructive",
        });
        return;
      }

      try {
        await verifyCode(email, code);
        toast({
          title: "Success",
          description: "Your account has been verified. You can now log in.",
        });
        navigate("/login");
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Verification failed",
          variant: "destructive",
        });
        console.error("Verification error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {!verificationStep ? (
        // Step 1: Registration form
        <>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </label>
          </div>
        </>
      ) : (
        // Step 2: Verification code
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">
            We've sent a verification code to your email. Please enter it below
            to verify your account.
          </p>
          <Input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full"
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Processing..."
          : verificationStep
          ? "Verify Account"
          : "Sign up"}
      </Button>

      {!verificationStep && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Facebook
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;
