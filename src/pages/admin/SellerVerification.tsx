import { useEffect, useState } from "react";
import { live } from "@/lib/live";
import axios from "axios";
import { toast } from "sonner";
import { ShieldCheck, Eye, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API = import.meta.env.VITE_API_BASE_URL;
type Status = "pending" | "approved" | "rejected" | "all";

const ID_LABELS: Record<string, string> = {
  nin_slip: "NIN slip / card", national_id: "National ID", drivers_license: "Driver's licence",
  passport: "International passport", voters_card: "Voter's card",
};

interface KycRow {
  seller_id: string; legal_name: string; id_type: string; status: Exclude<Status, "all">;
  rejection_reason: string | null; submitted_at: string; reviewed_at: string | null;
  fullName: string; email: string; country?: string; phoneNumber?: string;
}
interface KycDetail extends KycRow {
  nin: string; date_of_birth: string; seller_since: string; reviewed_by: string | null;
  id_document_url: string; selfie_url: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const style = { pending: "text-yellow-800 bg-yellow-100", approved: "text-green-700 bg-green-100", rejected: "text-red-700 bg-red-100" }[status] || "";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${style}`}>{status}</span>;
};

const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—");

const SellerVerification = () => {
  const [tab, setTab] = useState<Status>("pending");
  const [rows, setRows] = useState<KycRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<KycDetail | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async (status: Status = tab) => {
    try {
      const r = await axios.get(`${API}/admin/kyc`, { params: { status } });
      setRows(r.data.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    load(tab);
    return live(() => load(tab));
  }, [tab]);

  // Image links expire after 10 minutes, so details are fetched fresh each time a review is opened.
  const open = async (sellerId: string) => {
    try {
      const r = await axios.get(`${API}/admin/kyc/${sellerId}`);
      setReason("");
      setDetail(r.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load details");
    }
  };

  const decide = async (approve: boolean) => {
    if (!detail) return;
    if (!approve && reason.trim().length < 5) return toast.error("Write a reason (at least 5 characters) so the seller knows what to fix.");
    setBusy(true);
    try {
      await axios.post(`${API}/admin/kyc/${detail.seller_id}/${approve ? "approve" : "reject"}`, approve ? {} : { reason: reason.trim() });
      toast.success(approve ? "Seller verified. They've been emailed." : "Verification rejected. The seller has been emailed.");
      setDetail(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-7 w-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Seller Verification</h1>
          <p className="text-sm text-muted-foreground">Check each seller's NIN, ID photo and selfie match before approving.</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Status)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader><CardTitle className="text-base">{rows.length} {tab === "all" ? "" : tab} submission{rows.length === 1 ? "" : "s"}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Legal name</TableHead>
                <TableHead>ID type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Nothing here.</TableCell></TableRow>
              ) : rows.map((k) => (
                <TableRow key={k.seller_id}>
                  <TableCell><div className="font-medium">{k.fullName}</div><div className="text-xs text-muted-foreground">{k.email}</div></TableCell>
                  <TableCell>{k.legal_name}</TableCell>
                  <TableCell>{ID_LABELS[k.id_type] || k.id_type}</TableCell>
                  <TableCell>{fmt(k.submitted_at)}</TableCell>
                  <TableCell><StatusBadge status={k.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant={k.status === "pending" ? "default" : "outline"} onClick={() => open(k.seller_id)}>
                      <Eye className="h-4 w-4 mr-1" /> {k.status === "pending" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{detail.legal_name} <StatusBadge status={detail.status} /></DialogTitle>
                <DialogDescription>Account: {detail.fullName} · {detail.email}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div><Label className="text-muted-foreground">NIN</Label><p className="font-mono font-medium">{detail.nin}</p></div>
                <div><Label className="text-muted-foreground">Date of birth</Label><p className="font-medium">{new Date(detail.date_of_birth).toLocaleDateString()}</p></div>
                <div><Label className="text-muted-foreground">ID type</Label><p className="font-medium">{ID_LABELS[detail.id_type] || detail.id_type}</p></div>
                <div><Label className="text-muted-foreground">Country</Label><p className="font-medium">{detail.country || "—"}</p></div>
                <div><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{detail.phoneNumber || "—"}</p></div>
                <div><Label className="text-muted-foreground">Seller since</Label><p className="font-medium">{fmt(detail.seller_since)}</p></div>
                <div><Label className="text-muted-foreground">Submitted</Label><p className="font-medium">{fmt(detail.submitted_at)}</p></div>
                {detail.reviewed_at && <div><Label className="text-muted-foreground">Reviewed</Label><p className="font-medium">{fmt(detail.reviewed_at)}</p></div>}
                {detail.rejection_reason && <div className="col-span-full"><Label className="text-muted-foreground">Rejection reason</Label><p className="font-medium text-red-700">{detail.rejection_reason}</p></div>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[["ID document", detail.id_document_url], ["Selfie", detail.selfie_url]].map(([label, url]) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 inline-flex items-center gap-1">Open full size <ExternalLink className="h-3 w-3" /></a>
                    </div>
                    <img src={url} alt={label} className="w-full h-64 object-contain rounded-md border bg-gray-50" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Photo links expire after 10 minutes. Close and reopen to refresh them.</p>

              {detail.status === "pending" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason (required to reject; sent to the seller)</Label>
                    <Textarea id="reason" value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. The name on your ID doesn't match the name you entered." />
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="destructive" disabled={busy} onClick={() => decide(false)}>Reject</Button>
                    <Button disabled={busy} onClick={() => decide(true)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerVerification;
