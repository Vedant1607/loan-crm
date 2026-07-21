import { auth } from "@/lib/auth";
import { prisma } from "@loan-crm/db";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";

const STATUS_STEPS = [
  { key: "SUBMITTED",            label: "Submitted" },
  { key: "DOCUMENT_PENDING",     label: "Documents" },
  { key: "UNDER_AI_REVIEW",      label: "AI Review" },
  { key: "UNDER_OFFICER_REVIEW", label: "Officer Review" },
  { key: "APPROVED",             label: "Decision" },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

export default async function ApplicationStatusPage({
  params,
  searchParams,
}: {
  params:       { id: string };
  searchParams: { submitted?: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const application = await prisma.loanApplication.findUnique({
    where:   { id: params.id },
    include: {
      lender:    { select: { name: true, referenceId: true, grievanceEmail: true } },
      documents: true,
    },
  });

  if (!application || application.applicantId !== session.user.id) {
    notFound();
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(application.status);
  const isTerminal = ["APPROVED", "CONDITIONALLY_APPROVED", "REJECTED", "DISBURSED", "ACTIVE", "CLOSED"].includes(application.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Banner */}
      {searchParams.submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <p className="text-green-700 font-medium text-sm">
            ✓ Application submitted successfully!
          </p>
          <p className="text-green-600 text-xs mt-0.5">
            We'll notify you of updates. You can track progress here.
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {application.applicationNo}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Submitted{" "}
          {formatDistanceToNow(new Date(application.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Status Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            {STATUS_STEPS.map((step, i) => {
              const isDone    = i < currentStatusIndex || isTerminal;
              const isCurrent = i === currentStatusIndex && !isTerminal;

              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? "bg-slate-900 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span className="text-xs text-slate-500 text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 mb-4 ${
                        isDone ? "bg-slate-900" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Terminal status messages */}
          {application.status === "APPROVED" && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-medium text-sm">🎉 Loan Approved!</p>
              {application.sanctionedAmount && (
                <p className="text-green-600 text-xs mt-1">
                  Sanctioned Amount: ₹{application.sanctionedAmount.toLocaleString("en-IN")} 
                  at {application.sanctionedRate}% p.a. for {application.sanctionedTenure} months
                </p>
              )}
            </div>
          )}

          {application.status === "CONDITIONALLY_APPROVED" && (
            <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-3">
              <p className="text-teal-700 font-medium text-sm">
                ✓ Conditionally Approved
              </p>
              {application.conditionsForApproval && (
                <p className="text-teal-600 text-xs mt-1">
                  Conditions: {application.conditionsForApproval}
                </p>
              )}
            </div>
          )}

          {application.status === "REJECTED" && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 font-medium text-sm">Application Rejected</p>
              {application.rejectionReason && (
                <p className="text-red-600 text-xs mt-1">
                  Reason: {application.rejectionReason}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Loan Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            ["Loan Type",    application.loanType.replace(/_/g, " ")],
            ["Amount",       `₹${application.loanAmount.toLocaleString("en-IN")}`],
            ["Tenure",       `${application.tenureMonths} months`],
            ["Lender",       `${application.lender.name} (${application.lender.referenceId})`],
            ["Applied On",   format(new Date(application.createdAt), "dd MMM yyyy")],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-medium text-slate-900">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Uploaded Documents ({application.documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {application.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-slate-600">
                {doc.type.replace(/_/g, " ")}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  doc.status === "VERIFIED"
                    ? "bg-green-100 text-green-700"
                    : doc.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {doc.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Grievance */}
      {application.lender.grievanceEmail && (
        <p className="text-xs text-slate-400 text-center">
          Questions? Contact lender grievance officer:{" "}
          <a
            href={`mailto:${application.lender.grievanceEmail}`}
            className="underline"
          >
            {application.lender.grievanceEmail}
          </a>
        </p>
      )}
    </div>
  );
}