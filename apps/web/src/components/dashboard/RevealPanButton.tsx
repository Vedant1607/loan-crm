"use client";

import { useState } from "react";

interface Props {
  applicationId: string;
}

export default function RevealPanButton({ applicationId }: Props) {
  const [pan, setPan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReveal = async () => {
    if (pan) {
      setPan(null);
      return;
    } // toggle hide

    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/reveal-pan`, {
        method: "POST",
      });
      const result = await res.json();
      if (res.ok) setPan(result.pan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-slate-500">PAN</span>
      <button
        onClick={handleReveal}
        disabled={loading}
        className="text-slate-900 font-medium hover:underline underline-offset-2"
      >
        {loading ? "Decrypting..." : pan ? pan : "Click to reveal"}
      </button>
    </div>
  );
}
