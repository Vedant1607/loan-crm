import { prisma } from "@loan-crm/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalApplicants,
    totalOfficers,
    totalLenders,
    activeLenders,
    totalApplications,
    approvedApplications,
    rejectedApplications,
    pendingApplications,
    totalDisbursedResult,
    totalEmiCollectedResult,
    overdueEmiCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "APPLICANT" } }),
    prisma.user.count({
      where: { role: { in: ["LOAN_OFFICER", "LENDER_ADMIN"] } },
    }),
    prisma.lender.count(),
    prisma.lender.count({ where: { isActive: true } }),
    prisma.loanApplication.count(),
    prisma.loanApplication.count({
      where: {
        status: {
          in: ["APPROVED", "CONDITIONALLY_APPROVED", "DISBURSED", "ACTIVE"],
        },
      },
    }),
    prisma.loanApplication.count({ where: { status: "REJECTED" } }),
    prisma.loanApplication.count({
      where: {
        status: {
          in: [
            "SUBMITTED",
            "DOCUMENT_PENDING",
            "UNDER_AI_REVIEW",
            "UNDER_OFFICER_REVIEW",
          ],
        },
      },
    }),
    prisma.loanApplication.aggregate({
      where: { sanctionedAmount: { not: null } },
      _sum: { sanctionedAmount: true },
    }),
    prisma.emiSchedule.aggregate({
      _sum: { paidAmount: true },
    }),
    prisma.emiSchedule.count({ where: { status: "OVERDUE" } }),
  ]);

  const totalDisbursed = totalDisbursedResult._sum.sanctionedAmount ?? 0;
  const totalEmiCollected = totalEmiCollectedResult._sum.paidAmount ?? 0;

  const approvalRate =
    totalApplications > 0
      ? ((approvedApplications / totalApplications) * 100).toFixed(1)
      : "0";

  const statCards = [
    {
      label: "Total Applications",
      value: totalApplications,
      color: "text-slate-900",
    },
    {
      label: "Pending Review",
      value: pendingApplications,
      color: "text-indigo-600",
    },
    { label: "Approved", value: approvedApplications, color: "text-green-600" },
    { label: "Rejected", value: rejectedApplications, color: "text-red-600" },
  ];

  const secondaryCards = [
    { label: "Approval Rate", value: `${approvalRate}%` },
    { label: "Active Lenders", value: `${activeLenders} / ${totalLenders}` },
    { label: "Overdue EMIs", value: overdueEmiCount },
    { label: "Total Users", value: totalUsers },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-900">
          <CardContent className="pt-5 pb-5">
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wide">
              Total Amount Disbursed
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{totalDisbursed.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-600 border-green-600">
          <CardContent className="pt-5 pb-5">
            <p className="text-xs text-green-100 uppercase font-medium tracking-wide">
              Total EMI Collected
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{totalEmiCollected.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => (
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {secondaryCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold text-slate-700">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breakdown by role */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            User Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-400">Applicants</p>
            <p className="text-xl font-bold text-slate-900">
              {totalApplicants}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">
              Loan Officers / Lender Admins
            </p>
            <p className="text-xl font-bold text-slate-900">{totalOfficers}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Registered Lenders</p>
            <p className="text-xl font-bold text-slate-900">{totalLenders}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
