"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listAdminUsers, setUserSuspension } from "@/lib/api";
import { errorMessage, formatMonthYear, fullName } from "@/lib/utils";
import { cardClass, errorBannerClass } from "@/lib/styles";
import Avatar from "@/components/ui/Avatar";
import Tabs from "@/components/ui/Tabs";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

export default function UsersPage() {
  const { token, user: me } = useAuth();
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      listAdminUsers({ search: search.trim(), status }, token)
        .then((data) => {
          if (!cancelled) setUsers(data);
        })
        .catch((err) => {
          if (!cancelled) setError(errorMessage(err));
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, search, status]);

  async function toggle(user) {
    const suspend = !user.isSuspended;
    if (suspend && !window.confirm(`Suspend ${fullName(user)}? They will be signed out and unable to log in.`)) return;
    setBusyId(user.id);
    setError("");
    try {
      const updated = await setUserSuspension(user.id, suspend, token);
      setUsers((list) =>
        list
          .map((u) => (u.id === updated.id ? updated : u))
          .filter((u) => status === "all" || (status === "suspended") === u.isSuspended)
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Users</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            aria-label="Search users"
            className="w-60 rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <Tabs tabs={STATUS_TABS} active={status} onChange={setStatus} />
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">User</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Role</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Activity</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Joined</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              const locked = user.role === "admin" || user.id === me?.id;
              return (
                <tr key={user.id} className="border-b border-zinc-50 last:border-none hover:bg-zinc-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar person={user} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900">{fullName(user)}</p>
                        <p className="truncate text-xs text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 capitalize text-zinc-500">{user.role}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">
                    {user.counts.places} places · {user.counts.reviews} reviews
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">{formatMonthYear(user.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        user.isSuspended
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {locked ? (
                      <span className="text-xs text-zinc-300">—</span>
                    ) : (
                      <button
                        onClick={() => toggle(user)}
                        disabled={busyId === user.id}
                        className={`text-xs font-medium transition-colors disabled:opacity-60 ${
                          user.isSuspended ? "text-zinc-500 hover:text-zinc-900" : "text-red-400 hover:text-red-600"
                        }`}
                      >
                        {user.isSuspended ? "Reinstate" : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users === null && <p className="px-5 py-12 text-center text-sm text-zinc-400">Loading users…</p>}
        {users?.length === 0 && <p className="px-5 py-12 text-center text-sm text-zinc-400">No users match.</p>}
      </div>
    </div>
  );
}
