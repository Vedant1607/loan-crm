"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  lenderId: string;
  isActive: boolean;
}

export default function ToggleLenderStatusButton({
  lenderId,
  isActive,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/lenders/${lenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleToggle}
      disabled={loading}
      className={
        isActive
          ? "text-red-600 hover:text-red-700"
          : "text-green-600 hover:text-green-700"
      }
    >
      {loading ? "..." : isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
