import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell, { type AppShellNavItem } from "@/components/dashboard/AppShell";

const NAV_ITEMS: AppShellNavItem[] = [
  { href: "/apply",     label: "My Applications", icon: "dashboard" },
  { href: "/apply/new", label: "Apply for Loan",   icon: "plus-circle" },
  { href: "/emi",       label: "EMI Tracker",      icon: "credit-card" },
];

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "APPLICANT") redirect("/login");

  const userLabel = session.user.email ?? `+91 ${session.user.phone}`;

  return (
    <AppShell
      portalLabel="Applicant Portal"
      navItems={NAV_ITEMS}
      userLabel={userLabel}
      roleLabel="Applicant"
    >
      {children}
    </AppShell>
  );
}