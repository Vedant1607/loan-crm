import { prisma } from "@loan-crm/db";
import type { LoanType } from "@prisma/client";

const LOAN_TYPE_CODES: Record<LoanType, string> = {
  PERSONAL: "PERS",
  MSME_BUSINESS: "MSME",
  HOME: "HOME",
  VEHICLE: "VEHI",
};

export async function generateLenderReferenceId(
  primaryLoanType: LoanType,
  primaryRegion: string,
): Promise<string> {
  const typeCode = LOAN_TYPE_CODES[primaryLoanType];
  const stateCode = primaryRegion.toUpperCase();

  const count = await prisma.lender.count({
    where: {
      referenceId: { startsWith: `LDR-${typeCode}-${stateCode}-` },
    },
  });

  const seq = String(count + 1).padStart(4, "0");
  return `LDR-${typeCode}-${stateCode}-${seq}`;
}
