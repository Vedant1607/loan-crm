"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  eyebrow?: string;
  title?: string;
  items: FaqItem[];
}

export default function FaqAccordion({
  eyebrow = "FAQs",
  title = "Frequently asked questions",
  items,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex((current) => (current === i ? null : i));
  };

  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className="bg-white rounded-xl border border-brand-navy/10 overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-brand-navy">
                    {item.question}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-brand-gold)" strokeWidth="2.5"
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-brand-slate leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}