"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  inquiryId:     string;
  currentStatus: string;
}

const STATUSES = [
  { value: "NEW",       label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED",    label: "Closed" },
];

export default function InquiryStatusButton({ inquiryId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (status: string) => {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="h-7 text-xs w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => {
          return (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}