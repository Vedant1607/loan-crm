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
import { INDIAN_STATES } from "@loan-crm/shared";
import type { ApplicationFormData } from "@/app/(applicant)/apply/new/page";

const schema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(10, "Enter your full address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  employmentType: z.enum([
    "SALARIED",
    "SELF_EMPLOYED",
    "BUSINESS_OWNER",
    "PROFESSIONAL",
    "AGRICULTURIST",
    "RETIRED",
    "OTHER",
  ]),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN (e.g. ABCDE1234F)"),
  aadhaarLast4: z.string().regex(/^\d{4}$/, "Enter last 4 digits of Aadhaar"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onNext: (data: Partial<ApplicationFormData>) => void;
  defaultValues: Partial<ApplicationFormData>;
}

export default function Step1Personal({ onNext, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as Partial<FormData>,
  });

  const onSubmit = (data: FormData) => onNext(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Personal Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name (as per PAN)</Label>
            <Input id="name" placeholder="Rajesh Kumar" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* DOB + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...register("dob")} />
              {errors.dob && (
                <p className="text-xs text-red-500">{errors.dob.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                defaultValue={defaultValues.gender}
                onValueChange={(v) =>
                  setValue("gender", v as FormData["gender"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Flat No, Street, Area"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City + State + Pincode */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Mumbai" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Select
                defaultValue={defaultValues.state}
                onValueChange={(v) => setValue("state", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INDIAN_STATES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="400001"
                maxLength={6}
                {...register("pincode")}
              />
              {errors.pincode && (
                <p className="text-xs text-red-500">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          {/* Employment Type */}
          <div className="space-y-1.5">
            <Label>Employment Type</Label>
            <Select
              defaultValue={defaultValues.employmentType}
              onValueChange={(v) =>
                setValue("employmentType", v as FormData["employmentType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SALARIED">Salaried</SelectItem>
                <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
                <SelectItem value="PROFESSIONAL">
                  Professional (CA, Doctor, etc.)
                </SelectItem>
                <SelectItem value="AGRICULTURIST">Agriculturist</SelectItem>
                <SelectItem value="RETIRED">Retired</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentType && (
              <p className="text-xs text-red-500">
                {errors.employmentType.message}
              </p>
            )}
          </div>

          {/* PAN + Aadhaar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                maxLength={10}
                className="uppercase"
                {...register("pan", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  },
                })}
              />
              {errors.pan && (
                <p className="text-xs text-red-500">{errors.pan.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="aadhaarLast4">Aadhaar (Last 4 digits)</Label>
              <Input
                id="aadhaarLast4"
                placeholder="XXXX"
                maxLength={4}
                inputMode="numeric"
                {...register("aadhaarLast4")}
              />
              {errors.aadhaarLast4 && (
                <p className="text-xs text-red-500">
                  {errors.aadhaarLast4.message}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            🔒 Your PAN and Aadhaar are encrypted and stored securely per RBI
            guidelines. We only store the last 4 digits of your Aadhaar.
          </p>

          <Button type="submit" className="w-full">
            Next — Loan Details →
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
