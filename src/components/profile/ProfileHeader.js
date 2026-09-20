import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { cardClass, secondaryButton } from "@/lib/styles";
import { fullName } from "@/lib/utils";

export default function ProfileHeader({ user, stats }) {
  const isAdmin = user.role === "admin";

  return (
    <div className={`${cardClass} mb-8 p-6`}>
      <div className="flex flex-wrap items-center gap-5">
        <Avatar person={user} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-zinc-900">{fullName(user)}</h1>
            {isAdmin && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Admin
              </span>
            )}
          </div>
          <p className="truncate text-sm text-zinc-400">{user.email}</p>
        </div>
        {isAdmin && (
          <Link href="/dashboard" className={secondaryButton}>
            Open dashboard
          </Link>
        )}
      </div>

      <div className="mt-6 flex gap-8 border-t border-zinc-100 pt-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="mb-0.5 text-lg font-semibold leading-none text-zinc-900">{stat.value}</p>
            <p className="text-xs text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
