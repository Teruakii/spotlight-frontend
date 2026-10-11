"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SettingsPanel from "@/components/profile/SettingsPanel";
import PageMessage from "@/components/ui/PageMessage";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <PageMessage>Loading…</PageMessage>;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-10">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Settings</h1>
      <SettingsPanel />
    </main>
  );
}
