"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

const DOC_LABELS: Record<string, string> = {
  PAN_CARD: "PAN Card",
  AADHAAR_FRONT: "Aadhaar (Front)",
  AADHAAR_BACK: "Aadhaar (Back)",
  BANK_STATEMENT_3M: "Bank Statement 3M",
  BANK_STATEMENT_6M: "Bank Statement 6M",
  ITR_1_YEAR: "ITR 1 Year",
  ITR_2_YEAR: "ITR 2 Years",
  SALARY_SLIP_1M: "Salary Slip 1M",
  SALARY_SLIP_3M: "Salary Slip 3M",
  BUSINESS_PROOF: "Business Proof",
  GST_RETURNS: "GST Returns",
  PROPERTY_DOCUMENT: "Property Document",
  VEHICLE_QUOTATION: "Vehicle Quotation",
  PHOTO: "Photo",
  SIGNATURE: "Signature",
  OTHER: "Other",
};

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

export default function Step5Review({ onBack, formData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Submit application metadata
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          employmentType: formData.employmentType,
          pan: formData.pan,
          aadhaarLast4: formData.aadhaarLast4,
          loanType: formData.loanType,
          loanAmount: formData.loanAmount,
          tenure: formData.tenure,
          purpose: formData.purpose,
          monthlyIncome: formData.monthlyIncome,
          existingEmiObligations: formData.existingEmiObligations,
          businessName: formData.businessName,
          businessType: formData.businessType,
          gstNumber: formData.gstNumber,
          businessVintage: formData.businessVintage,
          annualTurnover: formData.annualTurnover,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Submission failed");
        return;
      }

      // 2. Upload documents one by one
      if (formData.documents) {
        for (const [docType, file] of Object.entries(formData.documents)) {
          const fd = new FormData();
          fd.append("file", file as File);
          fd.append("docType", docType);

          await fetch(`/api/applications/${result.applicationId}/documents`, {
            method: "POST",
            body: fd,
          });
        }
      }

      // 3. Redirect to application status page
      router.push(`/apply/${result.applicationId}?submitted=true`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const docCount = Object.keys(formData.documents ?? {}).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review Your Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Details */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Personal Details
            </p>
            <Row label="Full Name" value={formData.name} />
            <Row label="Date of Birth" value={formData.dob} />
            <Row label="Gender" value={formData.gender} />
            <Row
              label="Address"
              value={`${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`}
            />
            <Row
              label="Employment"
              value={formData.employmentType.replace(/_/g, " ")}
            />
            <Row label="PAN" value={`${formData.pan.slice(0, 3)}XXXXXXX`} />
            <Row
              label="Aadhaar Last 4"
              value={`XXXX XXXX ${formData.aadhaarLast4}`}
            />
          </div>

          <Separator />

          {/* Loan Details */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Loan Details
            </p>
            <Row
              label="Loan Type"
              value={LOAN_TYPE_LABELS[formData.loanType]}
            />
            <Row
              label="Amount"
              value={`₹${formData.loanAmount.toLocaleString("en-IN")}`}
            />
            <Row label="Tenure" value={`${formData.tenure} months`} />
            <Row
              label="Monthly Income"
              value={`₹${formData.monthlyIncome.toLocaleString("en-IN")}`}
            />
            <Row
              label="Existing EMIs"
              value={`₹${formData.existingEmiObligations.toLocaleString("en-IN")}`}
            />
            <Row label="Purpose" value={formData.purpose} />
          </div>

          {/* Business Details (MSME only) */}
          {formData.loanType === "MSME_BUSINESS" && formData.businessName && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Business Details
                </p>
                <Row label="Business Name" value={formData.businessName} />
                <Row
                  label="Business Type"
                  value={formData.businessType ?? "—"}
                />
                <Row
                  label="GST Number"
                  value={formData.gstNumber ?? "Not provided"}
                />
                <Row
                  label="Years in Business"
                  value={`${formData.businessVintage ?? 0} years`}
                />
                <Row
                  label="Annual Turnover"
                  value={`₹${(formData.annualTurnover ?? 0).toLocaleString("en-IN")}`}
                />
              </div>
            </>
          )}

          <Separator />

          {/* Documents */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Documents ({docCount} files ready to upload)
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(formData.documents ?? {}).map((docType) => (
                <span
                  key={docType}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                >
                  ✓ {DOC_LABELS[docType] ?? docType}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card className="border-slate-200">
        <CardContent className="pt-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            By submitting this application, I declare that all information
            provided is true and correct. I authorise Sareen Powerz and its lending
            partners to verify my details, pull my credit report, and contact me
            regarding this application. I have read and agree to the{" "}
            <span className="underline">Terms & Conditions</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
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
    </div>
  );
}
