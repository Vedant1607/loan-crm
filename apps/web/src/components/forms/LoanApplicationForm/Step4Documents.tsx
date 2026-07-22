"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { REQUIRED_DOCUMENTS } from "@loan-crm/shared";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";
import type { DocumentType } from "@loan-crm/shared";

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  formData: Partial<ApplicationFormData>;
}

const DOC_LABELS: Record<DocumentType, string> = {
  PAN_CARD: "PAN Card",
  AADHAAR_FRONT: "Aadhaar Card (Front)",
  AADHAAR_BACK: "Aadhaar Card (Back)",
  BANK_STATEMENT_3M: "Bank Statement (Last 3 Months)",
  BANK_STATEMENT_6M: "Bank Statement (Last 6 Months)",
  ITR_1_YEAR: "ITR — Last 1 Year",
  ITR_2_YEAR: "ITR — Last 2 Years",
  SALARY_SLIP_1M: "Salary Slip (Last 1 Month)",
  SALARY_SLIP_3M: "Salary Slip (Last 3 Months)",
  BUSINESS_PROOF: "Business Registration Proof",
  GST_RETURNS: "GST Returns (Last 2 Quarters)",
  PROPERTY_DOCUMENT: "Property Documents",
  VEHICLE_QUOTATION: "Vehicle Quotation",
  PHOTO: "Passport Size Photo",
  SIGNATURE: "Signature",
  OTHER: "Other Document",
};

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 5;

export default function Step4Documents({ onNext, onBack, formData }: Props) {
  const loanType = formData.loanType as keyof typeof REQUIRED_DOCUMENTS;
  const required = REQUIRED_DOCUMENTS[loanType] ?? [];

  const [files, setFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (
    docType: DocumentType,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [docType]: `File too large. Max size is ${MAX_SIZE_MB}MB.`,
      }));
      return;
    }

    setErrors((prev) => {
      const n = { ...prev };
      delete n[docType];
      return n;
    });
    setFiles((prev) => ({ ...prev, [docType]: file }));
  };

  const handleNext = () => {
    // Check all required docs are uploaded
    const missing = required.filter((doc) => !files[doc]);
    if (missing.length > 0) {
      const newErrors: Record<string, string> = {};
      missing.forEach((doc) => {
        newErrors[doc] = "This document is required";
      });
      setErrors(newErrors);
      return;
    }
    onNext({ documents: files });
  };

  const uploadedCount = required.filter((doc) => files[doc]).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Upload Documents
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({uploadedCount}/{required.length} uploaded)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-slate-900 h-1.5 rounded-full transition-all"
            style={{ width: `${(uploadedCount / required.length) * 100}%` }}
          />
        </div>

        {/* Document Upload Items */}
        <div className="space-y-3">
          {required.map((docType) => {
            const uploaded = files[docType];
            const error = errors[docType];

            return (
              <div
                key={docType}
                className={`border rounded-lg p-3 transition-colors ${
                  uploaded
                    ? "border-green-200 bg-green-50"
                    : error
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">
                      {uploaded ? "✅" : error ? "❌" : "📄"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {DOC_LABELS[docType]}
                      </p>
                      {uploaded ? (
                        <p className="text-xs text-green-600 truncate">
                          {uploaded.name} ({(uploaded.size / 1024).toFixed(0)}{" "}
                          KB)
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">
                          PDF, JPG or PNG · Max {MAX_SIZE_MB}MB
                        </p>
                      )}
                      {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>
                  </div>

                  <label className="cursor-pointer shrink-0">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        uploaded
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-900 text-white hover:bg-slate-700"
                      }`}
                    >
                      {uploaded ? "Replace" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept={ACCEPTED_TYPES}
                      className="hidden"
                      onChange={(e) => handleFileChange(docType, e)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            🔒 All documents are encrypted and stored securely. They are only
            accessible to your assigned loan officer.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            ← Back
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleNext}
            disabled={uploadedCount === 0}
          >
            Next — Review →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
