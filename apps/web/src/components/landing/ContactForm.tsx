"use client";

import { useState } from "react";
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

const LOAN_TYPE_OPTIONS = [
  { value: "PERSONAL",      label: "Personal Loan" },
  { value: "HOME",          label: "Home Loan" },
  { value: "MSME_BUSINESS", label: "Business Loan" },
  { value: "VEHICLE",       label: "Vehicle Loan" },
];

export default function ContactForm() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [loanType, setLoanType] = useState<string>("");
  const [message, setMessage]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          loanType: loanType || undefined,
          message,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-brand-navy/10 p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-brand-navy font-semibold mb-2">
          Thank you for reaching out
        </h3>
        <p className="text-sm text-brand-slate">
          We've received your inquiry and a member of our team will get in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-navy/10 p-7 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>Loan Type (optional)</Label>
        <Select value={loanType} onValueChange={setLoanType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a loan type" />
          </SelectTrigger>
          <SelectContent>
            {LOAN_TYPE_OPTIONS.map((opt) => {
              return (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about what you're looking for..."
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}