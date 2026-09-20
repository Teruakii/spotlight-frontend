"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { errorBannerClass } from "@/lib/styles";
import CategoryManager from "@/components/admin/CategoryManager";
import PageMessage from "@/components/ui/PageMessage";

const byName = (a, b) => a.name.localeCompare(b.name);

export default function DashboardCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  async function handleCreate(name) {
    const created = await createCategory(name, token);
    setCategories((prev) => [...prev, created].sort(byName));
  }

  async function handleRename(id, name) {
    const updated = await updateCategory(id, name, token);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)).sort(byName));
  }

  async function handleDelete(id) {
    await deleteCategory(id, token);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Categories</h1>
      {error && <div className={errorBannerClass} role="alert">{error}</div>}
      {!categories && !error && <PageMessage>Loading…</PageMessage>}
      {categories && (
        <CategoryManager
          categories={categories}
          onCreate={handleCreate}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
