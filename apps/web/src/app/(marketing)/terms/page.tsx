import PageHeader from "@/components/landing/PageHeader";
import LegalContent from "@/components/landing/LegalContent";

const SECTIONS = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using this website, or submitting a loan application through our platform, you agree to be bound by these Terms & Conditions.",
    ],
  },
  {
    heading: "Nature of Our Services",
    body: [
      "Sareen Powerz Ltd acts as a financial advisory and loan facilitation intermediary. We help match applicants with lending partners; we are not a lender ourselves, and final loan approval, interest rates, and terms are determined solely by the respective lending institution.",
    ],
  },
  {
    heading: "Applicant Responsibilities",
    body: [
      "You are responsible for providing accurate, complete, and truthful information and documentation. Providing false or misleading information may result in rejection of your application or other consequences under applicable law.",
    ],
  },
  {
    heading: "No Guarantee of Approval",
    body: [
      "Submission of an application does not guarantee loan approval or disbursal. Approval is at the sole discretion of the partner lender, based on their own credit and risk assessment criteria.",
    ],
  },
  {
    heading: "Fees",
    body: [
      "Any applicable processing fees or charges will be disclosed to you by the relevant lending partner prior to loan disbursal.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "Sareen Powerz Ltd is not liable for any loss or damage arising from a lender's decision, delay, or the terms of any loan sanctioned through our platform.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These terms are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in New Delhi.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms governing your use of this website and our loan facilitation services."
      />
      <LegalContent sections={SECTIONS} />
    </>
  );
}