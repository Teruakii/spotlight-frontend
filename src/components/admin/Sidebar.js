"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, MapPin, Tags, Flag } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pending review", href: "/dashboard/pending", icon: Clock },
  { label: "Reported reviews", href: "/dashboard/reviews", icon: Flag },
  { label: "All places", href: "/dashboard/places", icon: MapPin },
  { label: "Categories", href: "/dashboard/categories", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white py-6 md:block">
        <p className="mb-3 px-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Management</p>
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
              pathname === href ? "bg-zinc-900 text-white" : "text-zinc-500"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
