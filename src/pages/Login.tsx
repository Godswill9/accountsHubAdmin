
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { Helmet } from "react-helmet";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login | AccsMarket - Social Media Accounts Store</title>
      </Helmet>
      <AuthLayout>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
