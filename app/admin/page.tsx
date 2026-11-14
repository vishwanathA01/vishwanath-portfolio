import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/auth";
import { getPage, getSettings, listContacts, listPosts, listProjects, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  let error = "";
  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn();
    } catch (e) {
      error = e instanceof Error ? e.message : "Storage unavailable";
      return fallback;
    }
  };
  const [projects, posts, messages, settings, now, about, contact] = await Promise.all([
    safe(listProjects, []),
    safe(() => listPosts({ drafts: true }), []),
    safe(listContacts, []),
    getSettings(),
    getPage("now"),
    getPage("about"),
    getPage("contact")
  ]);
  return (
    <AdminDashboard
      initialProjects={projects}
      initialPosts={posts}
      initialMessages={messages}
      initialSettings={settings}
      initialPages={{ now, about, contact }}
      storage={storageMode}
      storageError={error}
    />
  );
}
