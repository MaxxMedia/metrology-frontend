"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Filter, FolderOpen, Plus, Trash2, X } from "lucide-react";
import AdminPagination, { ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  children?: Category[];
  _count?: {
    posts: number;
    subPosts: number;
  };
};

function getPostCount(cat: Category) {
  // Parent categories: posts via categoryId
  // Subcategories: posts via subCategoryId
  if (cat.parentId != null) {
    return cat._count?.subPosts ?? 0;
  }
  return cat._count?.posts ?? 0;
}

type FlatRow = Category & { depth: number; parentName?: string };

function slugify(name: string, parentSlug?: string | null) {
  const base =
    name
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "category";
  return parentSlug ? `${parentSlug}-${base}` : base;
}

function buildNestedRows(categories: Category[]): FlatRow[] {
  const parents = categories
    .filter((c) => c.parentId == null)
    .sort((a, b) => a.name.localeCompare(b.name));

  const byParent = new Map<number, Category[]>();
  for (const c of categories) {
    if (c.parentId != null) {
      const list = byParent.get(c.parentId) || [];
      list.push(c);
      byParent.set(c.parentId, list);
    }
  }

  const rows: FlatRow[] = [];
  for (const parent of parents) {
    rows.push({ ...parent, depth: 0 });
    const children = (byParent.get(parent.id) || parent.children || []).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    for (const child of children) {
      rows.push({ ...child, depth: 1, parentName: parent.name });
    }
  }
  return rows;
}

export default function CategoryManagement() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParentFilter, setSelectedParentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: "", parentId: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [selectedParentFilter]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const parentOptions = useMemo(
    () =>
      categories
        .filter((c) => c.parentId == null)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const nestedRows = useMemo(() => buildNestedRows(categories), [categories]);

  const filteredRows = useMemo(() => {
    if (!selectedParentFilter) return nestedRows;
    const parentId = Number(selectedParentFilter);
    return nestedRows.filter(
      (row) => row.id === parentId || row.parentId === parentId
    );
  }, [nestedRows, selectedParentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ADMIN_PAGE_SIZE));
  const paginatedRows = filteredRows.slice(
    (page - 1) * ADMIN_PAGE_SIZE,
    page * ADMIN_PAGE_SIZE
  );

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      parentId: cat.parentId != null ? String(cat.parentId) : "",
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setForm({ name: "", parentId: "" });
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(editingCategory);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingCategory?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
      const method = isEditing ? "PUT" : "POST";

      const parentId = form.parentId ? Number(form.parentId) : null;
      const parent = parentId
        ? categories.find((c) => c.id === parentId)
        : null;

      const slug = isEditing
        ? editingCategory!.slug
        : slugify(form.name, parent?.slug);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug,
          parentId,
        }),
      });

      if (res.ok) {
        setMessage(
          `✅ ${parentId ? "Subcategory" : "Category"} ${
            isEditing ? "updated" : "created"
          } successfully!`
        );
        await fetchCategories();
        setEditingCategory(null);
        setForm({ name: "", parentId: "" });
      } else {
        const error = await res.json();
        setMessage(`❌ Failed: ${error.error || error.message || "Unknown error"}`);
      }
    } catch {
      setMessage("❌ Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCategories();
        if (editingCategory?.id === id) cancelEdit();
      } else {
        const error = await res.json();
        alert(`Failed to delete: ${error.error || error.message || "Error occurred"}`);
      }
    } catch {
      alert("Network error. Failed to delete category.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/posts")}
              className="p-2 bg-white rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              title="Back to Posts"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FolderOpen className="text-[#0073ff]" /> Category Management
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategory
                  ? editingCategory.parentId
                    ? "Edit Subcategory"
                    : "Edit Category"
                  : "Add Category / Subcategory"}
              </h2>
              {editingCategory && (
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Dimensional Metrology"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#0073ff] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Parent category
                </label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                  className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0073ff] focus:outline-none"
                  disabled={
                    Boolean(
                      editingCategory &&
                        !editingCategory.parentId &&
                        (editingCategory.children?.length || 0) > 0
                    )
                  }
                >
                  <option value="">None (top-level category)</option>
                  {parentOptions
                    .filter((p) => p.id !== editingCategory?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for a top-level category. Pick a parent to create a subcategory.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0073ff] hover:bg-[#0060d6] text-white font-medium py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {editingCategory ? (
                    <>
                      <Edit size={16} /> Update
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Create
                    </>
                  )}
                </button>
              </div>
            </form>

            {message && (
              <p
                className={`mt-4 p-3 rounded-lg text-sm ${
                  message.startsWith("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl shadow border overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
                <h2 className="font-bold text-gray-800">
                  All Categories ({nestedRows.length})
                </h2>
                <div className="relative w-full sm:w-64">
                  <Filter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <select
                    value={selectedParentFilter}
                    onChange={(e) => setSelectedParentFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border rounded-lg text-sm w-full bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0073ff]"
                  >
                    <option value="">All Categories</option>
                    {parentOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-[#0073ff] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No categories found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                          Posts
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedRows.map((cat) => {
                        const postCount = getPostCount(cat);
                        return (
                        <tr
                          key={cat.id}
                          className={`hover:bg-gray-50 transition ${
                            editingCategory?.id === cat.id ? "bg-[#0073ff]/10" : ""
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            <span
                              className={cat.depth > 0 ? "pl-6 text-gray-700 font-medium" : ""}
                            >
                              {cat.depth > 0 ? `↳ ${cat.name}` : cat.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {cat.depth > 0 ? (
                              <span>
                                Subcategory
                                {cat.parentName ? (
                                  <span className="text-gray-400"> · {cat.parentName}</span>
                                ) : null}
                              </span>
                            ) : (
                              "Category"
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                postCount > 0
                                  ? "bg-[#0073ff]/10 text-[#0073ff]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                              title={
                                cat.depth > 0
                                  ? "Posts using this subcategory"
                                  : "Posts in this category"
                              }
                            >
                              {postCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(cat)}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id, cat.name)}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredRows.length}
              pageSize={ADMIN_PAGE_SIZE}
              itemLabel="categories"
              onPageChange={setPage}
              className="border-0 border-t rounded-none shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
