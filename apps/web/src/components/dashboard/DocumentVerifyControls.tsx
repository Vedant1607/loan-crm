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
import { Textarea } from "@/components/ui/textarea";

type DocStatus = "PENDING" | "UPLOADED" | "VERIFIED" | "REJECTED";

interface Props {
  applicationId: string;
  documentId:    string;
  status:        DocStatus;
}

const STATUS_STYLES: Record<DocStatus, string> = {
  PENDING:  "bg-slate-100 text-slate-500",
  UPLOADED: "bg-blue-100 text-blue-700",
  VERIFIED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function DocumentVerifyControls({ applicationId, documentId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading]       = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason]         = useState("");
  const [error, setError]           = useState("");

  const updateStatus = async (newStatus: "VERIFIED" | "REJECTED", rejectionReason?: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/applications/${applicationId}/documents/${documentId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus, rejectionReason }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Failed to update document");
        return;
      }

      setRejectOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}>
        {status}
      </span>

      {status !== "VERIFIED" && (
        <button
          onClick={() => updateStatus("VERIFIED")}
          disabled={loading}
          className="text-xs text-green-700 hover:underline underline-offset-2 disabled:opacity-50"
        >
          Verify
        </button>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          {status !== "REJECTED" && (
            <button
              disabled={loading}
              className="text-xs text-red-600 hover:underline underline-offset-2 disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Textarea
              placeholder="Reason for rejection (e.g. blurry scan, mismatched name, expired document)"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => updateStatus("REJECTED", reason)}
              disabled={loading || !reason.trim()}
            >
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}