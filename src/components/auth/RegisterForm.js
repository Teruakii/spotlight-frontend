"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { checkEmailAvailability } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { inputClass, labelClass, primaryButton, errorBannerClass } from "@/lib/styles";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordInput from "@/components/auth/PasswordInput";
import Spinner from "@/components/ui/Spinner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailStatus({ status }) {
  if (status === "checking") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
        <Spinner className="h-3 w-3" /> Checking availability…
      </p>
    );
  }
  if (status === "available") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
        <Check className="h-3 w-3" /> This email is available.
      </p>
    );
  }
  if (status === "taken") {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500" role="alert">
        <X className="h-3 w-3" /> This email is already registered.{" "}
        <Link href="/login" className="font-medium underline">Sign in instead</Link>
      </p>
    );
  }
  return null;
}

export default function RegisterForm() {
  const { user, loading: authLoading, register, login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [emailStatus, setEmailStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [authLoading, user, router]);

  useEffect(() => {
    const email = form.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      setEmailStatus("idle");
      return;
    }
    setEmailStatus("checking");
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { available } = await checkEmailAvailability(email);
        if (!cancelled) setEmailStatus(available ? "available" : "taken");
      } catch {
        if (!cancelled) setEmailStatus("idle");
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.email]);

  function handleChange(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setFieldErrors((errs) => ({ ...errs, [field]: undefined }));
    };
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Enter your first name.";
    if (!form.lastName.trim()) errs.lastName = "Enter your last name.";
    if (!EMAIL_PATTERN.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0 || emailStatus === "taken") return;

    setSubmitting(true);
    const credentials = { email: form.email.trim(), password: form.password };
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        ...credentials,
      });
    } catch (err) {
      if (err.status === 409) setEmailStatus("taken");
      else setError(errorMessage(err));
      setSubmitting(false);
      return;
    }

    try {
      await login(credentials);
      router.push("/");
    } catch {
      router.push("/login");
    }
  }

  const emailInvalid = emailStatus === "taken" || Boolean(fieldErrors.email);

  return (
    <div>
      <AuthHeader title="Create your account" subtitle="Start exploring in under a minute." />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <input
              id="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange("firstName")}
              placeholder="Camille"
              className={`${inputClass} ${fieldErrors.firstName ? "border-red-300" : ""}`}
            />
            {fieldErrors.firstName && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <input
              id="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange("lastName")}
              placeholder="Fontaine"
              className={`${inputClass} ${fieldErrors.lastName ? "border-red-300" : ""}`}
            />
            {fieldErrors.lastName && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@email.com"
            className={`${inputClass} ${emailInvalid ? "border-red-300" : ""}`}
          />
          {fieldErrors.email ? (
            <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
          ) : (
            <EmailStatus status={emailStatus} />
          )}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <PasswordInput
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
            invalid={Boolean(fieldErrors.password)}
          />
          <p className={`mt-1.5 text-xs ${fieldErrors.password ? "text-red-500" : "text-zinc-400"}`}>
            {fieldErrors.password || "At least 8 characters."}
          </p>
        </div>

        {error && <div className={errorBannerClass} role="alert">{error}</div>}

        <button
          type="submit"
          disabled={submitting || emailStatus === "taken"}
          className={`${primaryButton} mt-2 w-full`}
        >
          {submitting && <Spinner />}
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
