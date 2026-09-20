import { cardClass } from "@/lib/styles";

export default function StatCard({ label, value, note }) {
  return (
    <div className={`${cardClass} p-5`}>
      <p className="mb-2 text-xs font-medium text-zinc-400">{label}</p>
      <p className="mb-2 text-3xl font-semibold leading-none text-zinc-900">{value ?? "—"}</p>
      {note && <p className="text-xs text-zinc-400">{note}</p>}
    </div>
  );
}
