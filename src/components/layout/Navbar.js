"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fullName } from "@/lib/utils";
import UserMenu from "@/components/layout/UserMenu";

export default function Navbar() {
  const { user, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { label: "Discover", href: "/" },
    { label: "Places", href: "/places" },
    ...(isAdmin ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  function isActive(href) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          Spotlight<span className="text-amber-600">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isActive(link.href) ? "font-medium text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {loading ? (
          <div className="h-7 w-20" />
       ) : user ? (
  <UserMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} />
) : (
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
          >
            Sign In
          </Link>
        )}
      </div>

      <nav className="flex gap-6 overflow-x-auto border-t border-zinc-100 px-6 py-2 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap text-sm ${
              isActive(link.href) ? "font-medium text-zinc-900" : "text-zinc-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
