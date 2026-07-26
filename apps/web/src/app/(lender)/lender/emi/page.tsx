import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import RecordPaymentButton from "@/components/dashboard/RecordPaymentButton";

const EMI_STATUS_STYLES: Record<string, string> = {
  UPCOMING: "bg-slate-100 text-slate-600",
  DUE: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  PARTIAL: "bg-orange-100 text-orange-700",
  WAIVED: "bg-slate-100 text-slate-400",
};

export default async function LenderEmiPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const officerProfile = await prisma.lenderOfficer.findUnique({
    where: { userId: session.user.id },
  });

  const whereClause =
    session.user.role === "SUPER_ADMIN"
      ? {}
      : officerProfile
        ? { application: { lenderId: officerProfile.lenderId } }
        : { application: { officerId: session.user.id } };

  // Get all EMIs that are due, overdue, or upcoming (next 30 days), sorted by urgency
  const emis = await prisma.emiSchedule.findMany({
    where: {
      ...whereClause,
      status: { in: ["UPCOMING", "DUE", "OVERDUE", "PARTIAL"] },
    },
    include: {
      application: {
        select: {
          applicationNo: true,
          applicantName: true,
          id: true,
          applicant: { select: { phone: true } },
        },
      },
    },
    orderBy: { dueDate: "asc" },
    take: 100,
  });

  const overdueEmis = emis.filter((e) => e.status === "OVERDUE");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">EMI Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {emis.length} pending installments across all borrowers
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400 uppercase font-medium">
              Overdue
            </p>
            <p className="text-2xl font-bold text-red-600">
              {overdueEmis.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400 uppercase font-medium">
              Pending
            </p>
            <p className="text-2xl font-bold text-yellow-600">{emis.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-400 uppercase font-medium">
              Total Amount Due
            </p>
            <p className="text-2xl font-bold text-slate-900">
              ₹
              {emis
                .reduce((s, e) => s + (e.totalAmount - e.paidAmount), 0)
                .toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* EMI Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Application
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Borrower
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Installment
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Due Date
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Amount
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {emis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-12">
                    No pending EMIs
                  </td>
                </tr>
              ) : (
                emis.map((emi) => (
                  <tr
                    key={emi.id}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/lender/applications/${emi.application.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {emi.application.applicationNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">
                        {emi.application.applicantName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {emi.application.applicant.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      #{emi.installmentNo}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {format(new Date(emi.dueDate), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      ₹
                      {(emi.totalAmount - emi.paidAmount).toLocaleString(
                        "en-IN",
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${EMI_STATUS_STYLES[emi.status]}`}
                      >
                        {emi.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RecordPaymentButton
                        emiId={emi.id}
                        pendingAmount={emi.totalAmount - emi.paidAmount}
                      />
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
