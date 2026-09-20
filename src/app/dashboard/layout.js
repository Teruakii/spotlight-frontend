"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.replace(user ? "/" : "/login");
  }, [loading, isAdmin, user, router]);

  if (loading || !isAdmin) return null;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
