"use client";
import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import { cardClass, errorBannerClass, inputClass, primaryButton } from "@/lib/styles";
import { errorMessage } from "@/lib/utils";

export default function CategoryManager({ categories, onCreate, onRename, onDelete }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (await run(() => onCreate(name))) setNewName("");
  }

  async function handleRename(id) {
    const name = draft.trim();
    if (!name) return;
    if (await run(() => onRename(id, name))) setEditingId(null);
  }

  async function handleDelete(id) {
    await run(() => onDelete(id));
    setConfirmingId(null);
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={100}
          placeholder="New category name"
          aria-label="New category name"
          className={inputClass}
        />
        <button type="submit" disabled={busy || !newName.trim()} className={`${primaryButton} shrink-0`}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </form>

      {error && <div className={`${errorBannerClass} mb-4`} role="alert">{error}</div>}

      {categories.length === 0 ? (
        <div className={`${cardClass} px-6 py-12 text-center text-sm text-zinc-400`}>
          No categories yet. Add one so people can submit places.
        </div>
      ) : (
        <ul className={`${cardClass} divide-y divide-zinc-100`}>
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-3 px-5 py-3.5">
              {editingId === category.id ? (
                <>
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(category.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    maxLength={100}
                    aria-label="Category name"
                    className={`${inputClass} py-1.5`}
                  />
                  <button
                    onClick={() => handleRename(category.id)}
                    disabled={busy}
                    aria-label="Save name"
                    className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel rename"
                    className="p-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-zinc-900">{category.name}</span>
                  {confirmingId === category.id ? (
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={busy}
                        className="text-red-500 hover:text-red-600 disabled:opacity-60"
                      >
                        Confirm delete
                      </button>
                      <button onClick={() => setConfirmingId(null)} className="text-zinc-400 hover:text-zinc-600">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <button
                        onClick={() => {
                          setEditingId(category.id);
                          setDraft(category.name);
                          setError("");
                        }}
                        aria-label={`Rename ${category.name}`}
                        className="text-zinc-500 transition-colors hover:text-zinc-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmingId(category.id);
                          setError("");
                        }}
                        className="text-red-400 transition-colors hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
