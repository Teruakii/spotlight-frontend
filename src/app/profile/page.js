"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listPlaces } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass, secondaryButton } from "@/lib/styles";
import ProfileHeader from "@/components/profile/ProfileHeader";
import MyPlacesList from "@/components/profile/MyPlacesList";
import PageMessage from "@/components/ui/PageMessage";

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [myPlaces, setMyPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!token) return;
    listPlaces({ mine: "true" }, token)
      .then(setMyPlaces)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setPlacesLoading(false));
  }, [token]);

  if (loading || !user) return <PageMessage>Loading…</PageMessage>;

  const stats = [
    { label: "Places submitted", value: myPlaces.length },
    { label: "Approved", value: myPlaces.filter((p) => p.status === "approved").length },
    { label: "Pending", value: myPlaces.filter((p) => p.status === "pending").length },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-10">
      <ProfileHeader user={user} stats={stats} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">My places</h2>
          <Link href="/places/new" className={secondaryButton}>
            <Plus className="h-3.5 w-3.5" />
            Add place
          </Link>
        </div>
        {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}
        {placesLoading ? <PageMessage>Loading your places…</PageMessage> : <MyPlacesList places={myPlaces} />}
      </section>
    </main>
  );
}
