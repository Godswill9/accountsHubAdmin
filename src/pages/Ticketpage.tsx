
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import { MessageCircleQuestion } from "lucide-react";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const TicketPage: React.FC = () => {
  // User and ticket form states
  const [userId, setUserId] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [initialMessage, setInitialMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // On mount, verify user auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.verifyUser();
        if (user) {
          setUserId(user.id);
        } else {
          toast.error("Please log in to create a support ticket");
          navigate("/login");
        }
      } catch (error) {
        console.error("User not authenticated", error);
        toast.error("Authentication required");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // Create a new ticket (and send initial message)
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await ticketService.createTicket({
        subject,
        message: initialMessage,
        category,
        user_id: userId
      });
      
      toast.success("Ticket created successfully");
      
      // Redirect to the chat page for this ticket
      navigate(`/chat/${response.ticketId}`);
    } catch (error) {
      console.error("Ticket creation failed:", error);
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
            <MessageCircleQuestion className="h-6 w-6 text-blue-600" />
            Create Support Ticket
          </h1>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>How can we help you?</CardTitle>
              <CardDescription>
                Fill out the form below to create a new support ticket. Our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleCreateTicket}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="initialMessage">Message</Label>
                  <Textarea
                    id="initialMessage"
                    value={initialMessage}
                    onChange={e => setInitialMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Describe your issue in detail"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/tickets')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Submitting Ticket..." : "Create Ticket"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TicketPage;
