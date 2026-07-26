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

const ALL_LOAN_TYPES = [
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "MSME_BUSINESS", label: "MSME / Business Loan" },
  { value: "HOME", label: "Home Loan" },
  { value: "VEHICLE", label: "Vehicle Loan" },
];

export default function CreateLenderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [selectedLoanTypes, setSelectedLoanTypes] = useState<string[]>(["PERSONAL"]);
  const [minAmount, setMinAmount] = useState("50000");
  const [maxAmount, setMaxAmount] = useState("5000000");
  const [minTenureMonths, setMinTenureMonths] = useState("12");
  const [maxTenureMonths, setMaxTenureMonths] = useState("60");
  const [interestRateMin, setInterestRateMin] = useState("10.5");
  const [interestRateMax, setInterestRateMax] = useState("18.0");
  const [isPanIndia, setIsPanIndia] = useState(true);
  const [regions, setRegions] = useState("");

  const toggleLoanType = (type: string) => {
    if (selectedLoanTypes.includes(type)) {
      if (selectedLoanTypes.length > 1) {
        setSelectedLoanTypes(selectedLoanTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedLoanTypes([...selectedLoanTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/lenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortCode,
          referenceId,
          loanTypes: selectedLoanTypes,
          minAmount: Number(minAmount),
          maxAmount: Number(maxAmount),
          minTenureMonths: Number(minTenureMonths),
          maxTenureMonths: Number(maxTenureMonths),
          interestRateMin: Number(interestRateMin),
          interestRateMax: Number(interestRateMax),
          isPanIndia,
          regions: isPanIndia ? [] : regions.split(",").map((r) => r.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create lender");
        return;
      }

      setOpen(false);
      setName("");
      setShortCode("");
      setReferenceId("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Lender</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lending Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label>Lender Name</Label>
            <Input
              required
              placeholder="e.g. HDFC Bank"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Short Code</Label>
              <Input
                required
                placeholder="HDFC"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-1">
              <Label>Reference ID</Label>
              <Input
                required
                placeholder="LND-001"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Loan Types Offered</Label>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {ALL_LOAN_TYPES.map((type) => {
                const active = selectedLoanTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleLoanType(type.value)}
                    className={`text-xs px-2.5 py-1.5 rounded border text-left font-medium transition-colors ${
                      active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Min Amount (₹)</Label>
              <Input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Max Amount (₹)</Label>
              <Input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Min Tenure (Months)</Label>
              <Input
                type="number"
                value={minTenureMonths}
                onChange={(e) => setMinTenureMonths(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Max Tenure (Months)</Label>
              <Input
                type="number"
                value={maxTenureMonths}
                onChange={(e) => setMaxTenureMonths(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Interest Rate Min (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={interestRateMin}
                onChange={(e) => setInterestRateMin(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Interest Rate Max (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={interestRateMax}
                onChange={(e) => setInterestRateMax(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPanIndia"
                checked={isPanIndia}
                onChange={(e) => setIsPanIndia(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="isPanIndia" className="text-xs font-medium text-slate-700">
                Pan-India Service Coverage
              </label>
            </div>
            {!isPanIndia && (
              <Input
                placeholder="Specific regions (comma separated, e.g. North, West)"
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
              />
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating..." : "Save Lender"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
