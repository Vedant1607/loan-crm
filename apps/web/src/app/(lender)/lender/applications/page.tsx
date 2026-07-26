import { auth } from "@/lib/auth";
import { prisma, Prisma, ApplicationStatus, LoanType } from "@loan-crm/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
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
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Personal",
  MSME_BUSINESS: "MSME",
  HOME: "Home",
  VEHICLE: "Vehicle",
};

interface Props {
  searchParams: {
    status?: string;
    loanType?: string;
    search?: string;
  };
}

export default async function ApplicationsListPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const officerProfile = await prisma.lenderOfficer.findUnique({
    where: { userId: session.user.id },
  });

  // Build where clause with filters
  const whereClause: Prisma.LoanApplicationWhereInput = {};

  if (session.user.role !== "SUPER_ADMIN") {
    if (officerProfile) {
      whereClause.lenderId = officerProfile.lenderId;
    } else {
      whereClause.officerId = session.user.id;
    }
  }

  if (searchParams.status && searchParams.status !== "ALL") {
    whereClause.status = searchParams.status as ApplicationStatus;
  }

  if (searchParams.loanType && searchParams.loanType !== "ALL") {
    whereClause.loanType = searchParams.loanType as LoanType;
  }

  if (searchParams.search) {
    whereClause.OR = [
      { applicationNo: { contains: searchParams.search, mode: "insensitive" } },
      { applicantName: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const applications = await prisma.loanApplication.findMany({
    where: whereClause,
    include: {
      applicant: { select: { name: true, phone: true } },
      lender: { select: { name: true, referenceId: true } },
      documents: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const statuses = [
    "ALL",
    "SUBMITTED",
    "DOCUMENT_PENDING",
    "UNDER_AI_REVIEW",
    "UNDER_OFFICER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
  ];
  const loanTypes = ["ALL", "PERSONAL", "MSME_BUSINESS", "HOME", "VEHICLE"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {applications.length} applications found
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <form className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-500 font-medium block mb-1">
                Search
              </label>
              <input
                name="search"
                type="text"
                defaultValue={searchParams.search}
                placeholder="Application no or name..."
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Status filter */}
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={searchParams.status ?? "ALL"}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan type filter */}
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">
                Loan Type
              </label>
              <select
                name="loanType"
                defaultValue={searchParams.loanType ?? "ALL"}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {loanTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "ALL" ? "All Types" : LOAN_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-700 transition-colors"
            >
              Filter
            </button>

            <Link
              href="/lender/applications"
              className="px-4 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-md hover:bg-slate-50 transition-colors"
            >
              Reset
            </Link>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Application",
                  "Applicant",
                  "Loan Type",
                  "Amount",
                  "Docs",
                  "Status",
                  "Submitted",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-12">
                    No applications match your filters
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
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
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-700">
                        {app.applicant.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        +91 {app.applicant.phone}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {LOAN_TYPE_LABELS[app.loanType]}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      ₹{app.loanAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {app.documents.length}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          STATUS_STYLES[app.status] ??
                          "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">
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
