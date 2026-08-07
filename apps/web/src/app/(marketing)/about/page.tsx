import PageHeader from "@/components/landing/PageHeader";
import AboutStory from "@/components/landing/AboutStory";
import FundingSchemesTable from "@/components/landing/FundingSchemesTable";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A financial advisory partner, not just a lender"
        description="Helping individuals, MSMEs, and businesses across India access the right financing — with a dedicated relationship manager guiding every step."
      />
      <AboutStory />
      <FundingSchemesTable />
    </>
  );
}