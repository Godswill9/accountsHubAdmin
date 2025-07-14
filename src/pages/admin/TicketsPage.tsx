import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTickets,
  assignTicket,
  closeTicket,
  deleteTicket,
} from "@/services/ticketsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Trash2,
  MessageSquare,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getMessagesByTicketId } from "@/services/messagesService";

interface Ticket {
  admin_id: string;
  category: string;
  message: string;
  priority: string;
  description: string;
  status: string;
  subject: string;
  ticket_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

const TicketsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [allTickets, setTickets]=useState([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
const totalUnreadConversations = Object.keys(unreadCounts).length;



  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  
  // Set tickets when data arrives
  useEffect(() => {
    if (data?.tickets) {
      setTickets(data.tickets);
    }
  }, [data]);

  // Fetch messages for all tickets (log only for now)
useEffect(() => {
  const fetchUnreadCounts = async () => {
    const counts: Record<string, number> = {};

    for (const ticket of allTickets) {
      try {
        const messages = await getMessagesByTicketId(ticket.ticket_id);
        const unseen = messages.result.filter(
          (msg) => msg.seen_by_admin === 0
        ).length;

        if (unseen > 0) {
          counts[ticket.ticket_id] = unseen;
        }
      } catch (err) {
        console.error("Error fetching messages for ticket", ticket.ticket_id, err);
      }
    }
    setUnreadCounts(counts);
  };

  if (allTickets.length > 0) {
    fetchUnreadCounts();
  }
}, [allTickets]);



  const assignTicketMutation = useMutation({
    mutationFn: (ticketId: string) =>
      assignTicket(ticketId, admin?.admin_id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket assigned successfully");
      setIsAssignDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign ticket");
    },
  });

  const closeTicketMutation = useMutation({
    mutationFn: (ticketId: string) => closeTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket closed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to close ticket");
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (ticketId: string) => deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete ticket");
    },
  });

  const filteredTickets =
    data?.tickets?.filter(
      (ticket: Ticket) =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleViewTicket = (ticketId: string) => {
    navigate(`/admin/dashboard/tickets/${ticketId}`);
  };

  const handleAssignDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsAssignDialogOpen(true);
  };

  const handleAssignTicket = () => {
    if (selectedTicket) {
      assignTicketMutation.mutate(selectedTicket.ticket_id);
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      closeTicketMutation.mutate(ticketId);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      deleteTicketMutation.mutate(ticketId);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer support tickets
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative inline-flex items-center flex-wrap gap-2">
  <CardTitle>All Tickets</CardTitle>
  {totalUnreadConversations > 0 && (
    <span className="ml-1 bg-red-500 text-white text-xs font-semibold h-5 px-2 rounded-full flex items-center justify-center whitespace-nowrap">
      <span className="block sm:hidden">{totalUnreadConversations}</span>
      <span className="hidden sm:block">
        {totalUnreadConversations} unread conversations
      </span>
    </span>
  )}
</div>



            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket: Ticket) => (
                    <TableRow key={ticket.ticket_id}>
                      <TableCell className="font-medium">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.user_id}</TableCell>
                      <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{ticket.admin_id || "Unassigned"}</TableCell>
                      <TableCell className="text-right space-x-2">
                       <Button
  variant="ghost"
  size="icon"
  onClick={() => handleViewTicket(ticket.ticket_id)}
  className="relative"
>
  <MessageSquare className="h-4 w-4" />
 {unreadCounts[ticket.ticket_id] > 0 && (
  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold min-w-[16px] h-[16px] px-[4px] rounded-full flex items-center justify-center">
    {unreadCounts[ticket.ticket_id]}
  </span>
)}
  <span className="sr-only">View</span>
</Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAssignDialog(ticket)}
                          disabled={ticket.status.toLowerCase() === "closed"}
                        >
                          <UserCheck className="h-4 w-4" />
                          <span className="sr-only">Assign</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCloseTicket(ticket.ticket_id)}
                          disabled={ticket.status.toLowerCase() === "closed"}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTicket(ticket.ticket_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to yourself or another admin
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Ticket Title
                  </Label>
                  <p className="font-medium">{selectedTicket.subject}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Current Status
                  </Label>
                  <p className="font-medium capitalize">
                    {selectedTicket.status}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Currently Assigned To
                  </Label>
                  <p className="font-medium">
                    {selectedTicket.admin_id || "Unassigned"}
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">
                    You are about to assign this ticket to yourself (
                    {admin?.email}). You will be responsible for responding to
                    this ticket.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={handleAssignTicket}
              disabled={assignTicketMutation.isPending}
            >
              {assignTicketMutation.isPending ? "Assigning..." : "Assign to Me"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
