import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Header } from "./header";
import { Footer } from "./footer";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-bone">
      <Header />
      <main className="isolate flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** Page intro band used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="shell border-b border-line pt-16 pb-12 md:pt-24 md:pb-16">
      <div
        className="label enter flex items-center gap-3 text-muted"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        <span className="h-px w-8 bg-current opacity-40" />
        {eyebrow}
      </div>
      <h1
        className="t-h2 enter mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)]"
        style={{ "--delay": "80ms" } as React.CSSProperties}
      >
        {title}
      </h1>
      {intro ? (
        <p
          className="enter mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-muted"
          style={{ "--delay": "160ms" } as React.CSSProperties}
        >
          {intro}
        </p>
      ) : null}
      {children ? (
        <div
          className="enter mt-10"
          style={{ "--delay": "220ms" } as React.CSSProperties}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
