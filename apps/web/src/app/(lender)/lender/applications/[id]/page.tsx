import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DecisionPanel from "@/components/dashboard/DecisionPanel";
import AIAnalysisReport from "@/components/dashboard/AIAnalysisReport";
import RevealPanButton from "@/components/dashboard/RevealPanButton";

interface Props {
  params: Promise<{ id: string }>;
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

// Handles both new Vercel Blob URLs (full https://) and any legacy
// local-disk keys from before the Step 18 storage migration.
function getDocumentUrl(r2Key: string): string {
  if (r2Key.startsWith("http://") || r2Key.startsWith("https://")) {
    return r2Key;
  }
  return `/uploads/${r2Key}`;
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
  ACTIVE: "bg-green-100 text-green-800",
  CLOSED: "bg-slate-100 text-slate-500",
  NPA: "bg-red-200 text-red-800",
};

const DOC_STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  UPLOADED: "bg-blue-100 text-blue-700",
  PENDING: "bg-slate-100 text-slate-500",
};

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session) redirect("/login");

  const app = await prisma.loanApplication.findUnique({
    where: { id },
    include: {
      applicant: true,
      lender: true,
      documents: { orderBy: { uploadedAt: "asc" } },
    },
  });

  if (!app) notFound();

  const statusStyle = STATUS_STYLES[app.status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{app.applicationNo}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {LOAN_TYPE_LABELS[app.loanType]} · Submitted{" "}
            {format(new Date(app.createdAt), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle}`}>
          {app.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Applicant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Row label="Full Name" value={app.applicantName} />
              <Row label="Phone" value={`+91 ${app.applicant.phone}`} />
              <Row label="Date of Birth" value={format(new Date(app.dob), "dd MMM yyyy")} />
              <Row label="Gender" value={app.gender ?? "—"} />
              <Row label="Employment" value={app.employmentType.replace(/_/g, " ")} />
              <Row label="Address" value={`${app.address}, ${app.city}, ${app.state} - ${app.pincode}`} />
              <Separator className="my-2" />
              <RevealPanButton applicationId={app.id}/>
              <Row label="Aadhaar" value={`XXXX XXXX ${app.aadhaarLast4}`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Row label="Loan Type" value={LOAN_TYPE_LABELS[app.loanType]} />
              <Row label="Amount Requested" value={`₹${app.loanAmount.toLocaleString("en-IN")}`} />
              <Row label="Tenure" value={`${app.tenureMonths} months`} />
              <Row label="Monthly Income" value={`₹${app.monthlyIncome.toLocaleString("en-IN")}`} />
              <Row label="Existing EMIs" value={`₹${app.existingEmiObligations.toLocaleString("en-IN")}`} />
              <Row label="Purpose" value={app.purpose} />
              <Separator className="my-2" />
              <Row label="Assigned Lender" value={app.lender.name} />
              <Row label="Lender Ref ID" value={app.lender.referenceId} />
            </CardContent>
          </Card>

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
                <Row label="GST Number" value={app.gstNumber ?? "Not provided"} />
                <Row label="Years in Business" value={`${app.businessVintage ?? 0} years`} />
                <Row label="Annual Turnover" value={`₹${(app.annualTurnover ?? 0).toLocaleString("en-IN")}`} />
              </CardContent>
            </Card>
          )}

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
                  {app.documents.map((doc) => {
                    const docStatusStyle = DOC_STATUS_STYLES[doc.status] ?? "bg-slate-100 text-slate-500";
                    const viewUrl = getDocumentUrl(doc.r2Key);

                    return (
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
                              {doc.fileName} · {(doc.fileSize / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-900"
                          >
                            View
                          </a>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${docStatusStyle}`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </CardContent>
        </Card>

        <AIAnalysisReport
          applicationId={app.id}
          riskScore={app.aiRiskScore}
          recommendation={app.aiRecommendation}
          analyzedAt={app.aiAnalyzedAt}
        />
      </div>

      <div className="col-span-1">
        <DecisionPanel application={{ id: app.id, status: app.status }} />
      </div>
    </div>
    </div >
  );
}