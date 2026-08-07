import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "./PageHeader";

interface Feature {
  title: string;
  description: string;
}

interface LoanProductTemplateProps {
  eyebrow: string;
  title: string;
  description: string;
  rateBadge: string;
  highlights: string[];
  features: Feature[];
  eligibility: string[];
  documents: string[];
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-brand-ink/80">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2.5" className="mt-0.5 shrink-0">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </li>
  );
}

export default function LoanProductTemplate({
  eyebrow,
  title,
  description,
  rateBadge,
  highlights,
  features,
  eligibility,
  documents,
}: LoanProductTemplateProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} badge={rateBadge} />

      {/* Quick Highlights */}
      <section className="bg-white py-10 border-b border-brand-navy/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {highlights.map((item) => {
              return (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-gold)" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-cream py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            Key Features
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-brand-navy font-semibold leading-tight mb-10 max-w-xl">
            Built to fit your financial situation
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 bg-white rounded-xl border border-brand-navy/10 p-5"
                >
                  <div className="h-9 w-9 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-navy)" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy mb-1">
                      {feature.title}
                    </p>
                    <p className="text-sm text-brand-slate leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eligibility + Documents */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
              Eligibility Criteria
            </p>
            <h3 className="font-display text-xl text-brand-navy font-semibold mb-5">
              Who can apply
            </h3>
            <ul className="space-y-3">
              {eligibility.map((item) => {
                return <CheckItem key={item} text={item} />;
              })}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
              Documents Required
            </p>
            <h3 className="font-display text-xl text-brand-navy font-semibold mb-5">
              What you'll need
            </h3>
            <ul className="space-y-3">
              {documents.map((item) => {
                return <CheckItem key={item} text={item} />;
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-gold py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-brand-navy font-semibold">
              Ready to get started?
            </h3>
            <p className="text-brand-navy/70 mt-1">
              Apply online in minutes and track your application in real time.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button asChild size="lg" className="bg-brand-navy hover:bg-brand-navy-light text-white font-semibold">
              <Link href="/login">Apply Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5">
              <Link href="/contact">Talk to an Advisor</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}