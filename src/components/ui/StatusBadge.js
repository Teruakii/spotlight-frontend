const STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
        STYLES[status] || "border-zinc-200 bg-zinc-50 text-zinc-500"
      }`}
    >
      {status}
    </span>
  );
}
