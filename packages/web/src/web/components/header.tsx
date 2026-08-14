import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../queries/cart";
import { authClient } from "../lib/auth";
import { cn } from "../lib/utils";

const NAV = [
  { href: "/motos", label: "Motos" },
  { href: "/acessorios", label: "Acessórios" },
  { href: "/test-ride", label: "Test Ride" },
  { href: "/blog", label: "Diário" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useCart();
  const { data: session } = authClient.useSession();
  const count = cart.data?.count ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled && !open ? "bg-bone/95 backdrop-blur-md" : "bg-bone",
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6 border-b border-line">
          <Link
            to="/"
            className="display flex items-baseline gap-2 text-[1.15rem] leading-none tracking-[0.02em]"
          >
            Iron<span className="text-orange">&amp;</span>Oak
            <span className="label ml-1 hidden text-[0.5625rem] text-muted sm:inline">
              Harley Store
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => {
              const active = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "label ulink py-2 transition-colors",
                    active ? "text-orange" : "text-ink hover:text-orange",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              to={session ? "/minha-conta" : "/entrar"}
              className="flex h-10 items-center gap-2 px-3 transition-colors hover:text-orange"
              aria-label={session ? "Minha conta" : "Entrar"}
            >
              <User className="size-[18px]" strokeWidth={1.6} />
              <span className="label hidden xl:inline">
                {session ? session.user.name.split(" ")[0] : "Entrar"}
              </span>
            </Link>

            <Link
              to="/carrinho"
              className="relative flex h-10 items-center gap-2 px-3 transition-colors hover:text-orange"
              aria-label="Carrinho"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.6} />
              {count > 0 ? (
                <span className="tnum absolute top-1 right-0 flex size-[17px] items-center justify-center rounded-full bg-orange text-[0.625rem] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ml-1 flex size-10 items-center justify-center lg:hidden"
              aria-label="Menu"
            >
              {open ? (
                <X className="size-5" strokeWidth={1.6} />
              ) : (
                <Menu className="size-5" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-bone lg:hidden">
          <nav className="shell flex flex-col pt-6 pb-16">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                to={item.href}
                className="t-h3 enter border-b border-line py-5"
                style={{ "--delay": `${i * 50}ms` } as React.CSSProperties}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={session ? "/minha-conta" : "/entrar"}
              className="t-h3 enter border-b border-line py-5 text-orange"
              style={{ "--delay": `${NAV.length * 50}ms` } as React.CSSProperties}
            >
              {session ? "Minha conta" : "Entrar"}
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
