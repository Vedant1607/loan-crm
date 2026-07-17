"use client";

import { useState } from "react";
import Step1Personal from "@/components/forms/LoanApplicationForm/Step1Personal";
import Step2LoanDetails from "@/components/forms/LoanApplicationForm/Step2LoanDetails";
import Step3Business from "@/components/forms/LoanApplicationForm/Step3Business";
import Step4Documents from "@/components/forms/LoanApplicationForm/Step4Documents";
import Step5Review from "@/components/forms/LoanApplicationForm/Step5Review";

export type ApplicationFormData = {
  // Step 1
  name: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  employmentType: string;
  pan: string;
  aadhaarLast4: string;
  // Step 2
  loanType: string;
  loanAmount: number;
  tenure: number;
  purpose: string;
  monthlyIncome: number;
  existingEmiObligations: number;
  // Step 3 (MSME only)
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  businessVintage?: number;
  annualTurnover?: number;
  // Step 4
  documents: Record<string, File>;
};

const STEPS = [
  "Personal Details",
  "Loan Details",
  "Business Info",
  "Documents",
  "Review",
];

export default function NewApplicationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({});

  const next = (data: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((s) => s + 1);
  };

  const back = () => setCurrentStep((s) => s - 1);

  // Skip Step 3 if loan type is not MSME
  const shouldShowBusiness = formData.loanType === "MSME_BUSINESS";

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <Step1Personal onNext={next} defaultValues={formData} />;
      case 1:
        return (
          <Step2LoanDetails
            onNext={next}
            onBack={back}
            defaultValues={formData}
          />
        );
      case 2:
        if (!shouldShowBusiness) {
          // Auto-skip Step 3 for non-MSME
          setCurrentStep(3);
          return null;
        }
        return (
          <Step3Business onNext={next} onBack={back} defaultValues={formData} />
        );
      case 3:
        return (
          <Step4Documents onNext={next} onBack={back} formData={formData} />
        );
      case 4:
        return (
          <Step5Review
            onBack={back}
            formData={formData as ApplicationFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          New Loan Application
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Complete all steps to submit your application
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-2 flex-1 last:flex-none"
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < currentStep
                    ? "bg-slate-900 text-white"
                    : i === currentStep
                      ? "bg-slate-900 text-white ring-4 ring-slate-200"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i === currentStep ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 transition-colors ${
                  i < currentStep ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {getStepComponent()}
    </div>
  );
}
