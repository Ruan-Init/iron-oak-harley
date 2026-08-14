import { Link } from "wouter";
import { ArrowUpRight, Instagram, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Comprar",
    links: [
      { href: "/motos", label: "Todas as motos" },
      { href: "/motos?familia=Sport", label: "Sport" },
      { href: "/motos?familia=Cruiser", label: "Cruiser" },
      { href: "/motos?familia=Grand American Touring", label: "Touring" },
      { href: "/acessorios", label: "Peças e acessórios" },
    ],
  },
  {
    title: "Experiência",
    links: [
      { href: "/test-ride", label: "Agendar test ride" },
      { href: "/blog", label: "Diário Iron & Oak" },
      { href: "/contato", label: "Concessionárias" },
      { href: "/minha-conta", label: "Minha conta" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="shell py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Link
              to="/"
              className="display text-[1.6rem] leading-none tracking-[0.01em]"
            >
              Iron<span className="text-orange">&amp;</span>Oak
            </Link>
            <p className="serif mt-5 max-w-xs text-[1.0625rem] leading-snug text-bone/70">
              Concessionária independente dedicada à cultura Harley-Davidson desde
              1998.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Youtube].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-10 items-center justify-center border border-bone/25 transition-colors hover:border-orange hover:text-orange"
                >
                  <Icon className="size-[17px]" strokeWidth={1.5} />
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="label text-bone/40">{col.title}</div>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className="ulink text-[0.9375rem] text-bone/80 hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="label text-bone/40">Showroom central</div>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-bone/80">
              Av. Brigadeiro Faria Lima, 2200
              <br />
              Jardim Paulistano — São Paulo, SP
              <br />
              Seg–Sáb, 9h às 19h
            </p>
            <a
              href="tel:+551140028922"
              className="ulink tnum mt-5 inline-block text-[0.9375rem] text-orange"
            >
              +55 11 4002-8922
            </a>
            <Link
              to="/contato"
              className="btn btn-outline-light mt-8 w-full sm:w-auto"
            >
              Falar com um consultor
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      <div className="shell hairline-dark flex flex-col gap-3 py-7 text-[0.75rem] text-bone/45 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Iron &amp; Oak Harley Store.</p>
        <p className="max-w-xl md:text-right">
          Loja demonstrativa, não afiliada à Harley-Davidson Motor Company. Preços e
          condições de financiamento são simulações.
        </p>
      </div>
    </footer>
  );
}
