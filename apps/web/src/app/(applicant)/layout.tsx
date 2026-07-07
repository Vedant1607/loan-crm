import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "APPLICANT") redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-slate-900 text-lg">LoanFlow</span>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/apply"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                My Applications
              </Link>
              <Link
                href="/apply/new"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Apply for Loan
              </Link>
              <Link
                href="/emi"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                EMI Tracker
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              +91 {session.user.phone}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
