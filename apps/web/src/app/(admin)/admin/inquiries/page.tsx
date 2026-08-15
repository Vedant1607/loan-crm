import { prisma } from "@loan-crm/db";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import InquiryStatusButton from "@/components/dashboard/InquiryStatusButton";

const STATUS_STYLES: Record<string, string> = {
  NEW:       "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  CLOSED:    "bg-slate-100 text-slate-500",
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL:      "Personal Loan",
  MSME_BUSINESS: "Business Loan",
  HOME:          "Home Loan",
  VEHICLE:       "Vehicle Loan",
};

export default async function InquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Inquiries</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {inquiries.length} total · {newCount} new
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Loan Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Message</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Received</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-12">
                    No inquiries yet
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  return (
                    <tr key={inquiry.id} className="border-b border-slate-50 hover:bg-slate-50 align-top">
                      <td className="px-5 py-3 font-medium text-slate-800">{inquiry.name}</td>
                      <td className="px-4 py-3">
                        <p className="text-slate-600">{inquiry.phone}</p>
                        <p className="text-xs text-slate-400">{inquiry.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {inquiry.loanType ? LOAN_TYPE_LABELS[inquiry.loanType] : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <p className="line-clamp-2">{inquiry.message}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {format(new Date(inquiry.createdAt), "dd MMM yyyy, hh:mm a")}
                      </td>
                      <td className="px-4 py-3">
                        <InquiryStatusButton inquiryId={inquiry.id} currentStatus={inquiry.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}