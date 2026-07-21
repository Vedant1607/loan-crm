"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INDIAN_STATES } from "@loan-crm/shared";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

interface Props {
  onBack: () => void;
  formData: ApplicationFormData;
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Personal Loan",
  MSME_BUSINESS: "MSME / Business Loan",
  HOME: "Home Loan",
  VEHICLE: "Vehicle Loan",
};

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right max-w-xs">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Step5Review({ onBack, formData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Build document keys + meta from the files stored in formData
      const documentKeys: Record<string, string> = {};
      const documentMeta: Record<
        string,
        {
          fileName: string;
          fileSize: number;
          mimeType: string;
        }
      > = {};

      // Documents were uploaded in Step 4 — we re-upload here
      // to get fresh r2Keys tied to the real applicationId after creation
      for (const [docType, file] of Object.entries(formData.documents ?? {})) {
        const fd = new FormData();
        fd.append("file", file as File);
        fd.append("documentType", docType);

        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(`Failed to upload ${docType}: ${data.error}`);
          setLoading(false);
          return;
        }

        documentKeys[docType] = data.r2Key;
        documentMeta[docType] = {
          fileName: (file as File).name,
          fileSize: (file as File).size,
          mimeType: (file as File).type,
        };
      }

      // Submit the application
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pan: formData.pan,
          tenure: formData.tenure,
          documentKeys,
          documentMeta,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        setLoading(false);
        return;
      }

      // Success — redirect to the application status page
      router.push(`/apply/${data.id}?submitted=true`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Review & Submit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-slate-500">
          Please review all details before submitting. You cannot edit after
          submission.
        </p>

        {/* Personal Details */}
        <Section title="Personal Details">
          <ReviewRow label="Full Name" value={formData.name} />
          <ReviewRow label="Date of Birth" value={formData.dob} />
          <ReviewRow label="Gender" value={formData.gender} />
          <ReviewRow label="Address" value={formData.address} />
          <ReviewRow label="City" value={formData.city} />
          <ReviewRow
            label="State"
            value={INDIAN_STATES[formData.state] ?? formData.state}
          />
          <ReviewRow label="Pincode" value={formData.pincode} />
          <ReviewRow label="Employment Type" value={formData.employmentType} />
          <ReviewRow label="PAN" value={`${formData.pan.slice(0, 3)}XXXXXXX`} />
          <ReviewRow
            label="Aadhaar (Last 4)"
            value={`XXXX XXXX ${formData.aadhaarLast4}`}
          />
        </Section>

        {/* Loan Details */}
        <Section title="Loan Details">
          <ReviewRow
            label="Loan Type"
            value={LOAN_TYPE_LABELS[formData.loanType]}
          />
          <ReviewRow
            label="Loan Amount"
            value={`₹${Number(formData.loanAmount).toLocaleString("en-IN")}`}
          />
          <ReviewRow label="Tenure" value={`${formData.tenure} months`} />
          <ReviewRow label="Purpose" value={formData.purpose} />
          <ReviewRow
            label="Monthly Income"
            value={`₹${Number(formData.monthlyIncome).toLocaleString("en-IN")}`}
          />
          <ReviewRow
            label="Existing EMI Obligations"
            value={`₹${Number(formData.existingEmiObligations).toLocaleString("en-IN")}`}
          />
        </Section>

        {/* Business Details (MSME only) */}
        {formData.loanType === "MSME_BUSINESS" && (
          <Section title="Business Details">
            <ReviewRow label="Business Name" value={formData.businessName} />
            <ReviewRow label="Business Type" value={formData.businessType} />
            <ReviewRow label="GST Number" value={formData.gstNumber} />
            <ReviewRow
              label="Years in Business"
              value={formData.businessVintage}
            />
            <ReviewRow
              label="Annual Turnover"
              value={
                formData.annualTurnover
                  ? `₹${Number(formData.annualTurnover).toLocaleString("en-IN")}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* Documents */}
        <Section title="Documents">
          {Object.keys(formData.documents ?? {}).map((docType) => (
            <div
              key={docType}
              className="flex justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-slate-500">
                {docType.replace(/_/g, " ")}
              </span>
              <span className="text-sm text-green-600 font-medium">
                ✓ Uploaded
              </span>
            </div>
          ))}
        </Section>

        {/* Declaration */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            By submitting this application, I declare that all information
            provided is true and accurate to the best of my knowledge. I
            authorise the lender to verify my details with credit bureaus,
            government databases, and financial institutions as required under
            RBI guidelines. I have read and agree to the Fair Practices Code.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={loading}
          >
            ← Back
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application →"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
