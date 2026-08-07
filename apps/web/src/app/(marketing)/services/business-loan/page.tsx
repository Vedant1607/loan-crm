import LoanProductTemplate from "@/components/landing/LoanProductTemplate";

export default function BusinessLoanPage() {
  return (
    <LoanProductTemplate
      eyebrow="Business Loan"
      title="Capital structured around your cash flow"
      description="Working capital, term loans, and cash credit to fuel growth — for MSMEs, startups, and established businesses."
      rateBadge="Starting at 11% p.a."
      highlights={["Loans up to ₹50 Lakh+", "Collateral-free options", "Business vintage from 1 year"]}
      features={[
        { title: "Collateral-Free Options", description: "Unsecured working capital available for eligible businesses." },
        { title: "Flexible Repayment Structures", description: "Term loans, overdraft, and cash credit structured to your cycle." },
        { title: "Quick Turnaround", description: "Fast processing so you don't miss business opportunities." },
        { title: "GST & MSME Scheme Support", description: "Guidance on government schemes for MSMEs and startups." },
      ]}
      eligibility={[
        "Business vintage of 1+ years",
        "Minimum annual turnover of ₹10 Lakh",
        "GST registration (where applicable)",
        "Credit score of 700 or above",
      ]}
      documents={[
        "PAN Card & Aadhaar Card",
        "Bank statements (last 6 months)",
        "Income Tax Returns (last 2 years)",
        "Business registration proof",
        "GST returns",
        "Passport-size photograph",
      ]}
    />
  );
}