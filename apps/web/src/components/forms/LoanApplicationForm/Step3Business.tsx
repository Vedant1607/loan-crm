"use client";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  defaultValues: Partial<ApplicationFormData>;
}

export default function Step3LoanDetails({ onBack }: Props) {
  return (
    <div>
      <p className="text-slate-500">Step 3 — coming next</p>
      <button onClick={onBack} className="text-sm underline mt-2">
        ← Back
      </button>
    </div>
  );
}
