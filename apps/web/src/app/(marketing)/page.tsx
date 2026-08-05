import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import ProcessSteps from "@/components/landing/ProcessSteps";
import ServiceTeasers from "@/components/landing/ServiceTeasers";
import TrustGrid from "@/components/landing/TrustGrid";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProcessSteps />
      <ServiceTeasers />
      <TrustGrid />
      <Testimonials />
      <Partners />
    </>
  );
}