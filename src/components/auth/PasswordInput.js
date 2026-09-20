"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "@/lib/styles";

export default function PasswordInput({ value, onChange, autoComplete, id = "password", invalid = false }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder="••••••••"
        className={`${inputClass} pr-10 ${invalid ? "border-red-300" : ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
