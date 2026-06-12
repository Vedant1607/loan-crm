export type AiRecommendation =
  | "STRONG_APPROVE"
  | "APPROVE_WITH_CONDITIONS"
  | "MANUAL_REVIEW"
  | "DECLINE";

export type CibilRating = "POOR" | "FAIR" | "GOOD" | "EXCELLENT";
export type RiskGrade = "A+" | "A" | "B+" | "B" | "C" | "D";

export interface AiAnalysisRequest {
  applicationId: string;
  applicationNo: string;
  loanType: string;
  loanAmount: number;
  applicantName: string;
  monthlyIncome: number;
  existingEmis: number;
  documents: Array<{ type: string; r2Key: string }>;
  callbackUrl: string;
  callbackSecret: string;
}

export interface AiAnalysisResult {
  applicationId: string;
  analyzedAt: string;
  cibilAnalysis: {
    score: number;
    rating: CibilRating;
    remarks: string;
    isVerified: boolean;
  };
  bankStatementAnalysis: {
    averageMonthlyBalance: number;
    averageMonthlyCredit: number;
    averageMonthlyDebit: number;
    bouncedCheques: number;
    salaryCreditsDetected: number;
    unusualTransactionFlags: string[];
  };
  documentVerification: {
    panVerified: boolean;
    aadhaarVerified: boolean;
    documentsComplete: boolean;
    missingDocuments: string[];
  };
  riskAssessment: {
    riskScore: number;
    riskGrade: RiskGrade;
    recommendation: AiRecommendation;
    eligibleAmount: number;
    suggestedTenure: number;
    suggestedInterestRate: number;
    keyPositives: string[];
    keyNegatives: string[];
    dtiRatio: number;
    foir: number;
  };
  fraudFlags: {
    hasFlags: boolean;
    flags: string[];
  };
  modelVersion: string;
}

export interface AiWebhookPayload {
  applicationId: string;
  status: "COMPLETED" | "FAILED";
  mongoDocId?: string;
  riskScore?: number;
  recommendation?: AiRecommendation;
  summary?: string;
  error?: string;
}