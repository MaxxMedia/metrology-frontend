// app/admin/posts/edit/[id]/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import UploadBox from "@/components/UploadBox";
import PostBuilder from "@/app/admin/components/PostBuilder";
import { ContentBlock } from "@/app/admin/components/types";

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    badge: string;
    imageUrl: string;
    excerpt: string;
    content: string;
    contentBlocks: ContentBlock[];
    authorId: string;
    categoryId: string;
    subCategoryId: string;
    facebookUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    youtubeUrl: string;
    email: string;
    whatsappNumber: string;
  }>({
    title: "",
    slug: "",
    badge: "",
    imageUrl: "",
    excerpt: "",
    content: "",
    contentBlocks: [],
    authorId: "",
    categoryId: "",
    subCategoryId: "",
    facebookUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    email: "",
    whatsappNumber: "",
  });

  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const parentCategories = categories.filter((c) => c.parentId == null);
  const subCategories = categories.filter(
    (c) => c.parentId != null && String(c.parentId) === form.categoryId
  );

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      try {
        const [postRes, authorRes, categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
        ]);

        const postJson = await postRes.json();
        const post = postJson.data || postJson;

        // Handle image URL - ensure it's absolute if needed
        let imageUrl = post.imageUrl || "";
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
          imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
        }

        setForm({
          title: post.title || "",
          slug: post.slug || "",
          badge: post.badge || "",
          imageUrl: imageUrl,
          excerpt: post.excerpt || "",
          content: post.content || "",
          contentBlocks: post.contentBlocks || [],
          authorId: String(post.authorId || post.author?.id || ""),
          categoryId: String(post.categoryId || post.category?.id || ""),
          subCategoryId: String(post.subCategoryId || post.subCategory?.id || ""),
          facebookUrl: post.facebookUrl || "",
          linkedinUrl: post.linkedinUrl || "",
          twitterUrl: post.twitterUrl || "",
          youtubeUrl: post.youtubeUrl || "",
          email: post.email || "",
          whatsappNumber: post.whatsappNumber || "",
        });

        setIsPublished(Boolean(post.publishedAt));

        const authorJson = await authorRes.json();
        const categoryJson = await categoryRes.json();

        setAuthors(Array.isArray(authorJson) ? authorJson : authorJson.data || []);
        setCategories(Array.isArray(categoryJson) ? categoryJson : categoryJson.data || []);
      } catch (error) {
        console.error("Failed to load post:", error);
        setMessage("❌ Failed to load post");
      }
    }

    if (id) load();
  }, [id]);

  /* ================= HANDLERS ================= */
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({ ...prev, title, slug }));
  }

  function handleBadgeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (/^[A-Za-z]{0,10}$/.test(value)) {
      setForm((prev) => ({ ...prev, badge: value }));
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "categoryId") {
        return { ...prev, categoryId: value, subCategoryId: "" };
      }
      return { ...prev, [name]: value };
    });
  }

  /* ================= IMAGE UPLOAD ================= */
  async function handleImageUpload(file: File) {
    setUploading(true);
    setMessage("⏫ Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        // Ensure the URL is absolute
        const imageUrl = data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${data.imageUrl}`;
        
        setForm((prev) => ({ ...prev, imageUrl }));
        setMessage("✅ Image updated successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      setMessage("❌ Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("token");

    // Generate excerpt from content blocks if no excerpt provided
    let excerpt = form.excerpt.trim();
    if (!excerpt && form.contentBlocks.length > 0) {
      const firstParagraph = form.contentBlocks.find(
        (block) => block.type === "paragraph"
      ) as any;
      if (firstParagraph?.content) {
        excerpt = firstParagraph.content
          .replace(/<[^>]+>/g, "")
          .substring(0, 150) + "...";
      }
    } else if (!excerpt) {
      excerpt = form.content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...form,
            excerpt,
            contentBlocks: form.contentBlocks,
            authorId: Number(form.authorId),
            categoryId: Number(form.categoryId),
            subCategoryId: form.subCategoryId ? Number(form.subCategoryId) : null,
            publishedAt: isPublished ? new Date().toISOString() : null,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Post updated successfully!");
        setTimeout(() => router.push("/admin/posts"), 1500);
      } else {
        setMessage(`❌ ${data?.error || "Update failed"}`);
      }
    } catch {
      setLoading(false);
      setMessage("❌ Network error");
    }
  }

  /* ================= UI ================= */
  return (
    <div className="admin-cms mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0073ff]">
            Content
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Post
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update content, taxonomy, and publish status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="admin-btn-secondary"
        >
          ← Back to Posts
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl border p-4 text-center text-sm ${
            message.includes("✅")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="admin-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              required
              placeholder="Enter post title"
              className="admin-field"
            />
          </div>

          <div>
            <label className="admin-label">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="post-url-slug"
              className="admin-field"
            />
          </div>

          <div>
            <label className="admin-label">Badge</label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleBadgeChange}
              placeholder="FEATURED, WEBINAR, EVENT"
              maxLength={10}
              className="admin-field"
            />
          </div>

          <div>
            <label className="admin-label">Featured Image</label>
            <UploadBox
              label="Upload featured image"
              value={form.imageUrl}
              onUpload={handleImageUpload}
              accept="image/*"
              height="h-64"
              uploadType="image"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="admin-label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="admin-field"
              >
                <option value="">Select category</option>
                {parentCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">
                Subcategory{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <select
                name="subCategoryId"
                value={form.subCategoryId}
                onChange={handleChange}
                disabled={!form.categoryId || subCategories.length === 0}
                className="admin-field"
              >
                <option value="">
                  {!form.categoryId
                    ? "Select a category first"
                    : subCategories.length === 0
                      ? "No subcategories"
                      : "Select subcategory"}
                </option>
                {subCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label">
              Author <span className="text-red-500">*</span>
            </label>
            <select
              name="authorId"
              value={form.authorId}
              onChange={handleChange}
              required
              className="admin-field"
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">Excerpt</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Short summary (optional)"
              className="admin-field"
            />
          </div>

          <div>
            <label className="admin-label">
              Content <span className="text-red-500">*</span>
            </label>
            <PostBuilder
              value={form.contentBlocks}
              onChange={(blocks) =>
                setForm((prev) => ({
                  ...prev,
                  contentBlocks: blocks,
                }))
              }
            />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Social & Contact
              <span className="ml-2 text-sm font-normal text-slate-400">(optional)</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="facebookUrl" value={form.facebookUrl} onChange={handleChange} placeholder="Facebook URL" className="admin-field" />
              <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="admin-field" />
              <input name="twitterUrl" value={form.twitterUrl} onChange={handleChange} placeholder="Twitter/X URL" className="admin-field" />
              <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="YouTube URL" className="admin-field" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Contact Email" type="email" className="admin-field" />
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="WhatsApp Number" className="admin-field" />
            </div>
          </div>

          <div>
            <label className="admin-label">Publish Status</label>
            <select
              value={isPublished ? "published" : "draft"}
              onChange={(e) => setIsPublished(e.target.value === "published")}
              className="admin-field"
            >
              <option value="published">Published (visible on site)</option>
              <option value="draft">Draft (hidden from site)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="admin-btn-primary w-full"
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}