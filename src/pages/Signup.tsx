
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { Helmet } from "react-helmet";

const Signup = () => {
  return (
    <>
      <Helmet>
        <title>Sign Up | AccsMarket - Social Media Accounts Store</title>
        <meta name="description" content="Create your account to access premium digital products and services." />
      </Helmet>
      <AuthLayout>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <SignupForm />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Login
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default Signup;
