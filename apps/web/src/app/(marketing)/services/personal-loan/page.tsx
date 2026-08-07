import LoanProductTemplate from "@/components/landing/LoanProductTemplate";

export default function PersonalLoanPage() {
  return (
    <LoanProductTemplate
      eyebrow="Personal Loan"
      title="Quick finance for life's immediate needs"
      description="Minimal documentation, fast approval, and flexible end-use — for medical expenses, weddings, renovations, or emergencies."
      rateBadge="Starting at 11% p.a."
      highlights={["Loans up to ₹25 Lakh", "Approval within 48 hours", "No collateral required"]}
      features={[
        { title: "No Collateral Required", description: "Unsecured financing with no need to pledge assets." },
        { title: "Minimal Documentation", description: "A simple, fast application process with limited paperwork." },
        { title: "Fast Disbursal", description: "Funds typically disbursed within 48 hours of approval." },
        { title: "Flexible End-Use", description: "Use the funds for any personal purpose — no restrictions." },
      ]}
      eligibility={[
        "Indian resident aged 21–58 years",
        "Minimum monthly income of ₹15,000",
        "Salaried or self-employed with 2+ years experience",
        "Credit score of 700 or above",
      ]}
      documents={[
        "PAN Card & Aadhaar Card",
        "Bank statements (last 3 months)",
        "Salary slip (last 1 month, if salaried)",
        "Passport-size photograph",
      ]}
    />
  );
}