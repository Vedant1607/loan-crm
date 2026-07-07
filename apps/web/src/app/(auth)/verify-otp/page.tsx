"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("otp_phone");
    if (!stored) {
      router.push("/login");
      return;
    }
    setPhone(stored);
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    // Auto-focus next input
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      phone,
      otp: code,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid or expired OTP. Please try again.");
      setLoading(false);
      return;
    }

    // Redirect based on role — server will handle this via middleware
    sessionStorage.removeItem("otp_phone");
    router.push("/apply");
  };

  const handleResend = async () => {
    setResendTimer(30);
    setError("");
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to +91 {phone}
          {process.env.NODE_ENV === "development" && (
            <span className="block mt-1 text-amber-600 font-medium">
              Dev mode: use 123456
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* OTP Input Grid */}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, i) => (
            <Input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-11 text-center text-lg font-semibold p-0"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md text-center">
            {error}
          </p>
        )}

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? "Verifying..." : "Verify & Sign In"}
        </Button>

        <div className="text-center text-sm text-slate-500">
          {resendTimer > 0 ? (
            <span>Resend OTP in {resendTimer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-slate-900 font-medium underline underline-offset-2"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          onClick={() => router.push("/login")}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-600"
        >
          ← Change number
        </button>
      </CardContent>
    </Card>
  );
}
