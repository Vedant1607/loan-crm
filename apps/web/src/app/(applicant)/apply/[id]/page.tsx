import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { notFound, redirect } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
}

const STATUS_STEPS = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "DOCUMENT_PENDING", label: "Documents" },
  { key: "UNDER_AI_REVIEW", label: "AI Review" },
  { key: "UNDER_OFFICER_REVIEW", label: "Officer Review" },
  { key: "APPROVED", label: "Decision" },
];

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" },
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
  DOCUMENT_PENDING: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Documents Pending",
  },
  UNDER_AI_REVIEW: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Under AI Review",
  },
  UNDER_OFFICER_REVIEW: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    label: "Under Review",
  },
  APPROVED: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
  CONDITIONALLY_APPROVED: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    label: "Conditionally Approved",
  },
  REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  DISBURSED: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Disbursed",
  },
  ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
  CLOSED: { bg: "bg-slate-100", text: "text-slate-500", label: "Closed" },
  NPA: { bg: "bg-red-200", text: "text-red-800", label: "NPA" },
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Personal Loan",
  MSME_BUSINESS: "MSME / Business Loan",
  HOME: "Home Loan",
  VEHICLE: "Vehicle Loan",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium">{value}</span>
    </div>
  );
}

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    SUBMITTED: 0,
    DOCUMENT_PENDING: 1,
    UNDER_AI_REVIEW: 2,
    UNDER_OFFICER_REVIEW: 3,
    APPROVED: 4,
    CONDITIONALLY_APPROVED: 4,
    REJECTED: 4,
    DISBURSED: 4,
    ACTIVE: 4,
    CLOSED: 4,
  };
  return map[status] ?? 0;
}

export default async function ApplicationStatusPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { submitted } = await searchParams;
  const session = await auth();
  if (!session) redirect("/login");

  const application = await prisma.loanApplication.findUnique({
    where: { id },
    include: {
      lender: { select: { name: true, referenceId: true, shortCode: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
    },
  });

  if (!application) notFound();

  // Only the applicant or staff can view
  if (
    application.applicantId !== session.user.id &&
    session.user.role === "APPLICANT"
  ) {
    redirect("/apply");
  }

  const statusStyle =
    STATUS_STYLES[application.status] ?? STATUS_STYLES.SUBMITTED;
  const currentStep = getStepIndex(application.status);
  const isDecided = ["APPROVED", "CONDITIONALLY_APPROVED", "REJECTED"].includes(
    application.status,
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Submitted success banner */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm font-medium">
          ✅ Application submitted successfully! We will review it shortly.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {application.applicationNo}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {LOAN_TYPE_LABELS[application.loanType]} ·{" "}
            {formatDistanceToNow(new Date(application.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Progress Tracker */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep && !isDecided;
              const decided = i === currentStep && isDecided;

              return (
                <div
                  key={step.key}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        done
                          ? "bg-slate-900 text-white"
                          : decided
                            ? application.status === "REJECTED"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                            : active
                              ? "bg-slate-900 text-white ring-4 ring-slate-200"
                              : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done
                        ? "✓"
                        : decided
                          ? application.status === "REJECTED"
                            ? "✕"
                            : "✓"
                          : i + 1}
                    </div>
                    <span
                      className={`text-xs text-center leading-tight ${active || done || decided ? "text-slate-700 font-medium" : "text-slate-400"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 mb-4 ${i < currentStep ? "bg-slate-900" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Decision Card (if decided) */}
      {isDecided && (
        <Card
          className={`border-2 ${
            application.status === "APPROVED" ||
            application.status === "CONDITIONALLY_APPROVED"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="pt-4 pb-4">
            {application.status === "APPROVED" && (
              <div className="space-y-2">
                <p className="font-semibold text-green-800">
                  🎉 Loan Approved!
                </p>
                {application.sanctionedAmount && (
                  <Row
                    label="Sanctioned Amount"
                    value={`₹${application.sanctionedAmount.toLocaleString("en-IN")}`}
                  />
                )}
                {application.sanctionedRate && (
                  <Row
                    label="Interest Rate"
                    value={`${application.sanctionedRate}% p.a.`}
                  />
                )}
                {application.sanctionedTenure && (
                  <Row
                    label="Tenure"
                    value={`${application.sanctionedTenure} months`}
                  />
                )}
                {application.officerNotes && (
                  <p className="text-sm text-green-700 mt-2">
                    {application.officerNotes}
                  </p>
                )}
              </div>
            )}
            {application.status === "CONDITIONALLY_APPROVED" && (
              <div className="space-y-2">
                <p className="font-semibold text-teal-800">
                  ✅ Conditionally Approved
                </p>
                {application.conditionsForApproval && (
                  <p className="text-sm text-teal-700">
                    {application.conditionsForApproval}
                  </p>
                )}
              </div>
            )}
            {application.status === "REJECTED" && (
              <div className="space-y-2">
                <p className="font-semibold text-red-800">
                  Application Rejected
                </p>
                {application.rejectionReason && (
                  <p className="text-sm text-red-700">
                    {application.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loan Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Loan Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row
            label="Amount Requested"
            value={`₹${application.loanAmount.toLocaleString("en-IN")}`}
          />
          <Row label="Tenure" value={`${application.tenureMonths} months`} />
          <Row
            label="Loan Type"
            value={LOAN_TYPE_LABELS[application.loanType]}
          />
          <Row label="Purpose" value={application.purpose} />
          <Separator className="my-2" />
          <Row label="Lender" value={application.lender.name} />
          <Row label="Lender Ref ID" value={application.lender.referenceId} />
          <Row
            label="Applied On"
            value={format(
              new Date(application.createdAt),
              "dd MMM yyyy, hh:mm a",
            )}
          />
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Uploaded Documents ({application.documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {application.documents.length === 0 ? (
            <p className="text-sm text-slate-400">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span className="text-slate-700">
                      {doc.type.replace(/_/g, " ")}
                    </span>
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
    </div>
  );
}
