import React from "react";
import Header from "@/components/UserHeader";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import WalletButton from "@/components/WalletButton";

const UserHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Full-featured header for signed in users */}
      <Header />
      <main className="flex-grow">
        <Hero />
        <section className="container mx-auto px-4 py-12">
          <WalletButton /> {/* Add WalletButton for signed-in users */}
          <FeaturedProducts />
          {/* Other full-access features (orders, account management, etc.) can be added here */}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserHomePage;
