import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Convo = { ticket_id: string; subject: string; status: string; updated_at: string };

// "Message" button for the user/seller detail dialogs. Starts a support conversation the person sees in
// their Tickets/Support page (titled "Message from AccountsHub: …"); they get one email for it.
const MessageAccountDialog = ({ recipientId, recipientType, name, label = "Message" }: {
  recipientId: string; recipientType: "user" | "seller"; name?: string; label?: string;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [convos, setConvos] = useState<Convo[]>([]);
  const [target, setTarget] = useState("new"); // "new" or an existing ticket_id

  // Open conversations with this person (theirs or ours); default to continuing the latest one.
  useEffect(() => {
    if (!open) return;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tickets`).then((r) => {
      const mine: Convo[] = (r.data?.tickets || [])
        .filter((t: any) => t.user_id === recipientId && t.status !== "closed")
        .sort((a: Convo, b: Convo) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setConvos(mine);
      setTarget(mine[0]?.ticket_id || "new");
    }).catch(() => { setConvos([]); setTarget("new"); });
  }, [open, recipientId]);
  const isNew = target === "new";

  const send = async () => {
    if (!isNew) { // read the history and reply in admin Tickets
      setOpen(false);
      return navigate(`/admin/dashboard/tickets/${target}`);
    }
    if (!subject.trim() || !message.trim()) return toast.error("Write a subject and a message.");
    setSending(true);
    try {
      const r = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/message-account`, {
        recipient_id: recipientId, recipient_type: recipientType, subject: subject.trim(), message: message.trim(),
      });
      toast.success(`Message sent to ${name || "the account"}. They've been emailed.`, {
        action: { label: "Open conversation", onClick: () => navigate(`/admin/dashboard/tickets/${r.data.ticket_id}`) },
      });
      setOpen(false);
      setSubject("");
      setMessage("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not send the message");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <MessageSquare className="h-4 w-4 mr-2" /> {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>Message {name || (recipientType === "seller" ? "seller" : "user")}</DialogTitle>
            <DialogDescription>
              {isNew
                ? `Appears in their ${recipientType === "seller" ? "Support page" : "Support Tickets"} and notifications, plus one email. They can reply there.`
                : "Opens the conversation so you can read the history and reply. They get a notification for each reply."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {convos.length > 0 && (
              <div className="space-y-2">
                <Label>Conversation</Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {convos.map((c) => (
                      <SelectItem key={c.ticket_id} value={c.ticket_id}>Continue: {c.subject}</SelectItem>
                    ))}
                    <SelectItem value="new">Start a new conversation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isNew && (
              <div className="space-y-2">
                <Label htmlFor="msg-subject">Subject</Label>
                <Input id="msg-subject" value={subject} maxLength={150} onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. About your recent order" />
              </div>
            )}
            {isNew && (
              <div className="space-y-2">
                <Label htmlFor="msg-body">Message</Label>
                <Textarea id="msg-body" rows={6} value={message} maxLength={5000} onChange={(e) => setMessage(e.target.value)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>Cancel</Button>
            <Button onClick={send} disabled={sending}>
              {!isNew ? "Continue conversation" : sending ? "Sending…" : "Send message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageAccountDialog;
