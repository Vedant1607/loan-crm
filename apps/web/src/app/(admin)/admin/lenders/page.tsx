import { prisma } from "@loan-crm/db";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import CreateLenderDialog from "@/components/dashboard/CreateLenderDialog";
import ToggleLenderStatusButton from "@/components/dashboard/ToggleLenderStatusButton";

export default async function LendersPage() {
  const lenders = await prisma.lender.findMany({
    include: {
      _count: { select: { applications: true, officers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lenders</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {lenders.length} registered lending partners
          </p>
        </div>
        <CreateLenderDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">Reference ID</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Loan Types</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Regions</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Interest Rate</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Applications</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {lenders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-slate-400 py-12">
                    No lenders added yet
                  </td>
                </tr>
              ) : (
                lenders.map((lender) => (
                  <tr key={lender.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/lenders/${lender.id}`}
                        className="font-mono text-xs font-semibold text-slate-900 hover:underline"
                      >
                        {lender.referenceId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{lender.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {lender.loanTypes.map((t) => (
                          <span key={t} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {t.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {lender.isPanIndia ? "Pan India" : lender.regions.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {lender.interestRateMin}% – {lender.interestRateMax}%
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lender._count.applications}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        lender.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {lender.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ToggleLenderStatusButton lenderId={lender.id} isActive={lender.isActive} />
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