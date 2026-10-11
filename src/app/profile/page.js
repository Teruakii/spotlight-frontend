"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile, listMyReviews, listPlaces, listSavedPlaces, updateMyProfile } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass, secondaryButton } from "@/lib/styles";
import ProfileHeader from "@/components/profile/ProfileHeader";
import MyPlacesList from "@/components/profile/MyPlacesList";
import MyReviewsList from "@/components/profile/MyReviewsList";
import SettingsPanel from "@/components/profile/SettingsPanel";
import PageMessage from "@/components/ui/PageMessage";
import Tabs from "@/components/ui/Tabs";
import PlaceGrid, { PlaceGridSkeleton } from "@/components/home/PlaceGrid";

export default function ProfilePage() {
  const { user, token, loading, applyProfile } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [myPlaces, setMyPlaces] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState(null);
  const [myReviews, setMyReviews] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("saved");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!token) return;
    const fail = (fallback) => (err) => {
      fallback();
      setError(errorMessage(err));
    };
    getMyProfile(token).then(setProfile).catch(fail(() => {}));
    listPlaces({ mine: "true" }, token).then(setMyPlaces).catch(fail(() => setMyPlaces([])));
    listSavedPlaces(token).then(setSavedPlaces).catch(fail(() => setSavedPlaces([])));
    listMyReviews(token).then(setMyReviews).catch(fail(() => setMyReviews([])));
  }, [token]);

  if (loading || !user) return <PageMessage>Loading…</PageMessage>;

  async function handleSave(changes) {
    const updated = await updateMyProfile(changes, token);
    setProfile(updated);
    applyProfile(updated);
  }

  const stats = [
    { label: "Places submitted", value: profile?.stats.places ?? "–" },
    { label: "Reviews", value: profile?.stats.reviews ?? "–" },
    { label: "Saved", value: profile?.stats.savedPlaces ?? "–" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-10">
      {profile ? (
        <ProfileHeader profile={profile} stats={stats} onSave={handleSave} />
      ) : (
        <div className="mb-8 h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white motion-reduce:animate-none" />
      )}

      <div className="mb-7">
        <Tabs
          tabs={[
            { key: "saved", label: "Saved Places" },
            { key: "reviews", label: "My Reviews", count: myReviews?.length },
            { key: "places", label: "My Places" },
            { key: "settings", label: "Settings" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      {tab === "saved" &&
        (savedPlaces === null ? (
          <PlaceGridSkeleton />
        ) : (
          <PlaceGrid places={savedPlaces} emptyMessage="Tap the bookmark on any place to save it here." />
        ))}

      {tab === "reviews" &&
        (myReviews === null ? <PageMessage>Loading your reviews…</PageMessage> : <MyReviewsList reviews={myReviews} />)}

      {tab === "places" && (
        <section>
          <div className="mb-4 flex justify-end">
            <Link href="/places/new" className={secondaryButton}>
              <Plus className="h-3.5 w-3.5" />
              Add place
            </Link>
          </div>
          {myPlaces === null ? <PageMessage>Loading your places…</PageMessage> : <MyPlacesList places={myPlaces} />}
        </section>
      )}

      {tab === "settings" && <SettingsPanel />}
    </main>
  );
}
