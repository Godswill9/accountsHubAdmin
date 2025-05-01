
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SupportTicketButton: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Link to="/tickets">
      <Button 
        variant="ghost" 
        size={isMobile ? "icon" : "sm"} 
        className={`relative transition-all ${
          isMobile 
            ? "h-9 w-9 p-0" 
            : "text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center"
        }`}
        aria-label="Support"
      >
        <MessageCircleQuestion className={isMobile ? "h-5 w-5" : "h-4 w-4 mr-1"} />
        {!isMobile && "Support"}
      </Button>
    </Link>
  );
};

export default SupportTicketButton;
