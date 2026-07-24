"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  applicationId: string;
  riskScore: number | null;
  recommendation: string | null;
  analyzedAt: Date | null;
}

export default function AIAnalysisReport({
  applicationId,
  riskScore,
  recommendation,
  analyzedAt,
}: Props) {
  const [loading, setLoading] = useState(false);

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  if (!analyzedAt) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            AI Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-slate-400 mb-3">Not yet analyzed</p>
          <Button size="sm" onClick={triggerAnalysis} disabled={loading}>
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const gradeColor =
    (riskScore ?? 0) >= 70
      ? "text-green-600"
      : (riskScore ?? 0) >= 50
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <Card className="border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          🤖 AI Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-2">
          <p className={`text-4xl font-bold ${gradeColor}`}>
            {riskScore?.toFixed(0)}
          </p>
          <p className="text-xs text-slate-400">Risk Score / 100</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Recommendation</p>
          <p className="font-semibold text-sm text-slate-900 mt-0.5">
            {recommendation?.replace(/_/g, " ")}
          </p>
        </div>
        <p className="text-xs text-slate-400 text-center">
          Full detailed report will be shown here once AI service is connected
          (Step 20+)
        </p>
      </CardContent>
    </Card>
  );
}
