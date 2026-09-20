"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { fullName } from "@/lib/utils";


const itemClass =
  "flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900";

export default function UserMenu({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <Avatar person={user} size="sm" />
        <span className="hidden font-medium md:inline">{fullName(user)}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-zinc-100 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-zinc-900">{fullName(user)}</p>
            <p className="truncate text-xs text-zinc-400">{user.email}</p>
          </div>

          <Link href="/profile" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <User className="h-4 w-4" strokeWidth={1.75} />
            Profile
          </Link>

          {isAdmin && (
            <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              Dashboard
            </Link>
          )}

          <Link href="/settings" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Settings className="h-4 w-4" strokeWidth={1.75} />
            Settings
          </Link>

          <div className="mt-1 border-t border-zinc-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className={`${itemClass} text-red-500 hover:text-red-600`}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}