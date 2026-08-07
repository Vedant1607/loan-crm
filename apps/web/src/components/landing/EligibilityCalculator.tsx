"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EligibilityCalculatorProps {
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  minTenure: number; // months
  maxTenure: number; // months
  defaultTenure: number; // months
  minRate: number;
  maxRate: number;
  defaultRate: number;
}

function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return { emi, totalPayable: emi * tenureMonths, totalInterest: 0 };
  }
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;
  return { emi, totalPayable, totalInterest };
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatTenure(months: number) {
  if (months % 12 === 0) return `${months / 12} yr${months / 12 > 1 ? "s" : ""}`;
  return `${months} mo`;
}

export default function EligibilityCalculator({
  minAmount,
  maxAmount,
  defaultAmount,
  minTenure,
  maxTenure,
  defaultTenure,
  minRate,
  maxRate,
  defaultRate,
}: EligibilityCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [tenure, setTenure] = useState(defaultTenure);
  const [rate, setRate]     = useState(defaultRate);

  const result = useMemo(() => calculateEmi(amount, rate, tenure), [amount, rate, tenure]);

  return (
    <section className="bg-brand-navy py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            Estimate Your EMI
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white font-semibold leading-tight">
            See what your monthly payment could look like
          </h2>
          <p className="text-white/60 text-sm mt-3">
            This is an indicative estimate. Your actual rate and eligible amount depend on the lending partner and your profile.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 bg-white rounded-2xl p-7 md:p-9">
          <div className="md:col-span-3 space-y-7">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-medium text-brand-navy">Loan Amount</label>
                <span className="font-mono-data text-sm font-semibold text-brand-navy">
                  {formatCurrency(amount)}
                </span>
              </div>
              <input
                type="range"
                min={minAmount}
                max={maxAmount}
                step={Math.max(1000, Math.round((maxAmount - minAmount) / 100))}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="brand-range w-full"
              />
              <div className="flex justify-between text-xs text-brand-slate mt-1">
                <span>{formatCurrency(minAmount)}</span>
                <span>{formatCurrency(maxAmount)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-medium text-brand-navy">Tenure</label>
                <span className="font-mono-data text-sm font-semibold text-brand-navy">
                  {formatTenure(tenure)}
                </span>
              </div>
              <input
                type="range"
                min={minTenure}
                max={maxTenure}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="brand-range w-full"
              />
              <div className="flex justify-between text-xs text-brand-slate mt-1">
                <span>{formatTenure(minTenure)}</span>
                <span>{formatTenure(maxTenure)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-medium text-brand-navy">Interest Rate (indicative)</label>
                <span className="font-mono-data text-sm font-semibold text-brand-navy">
                  {rate.toFixed(1)}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={minRate}
                max={maxRate}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="brand-range w-full"
              />
              <div className="flex justify-between text-xs text-brand-slate mt-1">
                <span>{minRate.toFixed(1)}%</span>
                <span>{maxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-brand-cream rounded-xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-slate mb-1">
                Estimated Monthly EMI
              </p>
              <p className="font-mono-data text-3xl font-semibold text-brand-navy">
                {formatCurrency(result.emi)}
              </p>

              <div className="mt-6 space-y-2.5 pt-5 border-t border-brand-navy/10">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-slate">Total Interest</span>
                  <span className="font-mono-data font-medium text-brand-navy">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-slate">Total Payable</span>
                  <span className="font-mono-data font-medium text-brand-navy">
                    {formatCurrency(result.totalPayable)}
                  </span>
                </div>
              </div>
            </div>

            <Button asChild className="w-full mt-6 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold">
              <Link href="/login">Apply for This Loan</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}