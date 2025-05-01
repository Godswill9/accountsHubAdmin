import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserHomePage from "./UserHomePage";
import GuestHomePage from "./GuestHomePage";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <UserHomePage /> : <GuestHomePage />;
};

export default HomePage;