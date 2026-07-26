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
  userId:      string;
  currentRole: string;
}

const ROLES = [
  { value: "APPLICANT",    label: "Applicant" },
  { value: "LOAN_OFFICER", label: "Loan Officer" },
  { value: "LENDER_ADMIN", label: "Lender Admin" },
  { value: "SUPER_ADMIN",  label: "Super Admin" },
];

export default function ChangeUserRoleButton({ userId, currentRole }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (role: string) => {
    if (role === currentRole) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ role }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select defaultValue={currentRole} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="h-7 text-xs w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}