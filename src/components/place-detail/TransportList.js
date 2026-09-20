export default function TransportList({ transports = [] }) {
  if (!transports.length) {
    return <p className="text-xs text-zinc-400">No transport details yet.</p>;
  }

  return (
    <div className="space-y-3">
      {transports.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <span className="mt-0.5 rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
            {item.method}
          </span>
          <p className="text-xs leading-relaxed text-zinc-500">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
