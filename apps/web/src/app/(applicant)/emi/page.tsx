import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const EMI_STATUS_STYLES: Record<string, string> = {
  UPCOMING: "bg-slate-100 text-slate-600",
  DUE: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  PARTIAL: "bg-orange-100 text-orange-700",
  WAIVED: "bg-slate-100 text-slate-400",
};

export default async function ApplicantEmiPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Get all active loans (approved applications) for this applicant
  const activeLoans = await prisma.loanApplication.findMany({
    where: {
      applicantId: session.user.id,
      status: { in: ["APPROVED", "ACTIVE", "DISBURSED", "CLOSED", "NPA"] },
    },
    include: {
      lender: { select: { name: true } },
      emiSchedule: { orderBy: { installmentNo: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">EMI Tracker</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Track your loan repayments and upcoming installments
        </p>
      </div>

      {activeLoans.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-slate-400">No active loans yet</p>
            <Link
              href="/apply/new"
              className="text-sm text-slate-900 underline underline-offset-2 mt-2 inline-block"
            >
              Apply for a loan
            </Link>
          </CardContent>
        </Card>
      ) : (
        activeLoans.map((loan) => {
          const totalPaid = loan.emiSchedule.reduce(
            (s, e) => s + e.paidAmount,
            0,
          );
          const totalAmount = loan.emiSchedule.reduce(
            (s, e) => s + e.totalAmount,
            0,
          );
          const overdueCount = loan.emiSchedule.filter(
            (e) => e.status === "OVERDUE",
          ).length;
          const nextDue = loan.emiSchedule.find((e) =>
            ["UPCOMING", "DUE", "OVERDUE"].includes(e.status),
          );
          const progressPct =
            totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

          return (
            <Card key={loan.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {loan.applicationNo}
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {loan.lender.name}
                    </p>
                  </div>
                  {overdueCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">
                      {overdueCount} Overdue
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>₹{totalPaid.toLocaleString("en-IN")} paid</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")} total</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Next Due */}
                {nextDue && (
                  <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Next Payment Due</p>
                      <p className="font-semibold text-slate-900">
                        ₹{nextDue.totalAmount.toLocaleString("en-IN")} on{" "}
                        {format(new Date(nextDue.dueDate), "dd MMM yyyy")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${EMI_STATUS_STYLES[nextDue.status]}`}
                    >
                      {nextDue.status}
                    </span>
                  </div>
                )}

                {/* Installment Table */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-slate-500 hover:text-slate-900 font-medium">
                    View full schedule ({loan.emiSchedule.length} installments)
                  </summary>
                  <div className="mt-3 max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="text-left py-1.5">#</th>
                          <th className="text-left py-1.5">Due Date</th>
                          <th className="text-left py-1.5">Amount</th>
                          <th className="text-left py-1.5">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loan.emiSchedule.map((emi) => (
                          <tr key={emi.id} className="border-b border-slate-50">
                            <td className="py-1.5 text-slate-600">
                              {emi.installmentNo}
                            </td>
                            <td className="py-1.5 text-slate-600">
                              {format(new Date(emi.dueDate), "dd MMM yyyy")}
                            </td>
                            <td className="py-1.5 font-medium text-slate-900">
                              ₹{emi.totalAmount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded-full font-medium ${EMI_STATUS_STYLES[emi.status]}`}
                              >
                                {emi.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
