"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  lenderId: string;
  isActive: boolean;
}

export default function ToggleLenderStatusButton({ lenderId, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lenders/${lenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle lender status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="xs"
      variant="outline"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "Updating..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
