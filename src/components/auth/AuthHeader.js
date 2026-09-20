export default function AuthHeader({ title, subtitle }) {
  return (
    <>
      <p className="mb-1 text-xl font-semibold text-zinc-900">
        Spotlight<span className="text-amber-600">.</span>
      </p>
      <h1 className="mb-1 mt-6 text-2xl font-semibold text-zinc-900">{title}</h1>
      <p className="mb-8 text-sm text-zinc-400">{subtitle}</p>
    </>
  );
}
