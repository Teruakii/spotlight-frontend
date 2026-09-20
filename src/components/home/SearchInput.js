"use client";
import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search destinations, restaurants…" }) {
  return (
    <div className="relative flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 transition-colors focus-within:border-zinc-400">
      <Search className="pointer-events-none absolute left-4 h-4 w-4 shrink-0 text-zinc-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search places"
        className="flex-1 bg-transparent py-3.5 pl-11 pr-4 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
      />
    </div>
  );
}
