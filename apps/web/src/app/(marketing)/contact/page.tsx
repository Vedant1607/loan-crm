import PageHeader from "@/components/landing/PageHeader";
import ContactForm from "@/components/landing/ContactForm";
import ContactInfo from "@/components/landing/ContactInfo";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's talk about your financing needs"
        description="Reach out and a member of our team will get back to you shortly."
      />
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <ContactInfo />
          </div>
          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}