"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

const schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Select a business type"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid GST number",
    )
    .optional()
    .or(z.literal("")),
  businessVintage: z
    .number({ invalid_type_error: "Enter years in business" })
    .min(0)
    .max(100),
  annualTurnover: z
    .number({ invalid_type_error: "Enter annual turnover" })
    .min(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  defaultValues: Partial<ApplicationFormData>;
}

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership Firm",
  "Private Limited Company",
  "Public Limited Company",
  "Limited Liability Partnership (LLP)",
  "One Person Company (OPC)",
  "Hindu Undivided Family (HUF)",
  "Trust / NGO",
  "Other",
];

export default function Step3Business({
  onNext,
  onBack,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: defaultValues.businessName ?? "",
      businessType: defaultValues.businessType ?? "",
      gstNumber: defaultValues.gstNumber ?? "",
      businessVintage: defaultValues.businessVintage ?? 0,
      annualTurnover: defaultValues.annualTurnover ?? 0,
    },
  });

  const onSubmit = (data: FormData) => onNext(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Business / Company Name</Label>
            <Input
              id="businessName"
              placeholder="Acme Traders Pvt Ltd"
              {...register("businessName")}
            />
            {errors.businessName && (
              <p className="text-xs text-red-500">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Business Type */}
          <div className="space-y-1.5">
            <Label>Business Type</Label>
            <Select
              defaultValue={defaultValues.businessType}
              onValueChange={(v) => setValue("businessType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-xs text-red-500">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* GST Number */}
          <div className="space-y-1.5">
            <Label htmlFor="gstNumber">
              GST Number{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="gstNumber"
              placeholder="27AAPFU0939F1ZV"
              maxLength={15}
              className="uppercase"
              {...register("gstNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
            {errors.gstNumber && (
              <p className="text-xs text-red-500">{errors.gstNumber.message}</p>
            )}
          </div>

          {/* Vintage + Turnover */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="businessVintage">Years in Business</Label>
              <Input
                id="businessVintage"
                type="number"
                placeholder="5"
                {...register("businessVintage", { valueAsNumber: true })}
              />
              {errors.businessVintage && (
                <p className="text-xs text-red-500">
                  {errors.businessVintage.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="annualTurnover">Annual Turnover (₹)</Label>
              <Input
                id="annualTurnover"
                type="number"
                placeholder="2500000"
                {...register("annualTurnover", { valueAsNumber: true })}
              />
              {errors.annualTurnover && (
                <p className="text-xs text-red-500">
                  {errors.annualTurnover.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 Businesses with 2+ years vintage and GST registration have
              higher approval rates. ITR for the last 2 years will be required
              in the next step.
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
            <Button type="submit" className="flex-1">
              Next — Documents →
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
