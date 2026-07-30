"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, FolderOpen, Plus, Search, Trash2, X } from "lucide-react";
import AdminPagination, { ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CategoryManagement() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= RESET PAGE ON SEARCH ================= */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= FETCH CATEGORIES ================= */
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

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name" && !editingCategory) {
      // Auto generate slug from name when adding new
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setForm({ name: value, slug: autoSlug });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "" });
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const savedCat = await res.json();
        setMessage(`✅ Category ${isEditing ? "updated" : "created"} successfully!`);
        if (isEditing) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory?.id ? savedCat : c))
          );
          setEditingCategory(null);
        } else {
          setCategories((prev) => [...prev, savedCat]);
        }
        setForm({ name: "", slug: "" });
      } else {
        const error = await res.json();
        setMessage(`❌ Failed: ${error.error || error.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        if (editingCategory?.id === id) cancelEdit();
      } else {
        const error = await res.json();
        alert(`Failed to delete category: ${error.error || error.message || "Error occurred"}`);
      }
    } catch (err) {
      alert("Network error. Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ADMIN_PAGE_SIZE));
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * ADMIN_PAGE_SIZE,
    page * ADMIN_PAGE_SIZE
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
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
              <FolderOpen className="text-indigo-600" /> Category Management
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* FORM CARD */}
          <div className="bg-white p-6 rounded-2xl shadow border h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
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
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Technology"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. technology"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {editingCategory ? (
                    <>
                      <Edit size={16} /> Update Category
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Create Category
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

          {/* TABLE LIST CARD */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow border overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
                <h2 className="font-bold text-gray-800">
                  All Categories ({categories.length})
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search category..."
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No categories found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedCategories.map((cat) => (
                        <tr
                          key={cat.id}
                          className={`hover:bg-gray-50 transition ${
                            editingCategory?.id === cat.id ? "bg-indigo-50/50" : ""
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-600">
                            #{cat.id}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(cat)}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                title="Edit Category"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id, cat.name)}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                title="Delete Category"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
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
