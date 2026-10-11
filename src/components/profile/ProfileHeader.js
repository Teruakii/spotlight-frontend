"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import { errorMessage, fullName } from "@/lib/utils";
import { errorBannerClass, inputClass, labelClass, secondaryButton } from "@/lib/styles";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1762719299821-57211ae3d4b1?w=1200&h=300&fit=crop&auto=format";

const EDITABLE_FIELDS = ["firstName", "lastName", "location", "bio", "avatarUrl", "coverUrl"];

function toForm(profile) {
  return Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, profile[field] ?? ""]));
}

export default function ProfileHeader({ profile, stats, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(profile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = profile.role === "admin";

  function field(name) {
    return {
      id: name,
      value: form[name],
      onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    };
  }

  function startEditing() {
    setForm(toForm(profile));
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    const changes = Object.fromEntries(
      EDITABLE_FIELDS.filter((name) => form[name].trim() !== (profile[name] ?? "")).map((name) => [
        name,
        form[name].trim(),
      ])
    );
    if (Object.keys(changes).length === 0) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(changes);
      setEditing(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative h-36 overflow-hidden bg-zinc-100">
        <img src={profile.coverUrl || DEFAULT_COVER} alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30" />
      </div>

      <div className="px-6 pb-6">
        <div className="relative -mt-10 mb-4 flex items-end justify-between">
          <div className="rounded-2xl border-4 border-white bg-white shadow-sm">
            <Avatar person={profile} size="xl" />
          </div>
          <div className="mb-1 flex items-center gap-2">
            {isAdmin && !editing && (
              <Link href="/dashboard" className={secondaryButton}>
                Dashboard
              </Link>
            )}
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} disabled={saving} className={secondaryButton}>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving && <Spinner />}
                  Save
                </button>
              </>
            ) : (
              <button onClick={startEditing} className={secondaryButton}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className={labelClass}>First name</label>
                <input {...field("firstName")} className={inputClass} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last name</label>
                <input {...field("lastName")} className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>Location</label>
              <input {...field("location")} maxLength={100} placeholder="Paris, France" className={inputClass} />
            </div>
            <div>
              <label htmlFor="bio" className={labelClass}>Bio</label>
              <textarea
                {...field("bio")}
                rows={2}
                maxLength={500}
                placeholder="Solo traveler & amateur food critic."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="avatarUrl" className={labelClass}>Avatar image URL</label>
                <input {...field("avatarUrl")} type="url" placeholder="https://…" className={inputClass} />
              </div>
              <div>
                <label htmlFor="coverUrl" className={labelClass}>Cover image URL</label>
                <input {...field("coverUrl")} type="url" placeholder="https://…" className={inputClass} />
              </div>
            </div>
            {error && <div className={errorBannerClass} role="alert">{error}</div>}
          </div>
        ) : (
          <>
            <div className="mb-0.5 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-zinc-900">{fullName(profile)}</h1>
              {isAdmin && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Admin
                </span>
              )}
            </div>
            {profile.location && (
              <p className="mb-2 flex items-center gap-1 text-xs text-zinc-400">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </p>
            )}
            {profile.bio ? (
              <p className="text-sm leading-relaxed text-zinc-500">{profile.bio}</p>
            ) : (
              <p className="text-sm text-zinc-400">{profile.email}</p>
            )}
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-6 border-t border-zinc-100 pt-5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="mb-0.5 text-lg font-semibold leading-none text-zinc-900">{stat.value}</p>
              <p className="text-xs text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
