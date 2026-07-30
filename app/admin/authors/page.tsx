"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Edit, Plus, Search, Trash2, Upload, User as UserIcon, X } from "lucide-react";
import AdminPagination, { ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";

type Author = {
  id: number;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export default function AuthorManagement() {
  const router = useRouter();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
  });
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= RESET PAGE ON SEARCH ================= */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= FETCH AUTHORS ================= */
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors`);
      if (res.ok) {
        const data = await res.json();
        setAuthors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch authors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  /* ================= AVATAR UPLOAD ================= */
  async function handleAvatarUpload(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const result = await res.json();
      setForm((prev) => ({ ...prev, avatarUrl: result.imageUrl }));
    } catch (err: any) {
      setMessage(`❌ Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  /* ================= FORM HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (author: Author) => {
    setEditingAuthor(author);
    setForm({
      name: author.name,
      bio: author.bio || "",
      avatarUrl: author.avatarUrl || "",
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingAuthor(null);
    setForm({ name: "", bio: "", avatarUrl: "" });
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const isEditing = Boolean(editingAuthor);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${editingAuthor?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/authors`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const savedAuthor = await res.json();
        setMessage(`✅ Author ${isEditing ? "updated" : "created"} successfully!`);
        if (isEditing) {
          setAuthors((prev) =>
            prev.map((a) => (a.id === editingAuthor?.id ? savedAuthor : a))
          );
          setEditingAuthor(null);
        } else {
          setAuthors((prev) => [...prev, savedAuthor]);
        }
        setForm({ name: "", bio: "", avatarUrl: "" });
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
    if (!confirm(`Are you sure you want to delete author "${name}"?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAuthors((prev) => prev.filter((a) => a.id !== id));
        if (editingAuthor?.id === id) cancelEdit();
      } else {
        const error = await res.json();
        alert(`Failed to delete author: ${error.error || error.message || "Error occurred"}`);
      }
    } catch (err) {
      alert("Network error. Failed to delete author.");
    }
  };

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.bio && a.bio.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredAuthors.length / ADMIN_PAGE_SIZE));
  const paginatedAuthors = filteredAuthors.slice(
    (page - 1) * ADMIN_PAGE_SIZE,
    page * ADMIN_PAGE_SIZE
  );

  const getFullImageUrl = (url?: string | null) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

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
              <UserIcon className="text-indigo-600" /> Author Management
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* FORM CARD */}
          <div className="bg-white p-6 rounded-2xl shadow border h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingAuthor ? "Edit Author" : "Add New Author"}
              </h2>
              {editingAuthor && (
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* AVATAR UPLOAD */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <label className="cursor-pointer group relative">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]);
                    }}
                  />
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 group-hover:border-indigo-500 transition relative">
                    {form.avatarUrl ? (
                      <Image
                        src={getFullImageUrl(form.avatarUrl) || ""}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : uploading ? (
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserIcon size={32} className="text-gray-400" />
                    )}
                    {!uploading && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-full">
                        <Upload size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                </label>
                <p className="text-xs text-gray-500">
                  {form.avatarUrl ? "Click to change photo" : "Click to upload avatar"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  placeholder="Brief author bio..."
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {editingAuthor ? (
                    <>
                      <Edit size={16} /> Update Author
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Create Author
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
                  All Authors ({authors.length})
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search author..."
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredAuthors.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No authors found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          Author
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                          Bio
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedAuthors.map((author) => (
                        <tr
                          key={author.id}
                          className={`hover:bg-gray-50 transition ${
                            editingAuthor?.id === author.id ? "bg-indigo-50/50" : ""
                          }`}
                        >
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative flex-shrink-0 flex items-center justify-center border">
                                {author.avatarUrl ? (
                                  <Image
                                    src={getFullImageUrl(author.avatarUrl) || ""}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <UserIcon size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {author.name}
                                </p>
                                <p className="text-xs text-gray-400">ID: #{author.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {author.bio || <span className="text-gray-400 italic">No bio</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(author)}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                title="Edit Author"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(author.id, author.name)}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                                title="Delete Author"
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
              totalItems={filteredAuthors.length}
              pageSize={ADMIN_PAGE_SIZE}
              itemLabel="authors"
              onPageChange={setPage}
              className="border-0 border-t rounded-none shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
