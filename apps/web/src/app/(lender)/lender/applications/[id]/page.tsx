import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DecisionPanel from "@/components/dashboard/DecisionPanel";
import AIReportPanel from "@/components/dashboard/AIReportPanel";

interface Props {
  params: { id: string };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Personal Loan",
  MSME_BUSINESS: "MSME / Business Loan",
  HOME: "Home Loan",
  VEHICLE: "Vehicle Loan",
};

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  DOCUMENT_PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_AI_REVIEW: "bg-purple-100 text-purple-700",
  UNDER_OFFICER_REVIEW: "bg-indigo-100 text-indigo-700",
  APPROVED: "bg-green-100 text-green-700",
  CONDITIONALLY_APPROVED: "bg-teal-100 text-teal-700",
  REJECTED: "bg-red-100 text-red-700",
  DISBURSED: "bg-emerald-100 text-emerald-700",
};

export default async function ApplicationDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const app = await prisma.loanApplication.findUnique({
    where: { id: params.id },
    include: {
      applicant: true,
      lender: true,
      documents: { orderBy: { uploadedAt: "asc" } },
    },
  });

  if (!app) notFound();

  const statusStyle =
    STATUS_STYLES[app.status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {app.applicationNo}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {LOAN_TYPE_LABELS[app.loanType]} · Submitted{" "}
            {format(new Date(app.createdAt), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle}`}
        >
          {app.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left column — applicant + loan details */}
        <div className="col-span-2 space-y-5">
          {/* Applicant Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Applicant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Row label="Full Name" value={app.applicantName} />
              <Row label="Phone" value={`+91 ${app.applicant.phone}`} />
              <Row
                label="Date of Birth"
                value={format(new Date(app.dob), "dd MMM yyyy")}
              />
              <Row label="Gender" value={app.gender ?? "—"} />
              <Row
                label="Employment"
                value={app.employmentType.replace(/_/g, " ")}
              />
              <Row
                label="Address"
                value={`${app.address}, ${app.city}, ${app.state} - ${app.pincode}`}
              />
              <Separator className="my-2" />
              <Row label="PAN" value="Encrypted (view on request)" />
              <Row label="Aadhaar" value={`XXXX XXXX ${app.aadhaarLast4}`} />
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Row label="Loan Type" value={LOAN_TYPE_LABELS[app.loanType]} />
              <Row
                label="Amount Requested"
                value={`₹${app.loanAmount.toLocaleString("en-IN")}`}
              />
              <Row label="Tenure" value={`${app.tenureMonths} months`} />
              <Row
                label="Monthly Income"
                value={`₹${app.monthlyIncome.toLocaleString("en-IN")}`}
              />
              <Row
                label="Existing EMIs"
                value={`₹${app.existingEmiObligations.toLocaleString("en-IN")}`}
              />
              <Row label="Purpose" value={app.purpose} />
              <Separator className="my-2" />
              <Row label="Assigned Lender" value={app.lender.name} />
              <Row label="Lender Ref ID" value={app.lender.referenceId} />
            </CardContent>
          </Card>

          {/* Business Details (MSME) */}
          {app.loanType === "MSME_BUSINESS" && app.businessName && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Row label="Business Name" value={app.businessName} />
                <Row label="Business Type" value={app.businessType ?? "—"} />
                <Row
                  label="GST Number"
                  value={app.gstNumber ?? "Not provided"}
                />
                <Row
                  label="Years in Business"
                  value={`${app.businessVintage ?? 0} years`}
                />
                <Row
                  label="Annual Turnover"
                  value={`₹${(app.annualTurnover ?? 0).toLocaleString("en-IN")}`}
                />
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Documents ({app.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {app.documents.length === 0 ? (
                <p className="text-sm text-slate-400">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {app.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-1.5 text-sm border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <div>
                          <p className="text-slate-700 font-medium">
                            {doc.type.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-slate-400">
                            {doc.fileName} · {(doc.fileSize / 1024).toFixed(0)}{" "}
                            KB
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          doc.status === "VERIFIED"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : doc.status === "UPLOADED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Report */}
          <AIReportPanel
            applicationId={app.id}
            mongoId={app.aiAnalysisMongoId}
            riskScore={app.aiRiskScore}
            recommendation={app.aiRecommendation}
            status={app.status}
          />
        </div>

        {/* Right column — decision panel */}
        <div className="col-span-1">
          <DecisionPanel
            applicationId={app.id}
            currentStatus={app.status}
            loanAmount={app.loanAmount}
            tenureMonths={app.tenureMonths}
            officerNotes={app.officerNotes}
            sanctionedAmount={app.sanctionedAmount}
            sanctionedRate={app.sanctionedRate}
            sanctionedTenure={app.sanctionedTenure}
          />
        </div>
      </div>
    </div>
  );
}
