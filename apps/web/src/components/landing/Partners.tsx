const ROW_1 = [
  { name: "HDFC Bank",        file: "hdfc-bank.png" },
  { name: "ICICI Bank",       file: "icici-bank.png" },
  { name: "Kotak Mahindra",   file: "kotak-mahindra.png" },
  { name: "Axis Bank",        file: "axis-bank.png" },
  { name: "Bajaj Finserv",    file: "bajaj-finserv.jpg" },
  { name: "Sammaan Capital",  file: "sammaan-capital.png" },
  { name: "PNB",              file: "pnb.png" },
  { name: "HDFC Home Loans",  file: "hdfc-home-loans.png" },
  { name: "RBL Bank",         file: "rbl-bank.png" },
  { name: "IndusInd Bank",    file: "indusind-bank.png" },
  { name: "Bank of Baroda",   file: "bank-of-baroda.png" },
  { name: "LIC HFL",          file: "lic-hfl.png" },
];

const ROW_2 = [
  { name: "IDFC FIRST Bank",     file: "idfc-first-bank.png" },
  { name: "DCB Bank",            file: "dcb-bank.png" },
  { name: "Edelweiss",           file: "edelweiss.png" },
  { name: "Chola",               file: "chola.png" },
  { name: "Deutsche Bank",       file: "deutsche-bank.png" },
  { name: "SBI",                 file: "sbi.png" },
  { name: "Shriram Finance",     file: "shriram-finance.png" },
  { name: "L&T Finance",         file: "lt-finance.png" },
  { name: "Poonawalla Fincorp",  file: "poonawalla-fincorp.png" },
  { name: "Capital First",       file: "capital-first.png" },
  { name: "InCred Finance",      file: "incred-finance.svg" },
  { name: "IIFL Finance",        file: "iifl-finance.png" },
];

function MarqueeRow({
  logos,
  direction,
}: {
  logos: { name: string; file: string }[];
  direction: "left" | "right";
}) {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="marquee-row overflow-hidden">
      <div className={`flex w-max gap-10 ${animationClass}`}>
        {[...logos, ...logos].map((logo, i) => {
          return (
            <div
              key={`${logo.file}-${i}`}
              className="h-14 w-32 shrink-0 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={`/partners/${logo.file}`}
                alt={logo.name}
                className="max-h-10 max-w-28 object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="bg-white py-16 md:py-20 border-y border-brand-navy/10">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-brand-slate mb-10">
          Association with 150+ Banks &amp; Financial Institutions
        </p>
        <div className="space-y-6">
          <MarqueeRow logos={ROW_1} direction="left" />
          <MarqueeRow logos={ROW_2} direction="right" />
        </div>
      </div>
    </section>
  );
}