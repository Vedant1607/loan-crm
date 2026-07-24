"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Props {
  application: {
    id: string;
    status: string;
  };
}

export default function DecisionPanel({ application }: Props) {
  const router = useRouter();
  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [sanctionedAmount, setSanctionedAmount] = useState("");
  const [sanctionedRate, setSanctionedRate] = useState("");
  const [sanctionedTenure, setSanctionedTenure] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const isDecided = [
    "APPROVED",
    "CONDITIONALLY_APPROVED",
    "REJECTED",
    "DISBURSED",
    "ACTIVE",
    "CLOSED",
  ].includes(application.status);

  const submitDecision = async () => {
    if (!action) return;
    setLoading(true);

    try {
      await fetch(`/api/applications/${application.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          sanctionedAmount: sanctionedAmount
            ? Number(sanctionedAmount)
            : undefined,
          sanctionedRate: sanctionedRate ? Number(sanctionedRate) : undefined,
          sanctionedTenure: sanctionedTenure
            ? Number(sanctionedTenure)
            : undefined,
          notes,
        }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (isDecided) {
    return (
      <Card>
        <CardContent className="py-4 text-center">
          <p className="text-sm text-slate-500">
            Decision already recorded for this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Loan Decision
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={action === "APPROVE" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setAction("APPROVE")}
          >
            ✓ Approve
          </Button>
          <Button
            variant={action === "REJECT" ? "destructive" : "outline"}
            className="flex-1"
            onClick={() => setAction("REJECT")}
          >
            ✕ Reject
          </Button>
        </div>

        {action === "APPROVE" && (
          <div className="space-y-2 pt-2">
            <Input
              type="number"
              placeholder="Sanctioned Amount (₹)"
              value={sanctionedAmount}
              onChange={(e) => setSanctionedAmount(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Interest Rate (% p.a.)"
              value={sanctionedRate}
              onChange={(e) => setSanctionedRate(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Tenure (months)"
              value={sanctionedTenure}
              onChange={(e) => setSanctionedTenure(e.target.value)}
            />
          </div>
        )}

        {action && (
          <Textarea
            placeholder={
              action === "APPROVE"
                ? "Notes / conditions (optional)"
                : "Reason for rejection"
            }
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        )}

        {action && (
          <Button
            className="w-full"
            onClick={submitDecision}
            disabled={loading || (action === "APPROVE" && !sanctionedAmount)}
          >
            {loading
              ? "Submitting..."
              : `Confirm ${action === "APPROVE" ? "Approval" : "Rejection"}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
