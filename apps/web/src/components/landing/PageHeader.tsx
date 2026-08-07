interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  badge?: string;
}

export default function PageHeader({ eyebrow, title, description, badge }: PageHeaderProps) {
  return (
    <section className="bg-brand-navy pt-32 pb-16 md:pt-36 md:pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-gold mb-3">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-white font-semibold leading-tight max-w-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
            {description}
          </p>
        )}
        {badge && (
          <span className="inline-block mt-5 font-mono-data text-sm font-semibold text-brand-navy bg-brand-gold rounded-full px-4 py-1.5">
            {badge}
          </span>
        )}
      </div>
    </section>
  );
}