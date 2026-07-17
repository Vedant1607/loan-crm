"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

const schema = z.object({
  loanType: z.enum(["PERSONAL", "MSME_BUSINESS", "HOME", "VEHICLE"]),
  loanAmount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(10000, "Minimum loan amount is ₹10,000")
    .max(10000000, "Maximum loan amount is ₹1 Crore"),
  tenure: z
    .number({ invalid_type_error: "Enter a valid tenure" })
    .min(3, "Minimum tenure is 3 months")
    .max(360, "Maximum tenure is 360 months"),
  purpose: z
    .string()
    .min(10, "Please describe the purpose in at least 10 characters"),
  monthlyIncome: z
    .number({ invalid_type_error: "Enter a valid income" })
    .min(5000, "Minimum monthly income is ₹5,000"),
  existingEmiObligations: z
    .number({ invalid_type_error: "Enter 0 if none" })
    .min(0)
    .default(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  defaultValues: Partial<ApplicationFormData>;
}

// Rough EMI preview for the user
function calcEmi(amount: number, months: number, rate = 14): number {
  const r = rate / 100 / 12;
  return Math.round(
    (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1),
  );
}

const LOAN_TYPE_OPTIONS = [
  { value: "PERSONAL", label: "Personal Loan", max: 1500000 },
  { value: "MSME_BUSINESS", label: "MSME / Business Loan", max: 5000000 },
  { value: "HOME", label: "Home Loan", max: 10000000 },
  { value: "VEHICLE", label: "Vehicle Loan", max: 2500000 },
];

export default function Step2LoanDetails({
  onNext,
  onBack,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      loanAmount: defaultValues.loanAmount ?? 0,
      tenure: defaultValues.tenure ?? 12,
      existingEmiObligations: defaultValues.existingEmiObligations ?? 0,
      loanType: defaultValues.loanType as FormData["loanType"],
      purpose: defaultValues.purpose,
      monthlyIncome: defaultValues.monthlyIncome,
    },
  });

  const onSubmit = (data: FormData) => onNext(data);

  const loanAmount = watch("loanAmount") || 0;
  const tenure = watch("tenure") || 12;
  const income = watch("monthlyIncome") || 0;
  const existingEmis = watch("existingEmiObligations") || 0;
  const emiPreview =
    loanAmount > 0 && tenure > 0 ? calcEmi(loanAmount, tenure) : 0;
  const foir =
    income > 0
      ? (((emiPreview + existingEmis) / income) * 100).toFixed(1)
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Loan Type */}
          <div className="space-y-1.5">
            <Label>Loan Type</Label>
            <Select
              defaultValue={defaultValues.loanType}
              onValueChange={(v: string) =>
                setValue("loanType", v as FormData["loanType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {LOAN_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.loanType && (
              <p className="text-xs text-red-500">{errors.loanType.message}</p>
            )}
          </div>

          {/* Loan Amount + Tenure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="500000"
                {...register("loanAmount", { valueAsNumber: true })}
              />
              {errors.loanAmount && (
                <p className="text-xs text-red-500">
                  {errors.loanAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tenure">Tenure (months)</Label>
              <Input
                id="tenure"
                type="number"
                placeholder="36"
                {...register("tenure", { valueAsNumber: true })}
              />
              {errors.tenure && (
                <p className="text-xs text-red-500">{errors.tenure.message}</p>
              )}
            </div>
          </div>

          {/* Income + Existing EMIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="75000"
                {...register("monthlyIncome", { valueAsNumber: true })}
              />
              {errors.monthlyIncome && (
                <p className="text-xs text-red-500">
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="existingEmiObligations">
                Existing EMI Obligations (₹)
              </Label>
              <Input
                id="existingEmiObligations"
                type="number"
                placeholder="0"
                {...register("existingEmiObligations", { valueAsNumber: true })}
              />
              {errors.existingEmiObligations && (
                <p className="text-xs text-red-500">
                  {errors.existingEmiObligations.message}
                </p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <Label htmlFor="purpose">Purpose of Loan</Label>
            <Textarea
              id="purpose"
              placeholder="Describe why you need this loan..."
              rows={3}
              {...register("purpose")}
            />
            {errors.purpose && (
              <p className="text-xs text-red-500">{errors.purpose.message}</p>
            )}
          </div>

          {/* Live EMI Preview */}
          {emiPreview > 0 && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Estimated Summary
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Monthly EMI</p>
                  <p className="font-bold text-slate-900">
                    ₹{emiPreview.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Total Payable</p>
                  <p className="font-bold text-slate-900">
                    ₹{(emiPreview * tenure).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">FOIR</p>
                  <p
                    className={`font-bold ${
                      foir && parseFloat(foir) > 50
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {foir ? `${foir}%` : "—"}
                  </p>
                </div>
              </div>
              {foir && parseFloat(foir) > 50 && (
                <p className="text-xs text-red-500">
                  ⚠ FOIR above 50% may reduce approval chances. Consider a lower
                  amount or longer tenure.
                </p>
              )}
              <p className="text-xs text-slate-400">
                * EMI calculated at indicative 14% p.a. Actual rate set by
                lender.
              </p>
            </div>
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
            <Button type="submit" className="flex-1">
              Next —{" "}
              {watch("loanType") === "MSME_BUSINESS"
                ? "Business Info"
                : "Documents"}{" "}
              →
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
