"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, listPendingPlaces } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { cardClass, errorBannerClass } from "@/lib/styles";
import StatCard from "@/components/admin/StatCard";
import ActivityChart from "@/components/admin/ActivityChart";
import CategoryMix from "@/components/admin/CategoryMix";

const PERIODS = [
  { key: "7D", context: "last 7 days" },
  { key: "30D", context: "last 30 days" },
  { key: "12M", context: "last 12 months" },
];

const ACTIVITY_TONE = {
  place_submitted: { tone: "bg-amber-100 text-amber-700", icon: "+" },
  review_posted: { tone: "bg-zinc-100 text-zinc-600", icon: "★" },
  review_reported: { tone: "bg-red-50 text-red-500", icon: "!" },
};

function timeAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [period, setPeriod] = useState("30D");
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listPendingPlaces(token)
      .then(setPending)
      .catch((err) => setError(errorMessage(err)));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getAdminStats(period, token)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [token, period]);

  const context = PERIODS.find((p) => p.key === period).context;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-medium text-zinc-400">{today}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Overview</h1>
        </div>
        <div className="flex items-center self-start rounded-lg border border-zinc-200 bg-white p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              aria-pressed={period === p.key}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p.key ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      {error && <div className={`${errorBannerClass} mb-6`} role="alert">{error}</div>}

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Published places" value={stats?.totals.places} delta={stats?.deltas.places} deltaContext={`submitted, ${context}`} />
        <StatCard label="Reviews" value={stats?.totals.reviews} delta={stats?.deltas.reviews} deltaContext={context} />
        <StatCard label="Users" value={stats?.totals.users} delta={stats?.deltas.users} deltaContext={context} />
        <StatCard
          label="Active users"
          value={stats?.deltas.activeUsers}
          note={`signed in, ${context}`}
        />
      </div>

      <div className="mb-8 grid gap-4 xl:grid-cols-3">
        <section className={`${cardClass} min-w-0 p-5 sm:p-6 xl:col-span-2`}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">Platform activity</h2>
            <p className="mt-1 text-xs text-zinc-400">Place page visits and new reviews</p>
          </div>
          {stats ? (
            <ActivityChart series={stats.series} />
          ) : (
            <div className="h-56 animate-pulse rounded-lg bg-zinc-50 motion-reduce:animate-none" />
          )}
        </section>

        <section className={`${cardClass} p-5 sm:p-6`}>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-zinc-900">Listing mix</h2>
            <p className="mt-1 text-xs text-zinc-400">Published places by category</p>
          </div>
          {stats && <CategoryMix mix={stats.categoryMix} />}
          <div className="mt-6 space-y-3 border-t border-zinc-100 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Recent activity</p>
            {stats?.recentActivity.length === 0 && <p className="text-xs text-zinc-400">Nothing yet.</p>}
            {stats?.recentActivity.slice(0, 4).map((activity) => {
              const { tone, icon } = ACTIVITY_TONE[activity.type] ?? ACTIVITY_TONE.review_posted;
              return (
                <Link
                  key={`${activity.type}-${activity.at}-${activity.placeId}`}
                  href={`/places/${activity.placeId}`}
                  className="flex items-center gap-3"
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${tone}`}>
                    {icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-800">{activity.title}</p>
                    <p className="truncate text-[10px] text-zinc-400">
                      {activity.detail} · {timeAgo(activity.at)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">
          Waiting for review
          {stats && stats.totals.pending > 0 && (
            <span className="ml-2 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">{stats.totals.pending}</span>
          )}
        </h2>
        {pending.length > 0 && (
          <Link href="/dashboard/pending" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
            Open queue
          </Link>
        )}
      </div>

      <div className={cardClass}>
        {pending.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-400">Nothing is waiting for review.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {pending.slice(0, 5).map((place) => (
              <li key={place.id} className="flex items-center justify-between px-5 py-3.5">
                <Link href={`/places/${place.id}`} className="text-sm font-medium text-zinc-900 hover:underline">
                  {place.name}
                </Link>
                <span className="text-xs text-zinc-400">{place.category?.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
