
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-4 sm:mb-6">
            <Link to="/" className="inline-block">
              <span className="sr-only">Digital Products Marketplace</span>
              <div className="flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center">
                  <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded mr-1">Digital</span>
                  Products
                </span>
              </div>
            </Link>
          </div>
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md space-y-4 sm:space-y-6">
            {children}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {window.location.pathname.includes('login') ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-800">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                    Log in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
