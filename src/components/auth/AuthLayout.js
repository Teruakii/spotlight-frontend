export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <div className="relative hidden overflow-hidden bg-zinc-900 lg:flex lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1762719299821-57211ae3d4b1?w=900&h=1200&fit=crop&auto=format"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-white/60">Spotlight</p>
          <h2 className="mb-3 text-3xl font-light leading-snug text-white">
            Discover places
            <br />
            <span className="font-semibold">worth remembering.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Join travelers and food lovers curating the best spots.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
