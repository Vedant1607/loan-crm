const STEPS = [
  {
    number: "01",
    title: "Share Your Requirement",
    description: "Tell us the loan type, amount, and purpose — takes just a few minutes.",
  },
  {
    number: "02",
    title: "Reviewed by Our Team",
    description: "Your application and documents are matched with the right lending partner.",
  },
  {
    number: "03",
    title: "Track & Receive Sanction",
    description: "Follow your application status in real time through to disbursal.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-brand-navy font-semibold leading-tight">
            A seamless loan experience, start to finish
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map((step) => {
            return (
              <div key={step.number} className="relative pl-2">
                <span className="font-mono-data text-4xl font-semibold text-brand-navy/10">
                  {step.number}
                </span>
                <h3 className="font-display text-lg text-brand-navy font-semibold mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}