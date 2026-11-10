import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserPlus, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API = import.meta.env.VITE_API_BASE_URL;
type Admin = { admin_id: string; username: string; email: string; role: string; full_name?: string; created_at: string };

// Readable random temporary password (no look-alike characters).
const makePassword = () => {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const s = Array.from(bytes, (b) => abc[b % abc.length]).join("");
  return `${s.slice(0, 5)}-${s.slice(5, 10)}-${s.slice(10)}`;
};

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", full_name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const load = () =>
    axios.get(`${API}/admins`)
      .then((r) => setAdmins(Array.isArray(r.data) ? r.data : []))
      .catch(() => toast.error("Failed to load admins"))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ username: "", full_name: "", email: "", password: makePassword() }); setOpen(true); };

  const add = async () => {
    if (!form.username.trim() || !form.email.trim()) return toast.error("Username and email are required.");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters.");
    setSaving(true);
    try {
      await axios.post(`${API}/admin-signup`, { ...form, username: form.username.trim(), email: form.email.trim(), role: "superadmin" });
      toast.success(`${form.username} added. Share the temporary password with them securely.`);
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not add admin");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admins</h1>
          <p className="text-sm text-muted-foreground">Everyone who can sign in to this admin panel. Each login needs a code sent to their email.</p>
        </div>
        <Button onClick={openAdd}><UserPlus className="h-4 w-4 mr-2" /> Add admin</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{admins.length} admin{admins.length === 1 ? "" : "s"}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : admins.map((a) => (
                <TableRow key={a.admin_id}>
                  <TableCell className="font-medium">{a.username}</TableCell>
                  <TableCell>{a.full_name || "—"}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell className="capitalize">{a.role}</TableCell>
                  <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>Add admin</DialogTitle>
            <DialogDescription>
              They get full admin access. Send them the temporary password privately; they’ll also need the login code emailed to them each time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ad-username">Username</Label>
              <Input id="ad-username" value={form.username} maxLength={85} onChange={set("username")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-name">Full name (optional)</Label>
              <Input id="ad-name" value={form.full_name} maxLength={255} onChange={set("full_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-email">Email</Label>
              <Input id="ad-email" type="email" value={form.email} maxLength={95} onChange={set("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-pass">Temporary password</Label>
              <div className="flex gap-2">
                <Input id="ad-pass" value={form.password} onChange={set("password")} className="font-mono" />
                <Button type="button" variant="outline" size="icon" aria-label="Copy password"
                  onClick={() => navigator.clipboard?.writeText(form.password).then(() => toast.success("Copied"))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">At least 8 characters. Ask them to change it after their first login.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={add} disabled={saving}>{saving ? "Adding…" : "Add admin"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminsPage;
