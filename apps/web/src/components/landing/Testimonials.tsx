"use client";

import { useState } from "react";

// NOTE: placeholder testimonials — replace with real customer quotes before launch.
const TESTIMONIALS = [
  {
    name: "Placeholder Name",
    role: "Small Business Owner",
    quote:
      "The team made the entire loan process simple to understand and quick to complete, from application to disbursal.",
  },
  {
    name: "Placeholder Name",
    role: "Homebuyer",
    quote:
      "Clear communication at every step, and they helped me compare options across lenders before I decided.",
  },
  {
    name: "Placeholder Name",
    role: "Entrepreneur",
    quote:
      "Having one point of contact for the whole process, instead of chasing multiple banks, saved a lot of time.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = TESTIMONIALS[index];

  const goTo = (i: number) => {
    const next = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    setIndex(next);
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
          What Our Clients Say
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight mb-12">
          Trusted by customers across India
        </h2>

        <div className="min-h-[160px] flex flex-col items-center justify-center">
          <p className="font-display text-xl md:text-2xl text-brand-navy leading-relaxed italic">
            "{active.quote}"
          </p>
          <p className="mt-6 text-sm font-semibold text-brand-navy">
            {active.name}
          </p>
          <p className="text-xs text-brand-slate">{active.role}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {TESTIMONIALS.map((testimonial, i) => {
            return (
              <button
                key={testimonial.name + i}
                onClick={() => goTo(i)}
                aria-label={`View testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-gold" : "w-2 bg-brand-navy/15"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}