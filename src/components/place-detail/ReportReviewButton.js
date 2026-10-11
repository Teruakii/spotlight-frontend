"use client";
import { useState } from "react";
import { reportReview } from "@/lib/api";
import { errorMessage } from "@/lib/utils";

const REASONS = [
  { key: "spam", label: "Spam or advertising" },
  { key: "offensive", label: "Offensive or abusive" },
  { key: "misleading", label: "Misleading or fake" },
  { key: "other", label: "Something else" },
];

export default function ReportReviewButton({ reviewId, token }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  async function submit(reason) {
    setState("sending");
    setError("");
    try {
      await reportReview(reviewId, { reason }, token);
      setState("reported");
      setOpen(false);
    } catch (err) {
      if (err.status === 409) {
        setState("reported");
        setOpen(false);
      } else {
        setError(errorMessage(err));
        setState("idle");
      }
    }
  }

  if (state === "reported") {
    return <span className="text-xs text-zinc-400">Reported · thanks</span>;
  }

  return (
    <span className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-xs text-zinc-400 transition-colors hover:text-zinc-700"
      >
        Report
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Why report this?</p>
          {REASONS.map((reason) => (
            <button
              key={reason.key}
              onClick={() => submit(reason.key)}
              disabled={state === "sending"}
              className="block w-full px-3 py-2 text-left text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-60"
            >
              {reason.label}
            </button>
          ))}
          {error && <p className="px-3 py-1.5 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </span>
  );
}
