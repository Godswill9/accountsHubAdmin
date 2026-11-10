// Shows who an id belongs to: name, then email (or the raw id if unknown) and buyer/seller/admin.
const Person = ({ name, email, type, id }: { name?: string | null; email?: string | null; type?: string | null; id?: string | null }) => (
  <div className="min-w-0">
    <div className="font-medium">
      {name || (id ? "Unknown account" : "—")}
      {type && <span className="ml-1 text-xs font-normal text-muted-foreground capitalize">({type})</span>}
    </div>
    {(email || id) && <div className="text-xs text-muted-foreground break-all">{email || id}</div>}
  </div>
);

export default Person;
