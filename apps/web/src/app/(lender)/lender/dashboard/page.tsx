import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED:             "bg-blue-100 text-blue-700",
  DOCUMENT_PENDING:      "bg-yellow-100 text-yellow-700",
  UNDER_AI_REVIEW:       "bg-purple-100 text-purple-700",
  UNDER_OFFICER_REVIEW:  "bg-indigo-100 text-indigo-700",
  APPROVED:              "bg-green-100 text-green-700",
  CONDITIONALLY_APPROVED:"bg-teal-100 text-teal-700",
  REJECTED:              "bg-red-100 text-red-700",
  DISBURSED:             "bg-emerald-100 text-emerald-700",
  ACTIVE:                "bg-green-100 text-green-800",
};

export default async function LenderDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  // Get lender profile for this officer
  const officerProfile = await prisma.lenderOfficer.findUnique({
    where:   { userId: session.user.id },
    include: { lender: true },
  });

  // Super admin sees all applications; officers see their lender's only
  const whereClause =
    session.user.role === "SUPER_ADMIN"
      ? {}
      : officerProfile
      ? { lenderId: officerProfile.lenderId }
      : { officerId: session.user.id };

  const [
    totalCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    underReviewCount,
    recentApplications,
  ] = await Promise.all([
    prisma.loanApplication.count({ where: whereClause }),
    prisma.loanApplication.count({
      where: { ...whereClause, status: "SUBMITTED" },
    }),
    prisma.loanApplication.count({
      where: {
        ...whereClause,
        status: { in: ["APPROVED", "CONDITIONALLY_APPROVED", "DISBURSED"] },
      },
    }),
    prisma.loanApplication.count({
      where: { ...whereClause, status: "REJECTED" },
    }),
    prisma.loanApplication.count({
      where: {
        ...whereClause,
        status: { in: ["UNDER_AI_REVIEW", "UNDER_OFFICER_REVIEW"] },
      },
    }),
    prisma.loanApplication.findMany({
      where:   whereClause,
      include: {
        applicant: { select: { name: true, phone: true } },
        lender:    { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take:    8,
    }),
  ]);

  const stats = [
    { label: "Total Applications", value: totalCount,      color: "text-slate-900" },
    { label: "New / Pending",      value: pendingCount,    color: "text-blue-600"  },
    { label: "Under Review",       value: underReviewCount,color: "text-indigo-600"},
    { label: "Approved",           value: approvedCount,   color: "text-green-600" },
    { label: "Rejected",           value: rejectedCount,   color: "text-red-600"   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Welcome back —{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day:     "numeric",
            month:   "long",
            year:    "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Applications</CardTitle>
          <Link
            href="/lender/applications"
            className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-2"
          >
            View all →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Application
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Applicant
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 py-10">
                    No applications yet
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/lender/applications/${app.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {app.applicationNo}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {app.loanType.replace(/_/g, " ")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">
                        {app.applicant.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {app.applicant.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      ₹{app.loanAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          STATUS_STYLES[app.status] ??
                          "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDistanceToNow(new Date(app.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}