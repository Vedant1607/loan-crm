"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LifecycleAction {
  action:        "DISBURSE" | "ACTIVATE" | "CLOSE" | "MARK_NPA" | "REACTIVATE";
  label:         string;
  noteLabel:     string;
  noteRequired:  boolean;
  destructive?:  boolean;
}

const ACTIONS_BY_STATUS: Record<string, LifecycleAction[]> = {
  APPROVED: [
    { action: "DISBURSE", label: "Mark as Disbursed", noteLabel: "Disbursement reference (optional)", noteRequired: false },
  ],
  CONDITIONALLY_APPROVED: [
    { action: "DISBURSE", label: "Mark as Disbursed", noteLabel: "Disbursement reference (optional)", noteRequired: false },
  ],
  DISBURSED: [
    { action: "ACTIVATE", label: "Activate Loan", noteLabel: "Note (optional)", noteRequired: false },
  ],
  ACTIVE: [
    { action: "CLOSE",    label: "Mark as Closed", noteLabel: "Closing note (optional, e.g. Fully repaid)", noteRequired: false },
    { action: "MARK_NPA", label: "Mark as NPA",    noteLabel: "Reason for NPA classification",              noteRequired: true, destructive: true },
  ],
  NPA: [
    { action: "REACTIVATE", label: "Reactivate Loan", noteLabel: "Reactivation note (e.g. restructured)", noteRequired: false },
  ],
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED:               "Approved",
  CONDITIONALLY_APPROVED: "Conditionally Approved",
  DISBURSED:              "Disbursed",
  ACTIVE:                 "Active",
  CLOSED:                 "Closed",
  NPA:                    "NPA",
};

interface Props {
  applicationId:   string;
  status:          string;
  disbursedAt:     Date | null;
  closedAt:        Date | null;
  lifecycleNote:   string | null;
}

function ActionButton({
  applicationId,
  action,
}: {
  applicationId: string;
  action: LifecycleAction;
}) {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/applications/${applicationId}/lifecycle`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: action.action, note: note || undefined }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Failed to update loan status");
        return;
      }

      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={action.destructive ? "destructive" : "outline"}
          className="w-full"
        >
          {action.label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Textarea
            placeholder={action.noteLabel}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            className="w-full"
            variant={action.destructive ? "destructive" : "default"}
            onClick={submit}
            disabled={loading || (action.noteRequired && !note.trim())}
          >
            {loading ? "Updating..." : `Confirm — ${action.label}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LifecycleControls({
  applicationId,
  status,
  disbursedAt,
  closedAt,
  lifecycleNote,
}: Props) {
  const actions = ACTIONS_BY_STATUS[status] ?? [];
  const isRelevant = status in ACTIONS_BY_STATUS || status === "CLOSED";

  if (!isRelevant) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Loan Lifecycle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">
          Current status: {STATUS_LABELS[status] ?? status}
        </p>

        {disbursedAt && (
          <p className="text-xs text-slate-500">
            Disbursed on {format(new Date(disbursedAt), "dd MMM yyyy")}
          </p>
        )}
        {closedAt && (
          <p className="text-xs text-slate-500">
            Closed on {format(new Date(closedAt), "dd MMM yyyy")}
          </p>
        )}
        {lifecycleNote && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2">
            {lifecycleNote}
          </p>
        )}

        {actions.length > 0 && (
          <div className="space-y-2 pt-2">
            {actions.map((action) => {
              return (
                <ActionButton key={action.action} applicationId={applicationId} action={action} />
              );
            })}
          </div>
        )}

        {actions.length === 0 && status === "CLOSED" && (
          <p className="text-xs text-slate-400">This loan is fully closed.</p>
        )}
      </CardContent>
    </Card>
  );
}