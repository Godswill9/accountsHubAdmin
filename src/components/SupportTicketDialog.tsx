
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import { messageService, Message } from "@/services/messageService";
import {
  MessageCircleQuestion,
  Paperclip,
  Send,
  X,
  FileText,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportTicketDialog = ({
  isOpen,
  onOpenChange,
}: SupportTicketDialogProps) => {
  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [user_id, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Messaging & file state
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response) {
          setUserId(response.id);
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch messages when ticket exists and dialog is open
  useEffect(() => {
    if (ticketId && isOpen) {
      const fetchTicketMessages = async () => {
        try {
          const fetchedMessages = await messageService.fetchMessages({
            ticketId,
          });
          setMessages(fetchedMessages);

          // Mark unread messages as seen
          fetchedMessages.forEach((msg) => {
            if (!msg.seen && msg.sender === "admin") {
              messageService.markAsSeen(msg.id);
            }
          });

          setTimeout(scrollToBottom, 100);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      fetchTicketMessages();

      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchTicketMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [ticketId, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ticketService.createTicket({
        subject,
        message,
        category,
        user_id,
      });

      // Set the ticket ID to enable messaging
      setTicketId(response.ticketId);

      // Reset initial form
      setSubject("");
      setMessage("");
      setCategory("general");

      // Add initial message to the messages list
      setMessages([
        {
          id: response.messageId,
          ticketId: response.ticketId,
          content: message,
          sender: "user",
          timestamp: new Date().toISOString(),
          seen: true,
        },
      ]);
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!ticketId) return;

    setIsSendingMessage(true);
    try {
      let content = newMessage;
      const attachments = selectedFiles;
      
      const sentMessage = await messageService.sendMessage({
        ticketId,
        content,
        attachments,
        sender: "user"
      });

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Get file icon based on type
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <Image className="h-4 w-4" />;
    }

    return <FileText className="h-4 w-4" />;
  };

  // Reset dialog state when closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Only reset if user is closing the dialog
      if (!ticketId) {
        setSubject("");
        setMessage("");
        setCategory("general");
      }

      setNewMessage("");
      setSelectedFiles([]);
    }

    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        {!ticketId ? (
          // Create ticket form
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageCircleQuestion className="mr-2 h-5 w-5 text-blue-600" />
                Create Support Ticket
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new support ticket. Our team
                will respond as soon as possible.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="col-span-3"
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right pt-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="col-span-3"
                  rows={5}
                  required
                  placeholder="Please describe your issue in detail"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Chat interface for existing ticket
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MessageCircleQuestion className="mr-2 h-5 w-5 text-blue-600" />
                Support Chat
              </DialogTitle>
              <DialogDescription>
                Continue your conversation with our support team.
              </DialogDescription>
            </DialogHeader>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto py-4 px-1">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%] rounded-lg p-3 relative",
                      msg.sender === "user"
                        ? "ml-auto bg-blue-600 text-white"
                        : "mr-auto bg-gray-100 text-gray-800"
                    )}
                  >
                    {!msg.seen && msg.sender === "admin" && (
                      <div
                        className="absolute -left-2 top-1 h-2 w-2 rounded-full bg-red-500"
                        title="New message"
                      ></div>
                    )}
                    <div>{msg.content}</div>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center text-sm underline",
                              msg.sender === "user"
                                ? "text-white"
                                : "text-blue-600"
                            )}
                          >
                            {getFileIcon(url)}
                            <span className="ml-1">Attachment {idx + 1}</span>
                          </a>
                        ))}
                      </div>
                    )}
                    <div
                      className={cn(
                        "text-xs mt-1",
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      )}
                    >
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="border-t border-gray-200 pt-2 px-3">
                <p className="text-sm text-gray-500 mb-1">Selected files:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm"
                    >
                      {getFileIcon(file.name)}
                      <span className="mx-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message input */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAttachClick}
                className="flex-shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  isSendingMessage ||
                  (!newMessage.trim() && selectedFiles.length === 0)
                }
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDialog;
