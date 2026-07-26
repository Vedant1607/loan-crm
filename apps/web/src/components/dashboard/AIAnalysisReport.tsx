import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  applicationId: string;
  riskScore: number | null;
  recommendation: string | null;
  analyzedAt: Date | null;
}

export default function AIAnalysisReport({
  riskScore,
  recommendation,
  analyzedAt,
}: Props) {
  // AI analysis is disabled for now — manual review only.
  // This component will be re-enabled once the AI service (Step 20+) is connected.
  if (!analyzedAt) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-slate-400">📋 Manual review mode</p>
          <p className="text-xs text-slate-400 mt-1">
            Review uploaded documents and use your judgement to make a decision.
          </p>
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
      </CardContent>
    </Card>
  );
}
