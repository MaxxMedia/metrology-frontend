"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Filter,
  FolderOpen,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminPagination, { ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  children?: Category[];
};

type FlatRow = Category & {
  depth: number;
  parentName?: string;
  childrenCount: number;
};

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
  const parentMap = new Map<number, Category>();
  for (const c of categories) {
    if (c.parentId == null) {
      parentMap.set(c.id, c);
    }
  }

  const parents = Array.from(parentMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const byParent = new Map<number, Category[]>();
  const orphaned: Category[] = [];

  for (const c of categories) {
    if (c.parentId != null) {
      if (parentMap.has(c.parentId)) {
        const list = byParent.get(c.parentId) || [];
        list.push(c);
        byParent.set(c.parentId, list);
      } else {
        orphaned.push(c);
      }
    }
  }

  const rows: FlatRow[] = [];
  for (const parent of parents) {
    const children = (byParent.get(parent.id) || parent.children || []).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    rows.push({
      ...parent,
      depth: 0,
      childrenCount: children.length,
    });
    for (const child of children) {
      rows.push({
        ...child,
        depth: 1,
        parentName: parent.name,
        childrenCount: 0,
      });
    }
  }

  for (const orphan of orphaned) {
    rows.push({
      ...orphan,
      depth: 1,
      parentName: "Unknown",
      childrenCount: 0,
    });
  }

  return rows;
}

export default function CategoryManagement() {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedParentFilter, setSelectedParentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "main" | "sub">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: "", parentId: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [selectedParentFilter, typeFilter, searchQuery]);

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
    let rows = nestedRows;

    // Filter by Parent Category
    if (selectedParentFilter) {
      const pid = Number(selectedParentFilter);
      rows = rows.filter((r) => r.id === pid || r.parentId === pid);
    }

    // Filter by Category Type
    if (typeFilter === "main") {
      rows = rows.filter((r) => r.parentId == null);
    } else if (typeFilter === "sub") {
      rows = rows.filter((r) => r.parentId != null);
    }

    // Live Search Filter (name, slug, parent name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          (r.parentName && r.parentName.toLowerCase().includes(q))
      );
    }

    return rows;
  }, [nestedRows, selectedParentFilter, typeFilter, searchQuery]);

  const hasActiveFilters = Boolean(
    selectedParentFilter || typeFilter !== "all" || searchQuery.trim()
  );

  const clearFilters = () => {
    setSelectedParentFilter("");
    setTypeFilter("all");
    setSearchQuery("");
  };

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
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const handleAddSubcategory = (parentCat: Category) => {
    setEditingCategory(null);
    setForm({
      name: "",
      parentId: String(parentCat.id),
    });
    setMessage("");
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
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

        <div className="grid text-black md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div ref={formContainerRef} className="bg-white p-6 rounded-2xl shadow border h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategory
                  ? editingCategory.parentId
                    ? "Edit Subcategory"
                    : "Edit Category"
                  : form.parentId
                  ? "Add Subcategory"
                  : "Add Category / Subcategory"}
              </h2>
              {(editingCategory || form.parentId) && (
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={16} /> Clear / Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Name
                </label>
                <input
                  ref={nameInputRef}
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

          {/* Categories Table Section */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow border overflow-hidden flex flex-col justify-between">
            <div>
              {/* Filter Controls Header */}
              <div className="p-5 border-b space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">
                      Categories & Subcategories
                    </h2>
                    <p className="text-xs text-gray-500">
                      Showing {filteredRows.length} of {nestedRows.length} total entries
                    </p>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition border border-red-200"
                    >
                      <RotateCcw size={14} /> Clear Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Live Search */}
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search category name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-8 py-2 text-sm border rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#0073ff]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Parent Dropdown Filter */}
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      value={selectedParentFilter}
                      onChange={(e) => setSelectedParentFilter(e.target.value)}
                      className="pl-9 pr-8 py-2 border rounded-lg text-sm w-full bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0073ff]"
                    >
                      <option value="">All Parent Categories</option>
                      {parentOptions.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Type Filter Tabs */}
                  <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium self-center">
                    <button
                      type="button"
                      onClick={() => setTypeFilter("all")}
                      className={`flex-1 py-1.5 px-2 rounded-md transition text-center ${
                        typeFilter === "all"
                          ? "bg-white text-gray-900 shadow-sm font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeFilter("main")}
                      className={`flex-1 py-1.5 px-2 rounded-md transition text-center ${
                        typeFilter === "main"
                          ? "bg-white text-gray-900 shadow-sm font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Main
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeFilter("sub")}
                      className={`flex-1 py-1.5 px-2 rounded-md transition text-center ${
                        typeFilter === "sub"
                          ? "bg-white text-gray-900 shadow-sm font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Subcategories
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-[#0073ff] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="p-12 text-center text-gray-500 space-y-2">
                  <p>No categories found matching your criteria.</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#0073ff] underline hover:text-[#005bb5]"
                    >
                      Clear active filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Name & Subcategories
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Parent Category
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedRows.map((cat) => {
                        const isMain = cat.parentId == null;
                        const isEditing = editingCategory?.id === cat.id;

                        return (
                          <tr
                            key={cat.id}
                            className={`hover:bg-gray-50 transition ${
                              isEditing ? "bg-[#0073ff]/10" : ""
                            }`}
                          >
                            {/* Name & Subcategories Count */}
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                              <div className="flex items-center gap-2">
                                {!isMain && (
                                  <span className="text-gray-400 font-normal pl-2 select-none">
                                    ↳
                                  </span>
                                )}
                                <span
                                  className={
                                    !isMain
                                      ? "text-gray-700 font-medium"
                                      : "text-gray-900 font-bold"
                                  }
                                >
                                  {cat.name}
                                </span>
                                {isMain && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    {cat.childrenCount}{" "}
                                    {cat.childrenCount === 1
                                      ? "subcategory"
                                      : "subcategories"}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Type Pill */}
                            <td className="px-6 py-4 text-xs">
                              {isMain ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  Main Category
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                  Subcategory
                                </span>
                              )}
                            </td>

                            {/* Parent Category */}
                            <td className="px-6 py-4 text-sm">
                              {!isMain ? (
                                <span className="text-gray-700 font-medium">
                                  {cat.parentName || "—"}
                                </span>
                              ) : (
                                <span className="text-gray-400 select-none">—</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-sm text-right">
                              <div className="flex justify-end items-center gap-2">
                                {isMain && (
                                  <button
                                    onClick={() => handleAddSubcategory(cat)}
                                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition inline-flex items-center gap-1 border border-blue-200"
                                    title="Add Subcategory under this category"
                                  >
                                    <Plus size={14} /> Add Sub
                                  </button>
                                )}
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-2 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition border border-gray-200"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat.id, cat.name)}
                                  className="p-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition border border-gray-200"
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

