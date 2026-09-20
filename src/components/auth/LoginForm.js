"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/utils";
import { inputClass, labelClass, primaryButton, errorBannerClass } from "@/lib/styles";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordInput from "@/components/auth/PasswordInput";
import Spinner from "@/components/ui/Spinner";

export default function LoginForm() {
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      router.push("/");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AuthHeader title="Welcome back" subtitle="Sign in to continue your journey." />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <PasswordInput
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="current-password"
          />
        </div>

        {error && <div className={errorBannerClass} role="alert">{error}</div>}

        <button type="submit" disabled={submitting} className={`${primaryButton} mt-2 w-full`}>
          {submitting && <Spinner />}
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-zinc-900 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
