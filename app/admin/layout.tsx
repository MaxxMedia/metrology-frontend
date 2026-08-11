// app/admin/layout.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Folder,
  LogOut,
  Mail,
  Users,
  UserPlus,
  ShieldCheck,
} from "lucide-react"

const SUPER_ROLES = ["super_admin", "admin"]
const API_URL = process.env.NEXT_PUBLIC_API_URL

function hasPermission(role: string | undefined, permissions: string[], key: string) {
  if (role && SUPER_ROLES.includes(role)) return true
  return permissions.includes(key)
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [role, setRole] = useState<string | undefined>(undefined)
  const [permissions, setPermissions] = useState<string[]>([])
  const [articlesOpen, setArticlesOpen] = useState(
    pathname.startsWith("/admin/posts") ||
    pathname.startsWith("/admin/articles")
  )
  const [usersOpen, setUsersOpen] = useState(
    pathname.startsWith("/admin/Users")
  )

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAllowed(true)
      setChecking(false)
      return
    }

    async function loadFreshSession() {
      const token = localStorage.getItem("token")

      if (!token) {
        localStorage.clear()
        router.replace("/admin/login")
        return
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          localStorage.clear()
          router.replace("/admin/login")
          return
        }

        const me = await res.json()

        if (!me?.role || !["admin", "super_admin", "sub_admin"].includes(me.role)) {
          router.replace("/unauthorized")
          return
        }

        if (me.isActive === false) {
          localStorage.clear()
          router.replace("/admin/login")
          return
        }

        localStorage.setItem("permissions", JSON.stringify(me.permissions || []))

        setRole(me.role)
        setPermissions(me.permissions || [])
        setAllowed(true)
      } catch {
        localStorage.clear()
        router.replace("/admin/login")
        return
      } finally {
        setChecking(false)
      }
    }

    loadFreshSession()
  }, [pathname, router])

  if (checking) return null

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!allowed) return null

  const can = (key: string) => hasPermission(role, permissions, key)
  const isSuperAdmin = role ? SUPER_ROLES.includes(role) : false

  return (
    <div className="min-h-screen flex bg-[#F4F7FB]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#111318] text-white flex flex-col border-r border-white/10 shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#0073ff] font-semibold">
            CMS
          </p>
          <h1 className="text-lg font-semibold tracking-wide text-white mt-1">
            Admin Panel
          </h1>
          <p className="text-xs text-[#8a8b93] mt-1">
            Tooling Trends
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {can("dashboard.view") && (
            <SidebarLink
              href="/admin/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              active={pathname === "/admin/dashboard"}
            />
          )}

          {can("articles.view") && (
            <div>
              <button
                onClick={() => setArticlesOpen(!articlesOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-[4px] text-sm font-medium transition-all
                  ${pathname.startsWith("/admin/posts") ||
                    pathname.startsWith("/admin/articles")
                    ? "bg-[#0073ff] text-white"
                    : "text-[#a1a1a1] hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Folder size={18} />
                  <span>Tech Articles</span>
                </div>
                <span className="text-xs">
                  {articlesOpen ? "▾" : "▸"}
                </span>
              </button>

              {articlesOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <SidebarLink
                    href="/admin/posts"
                    label="All Posts"
                    icon={<FileText size={16} />}
                    active={pathname === "/admin/posts"}
                  />

                  <SidebarLink
                    href="/admin/articles"
                    label="Article Moderation"
                    icon={<Folder size={16} />}
                    active={pathname === "/admin/articles"}
                  />
                </div>
              )}
            </div>
          )}

          {isSuperAdmin && (
            <div>
              <button
                onClick={() => setUsersOpen(!usersOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-[4px] text-sm font-medium transition-all
                  ${pathname.startsWith("/admin/Users")
                    ? "bg-[#0073ff] text-white"
                    : "text-[#a1a1a1] hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Users</span>
                </div>
                <span className="text-xs">
                  {usersOpen ? "▾" : "▸"}
                </span>
              </button>

              {usersOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <SidebarLink
                    href="/admin/Users/sub-admin"
                    label="Sub Admins"
                    icon={<Users size={16} />}
                    active={pathname.startsWith("/admin/Users/sub-admin")}
                  />

                  <SidebarLink
                    href="/admin/Users/custom-role-templates"
                    label="Custom Role Templates"
                    icon={<ShieldCheck size={16} />}
                    active={pathname === "/admin/Users/custom-role-templates"}
                  />
                </div>
              )}
            </div>
          )}

          {can("packages.view") && (
            <SidebarLink
              href="/admin/packages"
              label="Packages"
              icon={<Folder size={18} />}
              active={pathname === "/admin/packages"}
            />
          )}

          {can("banners.view") && (
            <SidebarLink
              href="/admin/banners"
              label="Banners"
              icon={<Folder size={18} />}
              active={pathname === "/admin/banners"}
            />
          )}

          {can("events.view") && (
            <SidebarLink
              href="/admin/events"
              label="Events"
              icon={<Folder size={18} />}
              active={pathname === "/admin/events"}
            />
          )}

          {can("leads.view") && (
            <SidebarLink
              href="/admin/leads"
              label="Leads"
              icon={<Users size={18} />}
              active={pathname === "/admin/leads" || pathname.startsWith("/admin/leads/")}
            />
          )}

          {can("contact.view") && (
            <SidebarLink
              href="/admin/contact"
              label="Contact"
              icon={<Mail size={18} />}
              active={pathname === "/admin/contact" || pathname.startsWith("/admin/contact/")}
            />
          )}

          {can("jobs.view") && (
            <SidebarLink
              href="/admin/jobs"
              label="Jobs"
              icon={<Folder size={18} />}
              active={pathname === "/admin/jobs"}
            />
          )}

          {can("supplier.view") && (
            <SidebarLink
              href="/admin/directories"
              label="Supplier Listing"
              icon={<Folder size={18} />}
              active={pathname === "/admin/directories"}
            />
          )}

          {can("magazine.view") && (
            <SidebarLink
              href="/admin/magazines"
              label="Magazine"
              icon={<Folder size={18} />}
              active={pathname === "/admin/magazines"}
            />
          )}

          {can("industry_talks.view") && (
            <SidebarLink
              href="/admin/industry-talks"
              label="Industry Talks"
              icon={<Folder size={18} />}
              active={pathname === "/admin/mmt-chats"}
            />
          )}

          {can("newsletter.view") && (
            <SidebarLink
              href="/admin/newsletter"
              label="Newsletter"
              icon={<Mail size={18} />}
              active={pathname.startsWith("/admin/newsletter")}
            />
          )}
          {can("webinar.view") && (
            <SidebarLink
              href="/admin/webinar"
              label="Webinar"
              icon={<UserPlus size={18} />}
              active={pathname.startsWith("/admin/webinar")}
            />
          )}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              localStorage.removeItem("permissions")
              router.push("/login")
            }}
            className="flex items-center gap-3 text-sm font-medium text-[#a1a1a1] hover:text-[#ef4444] transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-cms flex-1 overflow-y-auto bg-[#F4F7FB] text-slate-900">
        <div className="p-6 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-sm font-medium transition-all
        ${active
          ? "bg-[#0073ff] text-white"
          : "text-[#a1a1a1] hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
