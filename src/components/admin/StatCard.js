import { cardClass } from "@/lib/styles";

export default function StatCard({ label, value, delta, deltaContext, note }) {
  return (
    <div className={`${cardClass} p-5`}>
      <p className="mb-2 text-xs font-medium text-zinc-400">{label}</p>
      <p className="mb-2 text-3xl font-semibold leading-none text-zinc-900">{value?.toLocaleString() ?? "—"}</p>
      {delta !== undefined && delta !== null ? (
        <p className="text-xs text-zinc-400">
          <span className="font-medium text-zinc-700">+{delta.toLocaleString()}</span> {deltaContext}
        </p>
      ) : (
        note && <p className="text-xs text-zinc-400">{note}</p>
      )}
    </div>
  );
}
