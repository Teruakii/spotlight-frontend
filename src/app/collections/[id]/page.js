"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ImageOff, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCollection } from "@/lib/api";
import { groupByDay } from "@/lib/itinerary";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass, secondaryButton } from "@/lib/styles";
import PageMessage from "@/components/ui/PageMessage";

export default function CollectionPage() {
  const { id } = useParams();
  const { token, loading } = useAuth();
  const [collection, setCollection] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    getCollection(id, token)
      .then((data) => {
        setCollection(data);
        setState("ready");
      })
      .catch((err) => {
        setError(errorMessage(err));
        setState(err.status === 404 ? "notfound" : "error");
      });
  }, [id, token, loading]);

  if (state === "loading") return <PageMessage>Loading collection…</PageMessage>;
  if (state === "notfound") {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-sm text-zinc-400">This collection doesn&apos;t exist or is private.</p>
        <Link href="/" className={secondaryButton}>Discover places</Link>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="mx-auto max-w-md py-20">
        <div className={errorBannerClass} role="alert">{error}</div>
      </div>
    );
  }

  let index = 0;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-amber-700">
        {groupByDay(collection.items).length || 1}-day itinerary
      </p>
      <h1 className="mb-1 text-2xl font-semibold text-zinc-900">{collection.name}</h1>
      {collection.description && <p className="mb-2 text-sm text-zinc-500">{collection.description}</p>}
      <p className="mb-8 text-xs text-zinc-400">{collection.items.length} places</p>

      <div className="space-y-8">
        {groupByDay(collection.items).map(({ day, items }) => (
          <section key={day}>
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Day {day}</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/places/${item.place.id}`}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
                    {++index}
                  </span>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 text-zinc-300">
                    {item.place.imageUrl ? (
                      <img src={item.place.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.place.name}</p>
                    <p className="flex items-center gap-1 text-xs text-zinc-400">
                      {item.startTime && <span>{item.startTime} ·</span>}
                      {item.place.category?.name}
                      {item.place.rating !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <Star className="h-3 w-3 fill-amber-600 text-amber-600" /> {item.place.rating}
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
