"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { REQUIRED_DOCUMENTS } from "@loan-crm/shared";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";
import type { LoanType, DocumentType } from "@loan-crm/shared";

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  formData: Partial<ApplicationFormData>;
}

// Human-readable labels for each document type
const DOC_LABELS: Record<DocumentType, string> = {
  PAN_CARD: "PAN Card",
  AADHAAR_FRONT: "Aadhaar Card (Front)",
  AADHAAR_BACK: "Aadhaar Card (Back)",
  BANK_STATEMENT_3M: "Bank Statement (Last 3 months)",
  BANK_STATEMENT_6M: "Bank Statement (Last 6 months)",
  ITR_1_YEAR: "Income Tax Return (Last 1 year)",
  ITR_2_YEAR: "Income Tax Return (Last 2 years)",
  SALARY_SLIP_1M: "Salary Slip (Last 1 month)",
  SALARY_SLIP_3M: "Salary Slip (Last 3 months)",
  BUSINESS_PROOF: "Business Registration Proof",
  GST_RETURNS: "GST Returns (Last 6 months)",
  PROPERTY_DOCUMENT: "Property Documents",
  VEHICLE_QUOTATION: "Vehicle Quotation / Pro-forma Invoice",
  PHOTO: "Recent Passport-size Photo",
  SIGNATURE: "Signature (on white paper)",
  OTHER: "Other Document",
};

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface FileState {
  file: File;
  status: UploadStatus;
  r2Key?: string;
  error?: string;
}

export default function Step4Documents({ onNext, onBack, formData }: Props) {
  const loanType = (formData.loanType ?? "PERSONAL") as LoanType;
  const required = REQUIRED_DOCUMENTS[loanType];

  const [files, setFiles] = useState<Partial<Record<DocumentType, FileState>>>(
    {},
  );
  const [globalError, setGlobalError] = useState("");

  const handleFileChange = async (
    docType: DocumentType,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set uploading state immediately
    setFiles((prev) => ({
      ...prev,
      [docType]: { file, status: "uploading" },
    }));

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("documentType", docType);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        setFiles((prev) => ({
          ...prev,
          [docType]: { file, status: "error", error: data.error },
        }));
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [docType]: { file, status: "done", r2Key: data.r2Key },
      }));
    } catch {
      setFiles((prev) => ({
        ...prev,
        [docType]: { file, status: "error", error: "Upload failed" },
      }));
    }
  };

  const handleNext = () => {
    // Check all required docs are uploaded
    const missing = required.filter((doc) => files[doc]?.status !== "done");

    if (missing.length > 0) {
      setGlobalError(
        `Please upload: ${missing.map((d) => DOC_LABELS[d]).join(", ")}`,
      );
      return;
    }

    setGlobalError("");

    // Build documents map to pass forward
    const documents: Record<string, File> = {};
    for (const doc of required) {
      const f = files[doc];
      if (f?.file) documents[doc] = f.file;
    }

    onNext({ documents });
  };

  const allDone = required.every((doc) => files[doc]?.status === "done");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">
          Upload clear scans or photos. Max 5MB per file. PDF, JPG, PNG
          accepted.
        </p>

        <div className="space-y-3">
          {required.map((docType) => {
            const state = files[docType];

            return (
              <div
                key={docType}
                className={`border rounded-lg p-3 transition-colors ${
                  state?.status === "done"
                    ? "border-green-200 bg-green-50"
                    : state?.status === "error"
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Label className="text-sm font-medium text-slate-700">
                      {DOC_LABELS[docType]}
                    </Label>
                    {state?.status === "done" && (
                      <p className="text-xs text-green-600 mt-0.5 truncate">
                        ✓ {state.file.name}
                      </p>
                    )}
                    {state?.status === "error" && (
                      <p className="text-xs text-red-500 mt-0.5">
                        ✗ {state.error}
                      </p>
                    )}
                    {state?.status === "uploading" && (
                      <p className="text-xs text-blue-500 mt-0.5">
                        Uploading...
                      </p>
                    )}
                  </div>

                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileChange(docType, e)}
                      disabled={state?.status === "uploading"}
                    />
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        state?.status === "done"
                          ? "border-green-300 text-green-700 hover:bg-green-100"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {state?.status === "uploading"
                        ? "Uploading..."
                        : state?.status === "done"
                          ? "Replace"
                          : "Upload"}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="text-xs text-slate-500 text-right">
          {required.filter((d) => files[d]?.status === "done").length} of{" "}
          {required.length} documents uploaded
        </div>

        {globalError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {globalError}
          </p>
        )}

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
            disabled={!allDone}
          >
            Next — Review →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
