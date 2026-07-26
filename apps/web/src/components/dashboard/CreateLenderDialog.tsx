"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDIAN_STATES } from "@loan-crm/shared";

const LOAN_TYPES = [
  { value: "PERSONAL", label: "Personal" },
  { value: "MSME_BUSINESS", label: "MSME / Business" },
  { value: "HOME", label: "Home" },
  { value: "VEHICLE", label: "Vehicle" },
];

export default function CreateLenderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loanTypes, setLoanTypes] = useState<string[]>([]);
  const [isPanIndia, setIsPanIndia] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minTenure, setMinTenure] = useState("");
  const [maxTenure, setMaxTenure] = useState("");
  const [rateMin, setRateMin] = useState("");
  const [rateMax, setRateMax] = useState("");
  const [grievanceEmail, setGrievanceEmail] = useState("");

  const toggleLoanType = (type: string) => {
    setLoanTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleRegion = (code: string) => {
    setRegions((prev) =>
      prev.includes(code) ? prev.filter((r) => r !== code) : [...prev, code],
    );
  };

  const reset = () => {
    setName("");
    setShortCode("");
    setLoanTypes([]);
    setIsPanIndia(false);
    setRegions([]);
    setMinAmount("");
    setMaxAmount("");
    setMinTenure("");
    setMaxTenure("");
    setRateMin("");
    setRateMax("");
    setGrievanceEmail("");
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortCode: shortCode.toUpperCase(),
          loanTypes,
          regions: isPanIndia ? [] : regions,
          isPanIndia,
          minAmount: Number(minAmount),
          maxAmount: Number(maxAmount),
          minTenureMonths: Number(minTenure),
          maxTenureMonths: Number(maxTenure),
          interestRateMin: Number(rateMin),
          interestRateMax: Number(rateMax),
          grievanceEmail: grievanceEmail || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Failed to create lender");
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    name.length >= 3 &&
    shortCode.length >= 2 &&
    loanTypes.length > 0 &&
    (isPanIndia || regions.length > 0) &&
    minAmount &&
    maxAmount &&
    minTenure &&
    maxTenure &&
    rateMin &&
    rateMax;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>+ Add Lender</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lender (NBFC)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Lender Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bajaj Finance NBFC"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Short Code</Label>
              <Input
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                placeholder="BAJAJ-FIN"
                className="uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Loan Types Offered</Label>
            <div className="flex flex-wrap gap-2">
              {LOAN_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleLoanType(t.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    loanTypes.includes(t.value)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPanIndia}
                onChange={(e) => setIsPanIndia(e.target.checked)}
              />
              Operates Pan-India
            </label>
          </div>

          {!isPanIndia && (
            <div className="space-y-1.5">
              <Label>Operating Regions</Label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto border border-slate-100 rounded-md p-2">
                {Object.entries(INDIAN_STATES).map(([code, stateName]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleRegion(code)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      regions.includes(code)
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200"
                    }`}
                    title={stateName}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Min Amount (₹)</Label>
              <Input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Amount (₹)</Label>
              <Input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="2500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Min Tenure (months)</Label>
              <Input
                type="number"
                value={minTenure}
                onChange={(e) => setMinTenure(e.target.value)}
                placeholder="12"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Tenure (months)</Label>
              <Input
                type="number"
                value={maxTenure}
                onChange={(e) => setMaxTenure(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Min Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={rateMin}
                onChange={(e) => setRateMin(e.target.value)}
                placeholder="11.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={rateMax}
                onChange={(e) => setRateMax(e.target.value)}
                placeholder="18.0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Grievance Email (optional)</Label>
            <Input
              type="email"
              value={grievanceEmail}
              onChange={(e) => setGrievanceEmail(e.target.value)}
              placeholder="grievance@lender.in"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? "Creating..." : "Create Lender"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
