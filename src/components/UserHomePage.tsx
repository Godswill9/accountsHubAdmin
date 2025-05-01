import React from "react";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

const UserHomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <a href="/wallet" className="text-blue-600 underline">Go to Wallet</a>
    </div>
  );
};

export default UserHomePage;