import { prisma } from "@loan-crm/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subMonths, startOfMonth, format } from "date-fns";
import ReportsCharts from "@/components/dashboard/ReportsCharts";

const MONTHS_BACK = 6;

const ACTIVE_LIKE_STATUSES = ["APPROVED", "CONDITIONALLY_APPROVED", "DISBURSED", "ACTIVE", "CLOSED"];

export default async function ReportsPage() {
  const now        = new Date();
  const rangeStart = startOfMonth(subMonths(now, MONTHS_BACK - 1));

  const [applicationsInRange, disbursedInRange] = await Promise.all([
    prisma.loanApplication.findMany({
      where:  { createdAt: { gte: rangeStart } },
      select: { createdAt: true, status: true },
    }),
    prisma.loanApplication.findMany({
      where:  { disbursedAt: { gte: rangeStart } },
      select: { disbursedAt: true, sanctionedAmount: true },
    }),
  ]);

  // Build empty month buckets first, so months with zero activity still show
  const buckets: Record<string, { label: string; applications: number; approved: number; disbursed: number }> = {};
  const orderedKeys: string[] = [];

  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const key         = format(monthStart, "yyyy-MM");
    orderedKeys.push(key);
    buckets[key] = { label: format(monthStart, "MMM yyyy"), applications: 0, approved: 0, disbursed: 0 };
  }

  for (const app of applicationsInRange) {
    const key = format(startOfMonth(app.createdAt), "yyyy-MM");
    if (buckets[key]) {
      buckets[key].applications += 1;
      if (ACTIVE_LIKE_STATUSES.includes(app.status)) {
        buckets[key].approved += 1;
      }
    }
  }

  for (const loan of disbursedInRange) {
    if (!loan.disbursedAt) continue;
    const key = format(startOfMonth(loan.disbursedAt), "yyyy-MM");
    if (buckets[key]) {
      buckets[key].disbursed += loan.sanctionedAmount ?? 0;
    }
  }

  const chartData = orderedKeys.map((key) => buckets[key]);

  const totalApplications = applicationsInRange.length;
  const totalApproved     = applicationsInRange.filter((a) => ACTIVE_LIKE_STATUSES.includes(a.status)).length;
  const totalDisbursed    = disbursedInRange.reduce((sum, l) => sum + (l.sanctionedAmount ?? 0), 0);
  const approvalRate      = totalApplications > 0 ? ((totalApproved / totalApplications) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Disbursement and loan volume trends — last {MONTHS_BACK} months
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Applications ({MONTHS_BACK}mo)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-900">{totalApplications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Approved ({MONTHS_BACK}mo)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-indigo-600">{approvalRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Total Disbursed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-slate-900">
              ₹{totalDisbursed.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportsCharts data={chartData} />
    </div>
  );
}