import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

// Status badge colour map
const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-100 text-blue-700",
  DOCUMENT_PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_AI_REVIEW: "bg-purple-100 text-purple-700",
  UNDER_OFFICER_REVIEW: "bg-indigo-100 text-indigo-700",
  APPROVED: "bg-green-100 text-green-700",
  CONDITIONALLY_APPROVED: "bg-teal-100 text-teal-700",
  REJECTED: "bg-red-100 text-red-700",
  DISBURSED: "bg-emerald-100 text-emerald-700",
  ACTIVE: "bg-green-100 text-green-800",
  CLOSED: "bg-slate-100 text-slate-500",
  NPA: "bg-red-200 text-red-800",
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Personal Loan",
  MSME_BUSINESS: "MSME / Business Loan",
  HOME: "Home Loan",
  VEHICLE: "Vehicle Loan",
};

export default async function ApplicantDashboard() {
  const session = await auth();
  if (!session) return null;

  const applications = await prisma.loanApplication.findMany({
    where: { applicantId: session.user.id },
    include: { lender: { select: { name: true, referenceId: true } } },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = applications.filter((a) => a.status === "ACTIVE").length;
  const pendingCount = applications.filter((a) =>
    [
      "SUBMITTED",
      "DOCUMENT_PENDING",
      "UNDER_AI_REVIEW",
      "UNDER_OFFICER_REVIEW",
    ].includes(a.status),
  ).length;
  const approvedCount = applications.filter((a) =>
    ["APPROVED", "CONDITIONALLY_APPROVED", "DISBURSED"].includes(a.status),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your loan applications and status updates
          </p>
        </div>
        <Button asChild>
          <Link href="/apply/new">+ New Application</Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold text-slate-900">
              {applications.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold text-indigo-600">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Approved / Active
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-3xl font-bold text-green-600">
              {approvedCount + activeCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-slate-400 text-lg font-medium">
              No applications yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Start your loan journey by applying now
            </p>
            <Button className="mt-4" asChild>
              <Link href="/apply/new">Apply for a Loan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link key={app.id} href={`/apply/${app.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {app.applicationNo}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            STATUS_STYLES[app.status] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">
                        {LOAN_TYPE_LABELS[app.loanType]} —{" "}
                        <span className="font-medium">
                          ₹{app.loanAmount.toLocaleString("en-IN")}
                        </span>{" "}
                        for {app.tenureMonths} months
                      </p>
                      <p className="text-slate-400 text-xs">
                        {app.lender.name} ({app.lender.referenceId}) ·{" "}
                        {formatDistanceToNow(new Date(app.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        ₹{app.loanAmount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {app.tenureMonths} months
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
