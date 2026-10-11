"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { changePassword, deleteAccount } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass, labelClass } from "@/lib/styles";
import PasswordInput from "@/components/auth/PasswordInput";
import Spinner from "@/components/ui/Spinner";

function Section({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-5 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ChangePasswordForm({ token }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setStatus("saving");
    try {
      await changePassword(form, token);
      setForm({ currentPassword: "", newPassword: "" });
      setStatus("saved");
    } catch (err) {
      setError(errorMessage(err));
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4" noValidate>
      <div>
        <label htmlFor="currentPassword" className={labelClass}>Current password</label>
        <PasswordInput
          id="currentPassword"
          value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
          autoComplete="current-password"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className={labelClass}>New password</label>
        <PasswordInput
          id="newPassword"
          value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          autoComplete="new-password"
        />
      </div>
      {error && <div className={errorBannerClass} role="alert">{error}</div>}
      {status === "saved" && (
        <p className="text-xs text-emerald-600" role="status">Password updated.</p>
      )}
      <button
        type="submit"
        disabled={status === "saving" || !form.currentPassword || !form.newPassword}
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
      >
        {status === "saving" && <Spinner />}
        Update password
      </button>
    </form>
  );
}

function DeleteAccountForm({ token, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await deleteAccount(password, token);
      onDeleted();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
      >
        Delete Account
      </button>
    );
  }

  return (
    <form onSubmit={handleDelete} className="w-full space-y-3">
      <p className="text-sm text-zinc-600">
        This permanently deletes your account, reviews and saved places. Enter your password to confirm.
      </p>
      <PasswordInput
        id="deletePassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <div className={errorBannerClass} role="alert">{error}</div>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy || !password}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          {busy && <Spinner />}
          Delete my account
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-zinc-600">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SettingsPanel() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  function signOut() {
    logout();
    router.push("/");
  }

  return (
    <div className="max-w-lg space-y-5">
      <Section title="Account">
        <div className="border-b border-zinc-50 px-5 py-3.5">
          <p className="text-sm font-medium text-zinc-900">Email</p>
          <p className="text-xs text-zinc-400">{user.email}</p>
        </div>
        <div className="px-5 pt-3.5">
          <p className="text-sm font-medium text-zinc-900">Password</p>
        </div>
        <ChangePasswordForm token={token} />
      </Section>

      <Section title="Account Actions">
        <div className="flex flex-wrap gap-3 px-5 py-4">
          <button
            onClick={signOut}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300"
          >
            Sign Out
          </button>
          <DeleteAccountForm token={token} onDeleted={signOut} />
        </div>
      </Section>
    </div>
  );
}
