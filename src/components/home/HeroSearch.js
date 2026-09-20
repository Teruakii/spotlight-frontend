"use client";
import SearchInput from "@/components/home/SearchInput";

export default function HeroSearch({ value, onChange, children }) {
  return (
    <section className="border-b border-zinc-200 bg-white px-6 pb-12 pt-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400">
          Your travel &amp; dining guide
        </p>
        <h1 className="mb-3 text-4xl font-light leading-tight text-zinc-900 md:text-5xl">
          Find places worth
          <br />
          <span className="font-semibold">your time.</span>
        </h1>
        <p className="mb-8 text-base font-light text-zinc-500">
          Curated attractions and dining, handpicked by travelers who care about quality.
        </p>
        <div className="mb-4">
          <SearchInput value={value} onChange={onChange} />
        </div>
        {children}
      </div>
    </section>
  );
}
