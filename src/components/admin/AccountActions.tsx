import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = import.meta.env.VITE_API_BASE_URL;

// "Okay" / "Banned" / "Suspended until <date>" as a small coloured label.
export const AccountStatus = ({ status, until }: { status: string; until?: string | null }) => {
  const style = status === "Banned" ? "text-red-700 bg-red-100" : status === "Suspended" ? "text-yellow-800 bg-yellow-100" : "text-green-700 bg-green-100";
  const text = status === "Okay" ? "Active" : status === "Suspended" && until ? `Suspended until ${new Date(until).toLocaleString()}` : status;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}>{text}</span>;
};

// Ban / unban / suspend until a date / lift suspension, for a buyer ("user") or seller. Same rules on the server.
const AccountActions = ({ kind, id, status, onDone }: {
  kind: "user" | "seller"; id: string; status: string;
  onDone?: (acc_status: string, date_unsuspended: string | null) => void;
}) => {
  const [suspending, setSuspending] = useState(false);
  const [until, setUntil] = useState("");
  const [confirmBan, setConfirmBan] = useState(false);
  const [busy, setBusy] = useState(false);
  const label = kind === "seller" ? "Seller" : "User";

  const set = async (acc_status: string, date?: string) => {
    setBusy(true);
    try {
      const r = await axios.put(`${API}/${kind === "seller" ? "sellers" : "users"}/${id}/account-status`,
        { acc_status, ...(date ? { date_unsuspended: new Date(date).toISOString() } : {}) });
      toast.success(r.data?.message || "Account updated");
      setSuspending(false); setConfirmBan(false); setUntil("");
      onDone?.(acc_status, r.data?.data?.date_unsuspended ?? null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not update the account");
    } finally {
      setBusy(false);
    }
  };

  // datetime-local wants local "YYYY-MM-DDTHH:mm"; earliest choice is a minute from now.
  const minLocal = new Date(Date.now() + 60_000 - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

  return (
    <div className="w-full space-y-3">
      {suspending && status !== "Suspended" && (
        <div className="space-y-2 rounded-md border p-3">
          <Label htmlFor={`until-${id}`}>Suspended until</Label>
          <Input id={`until-${id}`} type="datetime-local" min={minLocal} value={until} onChange={(e) => setUntil(e.target.value)} />
          <p className="text-xs text-muted-foreground">They can log in but can’t {kind === "seller" ? "sell, withdraw or have listings shown" : "buy or withdraw"} until then. It lifts automatically.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setSuspending(false)} disabled={busy}>Cancel</Button>
            <Button onClick={() => (until ? set("Suspended", until) : toast.error("Pick when the suspension ends."))} disabled={busy}>
              Confirm suspension
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {status === "Suspended" ? (
          <Button onClick={() => set("Okay")} disabled={busy}>Lift suspension</Button>
        ) : status !== "Banned" && !suspending ? (
          <Button variant="outline" onClick={() => setSuspending(true)} disabled={busy}>Suspend {label}</Button>
        ) : null}
        {status === "Banned" ? (
          <Button onClick={() => set("Okay")} disabled={busy}>Unban {label}</Button>
        ) : (
          <Button variant="destructive" disabled={busy}
            onClick={() => (confirmBan ? set("Banned") : setConfirmBan(true))}
            onBlur={() => setConfirmBan(false)}>
            {confirmBan ? "Click again to confirm ban" : `Ban ${label}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountActions;
