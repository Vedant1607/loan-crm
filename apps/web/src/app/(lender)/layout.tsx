import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@loan-crm/db";
import AppShell, { type AppShellNavItem } from "@/components/dashboard/AppShell";

const NAV_ITEMS: AppShellNavItem[] = [
  { href: "/lender/dashboard",    label: "Dashboard",    icon: "dashboard" },
  { href: "/lender/applications", label: "Applications", icon: "file" },
  { href: "/lender/clients",      label: "Clients",      icon: "users" },
  { href: "/lender/emi",          label: "EMI Tracker",  icon: "credit-card" },
];

function formatRole(role: string) {
  return role
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export default async function LenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const allowed = ["LOAN_OFFICER", "LENDER_ADMIN", "SUPER_ADMIN"];
  if (!allowed.includes(session.user.role)) redirect("/login");

  const officerProfile = await prisma.lenderOfficer.findUnique({
    where:   { userId: session.user.id },
    include: { lender: { select: { name: true } } },
  });

  const portalLabel = officerProfile?.lender.name ?? "Lender Portal";
  const userLabel    = session.user.email ?? `+91 ${session.user.phone}`;
  const roleLabel    = formatRole(session.user.role);

  return (
    <AppShell
      portalLabel={portalLabel}
      navItems={NAV_ITEMS}
      userLabel={userLabel}
      roleLabel={roleLabel}
    >
      {children}
    </AppShell>
  );
}