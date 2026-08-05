// NOTE: placeholder figures — swap in real numbers before launch.
const STATS = [
  { value: "10+",     label: "Years in Business" },
  { value: "15+",     label: "States Served" },
  { value: "150+",    label: "Lending Partners" },
  { value: "₹500 Cr+", label: "Loans Facilitated" },
];

export default function StatsBar() {
  return (
    <section className="bg-brand-navy py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => {
            return (
              <div key={stat.label} className="text-center md:text-left">
                <p className="font-mono-data text-2xl md:text-3xl font-semibold text-brand-gold">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-white/60 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}