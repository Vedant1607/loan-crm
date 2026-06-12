import type { LoanType } from "../types/loan.types";

const LOAN_TYPE_CODES: Record<LoanType, string> = {
  PERSONAL:      "PERS",
  MSME_BUSINESS: "MSME",
  HOME:          "HOME",
  VEHICLE:       "VEHI",
};

// Generates: LDR-MSME-DL-0001
export function generateLenderReferenceId(
  loanType: LoanType,
  stateCode: string,
  sequence: number
): string {
  const typeCode  = LOAN_TYPE_CODES[loanType];
  const seq       = String(sequence).padStart(4, "0");
  return `LDR-${typeCode}-${stateCode.toUpperCase()}-${seq}`;
}

// Generates: APP-BAJAJ-FIN-2025-000143
export function generateApplicationNo(
  lenderShortCode: string,
  sequence: number
): string {
  const year = new Date().getFullYear();
  const seq  = String(sequence).padStart(6, "0");
  return `APP-${lenderShortCode.toUpperCase()}-${year}-${seq}`;
}