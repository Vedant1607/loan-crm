import PageHeader from "@/components/landing/PageHeader";
import ServicesPrimary from "@/components/landing/ServicesPrimary";
import ServicesGrid from "@/components/landing/ServicesGrid";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Financing solutions for every need"
        description="From everyday personal finance to specialised project funding and restructuring — matched to the lending partner best suited to you."
      />
      <ServicesPrimary />
      <ServicesGrid />
    </>
  );
}