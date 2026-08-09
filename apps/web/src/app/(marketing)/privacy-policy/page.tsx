import PageHeader from "@/components/landing/PageHeader";
import LegalContent from "@/components/landing/LegalContent";

const SECTIONS = [
  {
    heading: "Introduction",
    body: [
      "Sareen Powerz Ltd is committed to protecting the privacy of individuals whose personal data we process in the course of providing financial advisory and loan facilitation services.",
      "This policy explains what data we collect, why we collect it, how it is used, and the rights available to you.",
    ],
  },
  {
    heading: "Information We Collect",
    body: [
      "To assess and process loan applications, we may collect personal details (name, contact information, date of birth), identification documents (PAN, Aadhaar), financial information (income, bank statements, credit history), and employment or business details.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "Your information is used to verify identity, assess loan eligibility, match applications with suitable lending partners, process and service loan applications, and comply with applicable legal and regulatory requirements.",
    ],
  },
  {
    heading: "Data Sharing",
    body: [
      "We may share your information with lending partners, credit bureaus, and regulatory authorities as necessary to process your application. We take reasonable steps to ensure third parties handling your data maintain appropriate safeguards.",
    ],
  },
  {
    heading: "Data Security",
    body: [
      "We apply technical and organisational safeguards — including encryption of sensitive data and restricted access controls — to protect your personal information from unauthorised access, loss, or misuse.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to, correction of, or deletion of your personal data, subject to our legal and regulatory retention obligations. To exercise these rights, please contact us using the details on our Contact page.",
    ],
  },
  {
    heading: "Policy Updates",
    body: [
      "This policy may be updated periodically to reflect changes in our practices or applicable law. We encourage you to review it from time to time.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Sareen Powerz Ltd collects, uses, and protects your personal information."
      />
      <LegalContent sections={SECTIONS} />
    </>
  );
}