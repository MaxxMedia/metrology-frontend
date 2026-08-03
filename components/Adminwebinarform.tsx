import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

// ✅ FIX: apiBase was defaulting to "/api" — a relative path that resolves
// against the Next.js app itself (localhost:3000), which has no such
// route and 404s. Every other fetch in this codebase (see Header.tsx)
// builds the full URL from NEXT_PUBLIC_API_URL, so this does the same.
const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ✅ FIX: same 401 issue as the list page — these requests never sent the
// stored auth token. Reads the same "token" key Header.tsx writes/clears.
function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

// Type definitions
interface WebinarForm {
    title: string;
    shortDescription: string;
    fullDescription: string;
    heroImage: string;
    thumbnail: string;
    speakerName: string;
    speakerDesignation: string;
    speakerCompany: string;
    speakerImage: string;
    speakerLinkedin: string;
    registrationUrl: string;
    meetingUrl: string;
    youtubeUrl: string;
    startDate: string;
    endDate: string;
    duration: number;
    language: string;
    certificateAvailable: boolean;
    maxSeats: string | number;
    seoTitle: string;
    seoDescription: string;
}

interface AgendaItem {
    time: string;
    title: string;
}

interface Resource {
    title: string;
    fileUrl: string;
    fileSize: string;
}

interface AdminWebinarFormProps {
    webinarId?: string | null;
    apiBase?: string;
    onSaved?: (data: any) => void;
}

interface SectionProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

interface FieldProps {
    label: string;
    required?: boolean;
    full?: boolean;
    children?: React.ReactNode;
    hint?: string;
}

const EMPTY_FORM: WebinarForm = {
    title: "",
    shortDescription: "",
    fullDescription: "",
    heroImage: "",
    thumbnail: "",
    speakerName: "",
    speakerDesignation: "",
    speakerCompany: "",
    speakerImage: "",
    speakerLinkedin: "",
    registrationUrl: "",
    meetingUrl: "",
    youtubeUrl: "",
    startDate: "",
    endDate: "",
    duration: 60,
    language: "English",
    certificateAvailable: false,
    maxSeats: "",
    seoTitle: "",
    seoDescription: "",
};

function Section({ title, description, children }: SectionProps) {
    return (
        <div className="border-b border-slate-200 py-8 first:pt-0 last:border-0">
            <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
        </div>
    );
}

function Field({ label, required, full, children, hint }: FieldProps) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

export default function AdminWebinarForm({
    webinarId = null,
    apiBase = DEFAULT_API_BASE,
    onSaved,
}: AdminWebinarFormProps) {
    const [form, setForm] = useState<WebinarForm>(EMPTY_FORM);
    const [agenda, setAgenda] = useState<AgendaItem[]>([{ time: "", title: "" }]);
    const [learningPoints, setLearningPoints] = useState<string[]>([""]);
    const [resources, setResources] = useState<Resource[]>([{ title: "", fileUrl: "", fileSize: "" }]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isEditing = Boolean(webinarId);

    useEffect(() => {
        if (!webinarId) return;
        setLoading(true);
        fetch(`${apiBase}/admin/webinars/${webinarId}`, { headers: authHeaders() })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data) => {
                setForm({
                    ...EMPTY_FORM,
                    ...data,
                    startDate: data.startDate ? data.startDate.slice(0, 16) : "",
                    endDate: data.endDate ? data.endDate.slice(0, 16) : "",
                });
                if (Array.isArray(data.agenda) && data.agenda.length) setAgenda(data.agenda);
                if (Array.isArray(data.learningPoints) && data.learningPoints.length)
                    setLearningPoints(data.learningPoints);
                if (Array.isArray(data.resources) && data.resources.length) setResources(data.resources);
            })
            .catch(() => setError("Could not load this webinar for editing."))
            .finally(() => setLoading(false));
    }, [webinarId, apiBase]);

    const update = (key: keyof WebinarForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm((f) => ({ ...f, [key]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.title || !form.speakerName || !form.startDate) {
            setError("Title, speaker name and start date are required.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                duration: form.duration ? Number(form.duration) : null,
                maxSeats: form.maxSeats ? Number(form.maxSeats) : null,
                agenda: agenda.filter((a) => a.title),
                learningPoints: learningPoints.filter(Boolean),
                resources: resources.filter((r) => r.title && r.fileUrl),
            };

            const res = await fetch(
                `${apiBase}/admin/webinars${isEditing ? `/${webinarId}` : ""}`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: authHeaders({ "Content-Type": "application/json" }),
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save webinar");

            setSuccess(isEditing ? "Webinar updated." : "Webinar created as draft.");
            onSaved?.(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong saving the webinar.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading webinar…
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl bg-white px-6 py-8 font-sans">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        {isEditing ? "Edit Webinar" : "Create Webinar"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Saved as a draft — use Approve then Publish from the webinar list to
                        make it live.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <form onSubmit={submit}>
                <Section title="Basic Information">
                    <Field label="Title" required full>
                        <input value={form.title} onChange={update("title")} className={inputClass} placeholder="AI in Smart Manufacturing: The Next Revolution" />
                    </Field>

                    {/* <Field label="Language">
                        <input value={form.language} onChange={update("language")} className={inputClass} />
                    </Field> */}

                    <Field label="Short Description" full hint="Shown on webinar cards and listing page.">
                        <textarea value={form.shortDescription} onChange={update("shortDescription")} rows={2} className={inputClass} />
                    </Field>

                    <Field label="Full Description" full hint="Shown in the 'About the Webinar' section on the detail page.">
                        <textarea value={form.fullDescription} onChange={update("fullDescription")} rows={5} className={inputClass} />
                    </Field>

                    <Field label="Hero Image URL" full>
                        <input value={form.heroImage} onChange={update("heroImage")} className={inputClass} placeholder="https://…" />
                    </Field>

                    <Field label="Thumbnail Image URL" full hint="Used on listing cards — falls back to hero image if left blank.">
                        <input value={form.thumbnail} onChange={update("thumbnail")} className={inputClass} placeholder="https://…" />
                    </Field>
                </Section>

                <Section title="Video & Access" description="Where attendees join, and where the recording lives once it's on demand.">
                    <Field label="Meeting URL" hint="Zoom / Teams / Google Meet link for the live session.">
                        <input value={form.meetingUrl} onChange={update("meetingUrl")} className={inputClass} placeholder="https://zoom.us/…" />
                    </Field>
                    <Field label="YouTube / Recording URL" hint="Set this once the session is over to power On-Demand playback.">
                        <input value={form.youtubeUrl} onChange={update("youtubeUrl")} className={inputClass} placeholder="https://youtube.com/…" />
                    </Field>
                    <Field label="Registration URL" hint="Leave blank to use the built-in registration form.">
                        <input value={form.registrationUrl} onChange={update("registrationUrl")} className={inputClass} placeholder="https://…" />
                    </Field>
                </Section>

                <Section title="Schedule">
                    <Field label="Start Date & Time" required>
                        <input type="datetime-local" value={form.startDate} onChange={update("startDate")} className={inputClass} />
                    </Field>
                    <Field label="End Date & Time">
                        <input type="datetime-local" value={form.endDate} onChange={update("endDate")} className={inputClass} />
                    </Field>
                    <Field label="Duration (minutes)">
                        <input type="number" value={form.duration} onChange={update("duration")} className={inputClass} />
                    </Field>
                    <Field label="Max Seats" hint="Leave blank for unlimited.">
                        <input type="number" value={form.maxSeats} onChange={update("maxSeats")} className={inputClass} />
                    </Field>
                    <Field label="Certificate available">
                        <label className="flex items-center gap-2 pt-2 text-sm text-slate-700">
                            <input type="checkbox" checked={form.certificateAvailable} onChange={update("certificateAvailable")} className="h-4 w-4 rounded border-slate-300" />
                            Attendees receive a certificate
                        </label>
                    </Field>
                </Section>

                <Section title="Speaker">
                    <Field label="Speaker Name" required>
                        <input value={form.speakerName} onChange={update("speakerName")} className={inputClass} />
                    </Field>
                    <Field label="Designation">
                        <input value={form.speakerDesignation} onChange={update("speakerDesignation")} className={inputClass} />
                    </Field>
                    <Field label="Company">
                        <input value={form.speakerCompany} onChange={update("speakerCompany")} className={inputClass} />
                    </Field>
                    <Field label="LinkedIn URL">
                        <input value={form.speakerLinkedin} onChange={update("speakerLinkedin")} className={inputClass} placeholder="https://linkedin.com/in/…" />
                    </Field>
                    <Field label="Speaker Photo URL" full>
                        <input value={form.speakerImage} onChange={update("speakerImage")} className={inputClass} placeholder="https://…" />
                    </Field>
                </Section>

                <Section title="Agenda" description="Time slots shown on the detail page.">
                    <div className="sm:col-span-2 space-y-3">
                        {agenda.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={item.time}
                                    onChange={(e) => {
                                        const next = [...agenda];
                                        next[i] = { ...next[i], time: e.target.value };
                                        setAgenda(next);
                                    }}
                                    placeholder="03:00 PM – 03:10 PM"
                                    className={`${inputClass} w-48 shrink-0`}
                                />
                                <input
                                    value={item.title}
                                    onChange={(e) => {
                                        const next = [...agenda];
                                        next[i] = { ...next[i], title: e.target.value };
                                        setAgenda(next);
                                    }}
                                    placeholder="Welcome & Introduction"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAgenda(agenda.filter((_, idx) => idx !== i))}
                                    className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                                    aria-label="Remove agenda item"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setAgenda([...agenda, { time: "", title: "" }])}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <Plus className="h-4 w-4" /> Add agenda item
                        </button>
                    </div>
                </Section>

                <Section title="What You'll Learn" description="Bullet points shown on the detail page.">
                    <div className="sm:col-span-2 space-y-3">
                        {learningPoints.map((point, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={point}
                                    onChange={(e) => {
                                        const next = [...learningPoints];
                                        next[i] = e.target.value;
                                        setLearningPoints(next);
                                    }}
                                    placeholder="Predictive maintenance using AI"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setLearningPoints(learningPoints.filter((_, idx) => idx !== i))}
                                    className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                                    aria-label="Remove learning point"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setLearningPoints([...learningPoints, ""])}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <Plus className="h-4 w-4" /> Add learning point
                        </button>
                    </div>
                </Section>

                <Section title="Resources" description="Downloadable files shown on the detail page.">
                    <div className="sm:col-span-2 space-y-3">
                        {resources.map((res, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={res.title}
                                    onChange={(e) => {
                                        const next = [...resources];
                                        next[i] = { ...next[i], title: e.target.value };
                                        setResources(next);
                                    }}
                                    placeholder="Webinar Presentation.pdf"
                                    className={`${inputClass} w-56 shrink-0`}
                                />
                                <input
                                    value={res.fileUrl}
                                    onChange={(e) => {
                                        const next = [...resources];
                                        next[i] = { ...next[i], fileUrl: e.target.value };
                                        setResources(next);
                                    }}
                                    placeholder="https://…"
                                    className={inputClass}
                                />
                                <input
                                    value={res.fileSize}
                                    onChange={(e) => {
                                        const next = [...resources];
                                        next[i] = { ...next[i], fileSize: e.target.value };
                                        setResources(next);
                                    }}
                                    placeholder="2.4 MB"
                                    className={`${inputClass} w-24 shrink-0`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setResources(resources.filter((_, idx) => idx !== i))}
                                    className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                                    aria-label="Remove resource"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setResources([...resources, { title: "", fileUrl: "", fileSize: "" }])}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <Plus className="h-4 w-4" /> Add resource
                        </button>
                    </div>
                </Section>

                <Section title="SEO" description="Optional — falls back to title/description if left blank.">
                    <Field label="SEO Title">
                        <input value={form.seoTitle} onChange={update("seoTitle")} className={inputClass} />
                    </Field>
                    <Field label="SEO Description" full>
                        <textarea value={form.seoDescription} onChange={update("seoDescription")} rows={2} className={inputClass} />
                    </Field>
                </Section>

                <div className="flex items-center justify-end gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEditing ? "Save Changes" : "Create Webinar"}
                    </button>
                </div>
            </form>
        </div>
    );
}