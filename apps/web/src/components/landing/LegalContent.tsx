interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {sections.map((section) => {
          return (
            <div key={section.heading}>
              <h2 className="font-display text-xl text-brand-navy font-semibold mb-3">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => {
                return (
                  <p key={i} className="text-sm text-brand-slate leading-relaxed mb-2 last:mb-0">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}