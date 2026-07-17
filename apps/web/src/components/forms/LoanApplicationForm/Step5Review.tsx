"use client";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

interface Props {
  onBack: () => void;
  formData: ApplicationFormData;
}

export default function Step5LoanDetails({ onBack }: Props) {
  return (
    <div>
      <p className="text-slate-500">Step 5 — coming next</p>
      <button onClick={onBack} className="text-sm underline mt-2">← Back</button>
    </div>
  );
}