import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell, { type AppShellNavItem } from "@/components/dashboard/AppShell";

const NAV_ITEMS: AppShellNavItem[] = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: "dashboard" },
  { href: "/admin/lenders",    label: "Lenders",    icon: "building" },
  { href: "/admin/users",      label: "Users",      icon: "user" },
  { href: "/admin/inquiries",  label: "Inquiries",  icon: "mail" },
  { href: "/admin/reports",    label: "Reports",    icon: "chart" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/login");

  const userLabel = session.user.email ?? `+91 ${session.user.phone}`;

  return (
    <AppShell
      portalLabel="Admin Panel"
      navItems={NAV_ITEMS}
      userLabel={userLabel}
      roleLabel="Super Admin"
    >
      {children}
    </AppShell>
  );
}