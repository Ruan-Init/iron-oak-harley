import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { usePosts } from "../queries/blog";
import { shortDate } from "../lib/format";

export default function BlogPage() {
  const posts = usePosts();
  const list = posts.data ?? [];
  const [lead, ...rest] = list;

  return (
    <>
      <PageHero
        eyebrow="Diário de bordo"
        title={
          <>
            Histórias de
            <br />
            estrada e oficina
          </>
        }
        intro="Notas sobre manutenção, viagens longas, cultura custom e o que acontece dentro da Iron & Oak."
      />

      <section className="shell py-16 md:py-24">
        {posts.isLoading ? (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/3] w-full" />
                <div className="skeleton mt-6 h-3 w-24" />
                <div className="skeleton mt-4 h-6 w-full" />
              </div>
            ))}
          </div>
        ) : null}

        {lead ? (
          <Reveal>
            <Link
              to={`/blog/${lead.slug}`}
              className="group grid gap-10 border-b border-line pb-16 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16"
            >
              <div className="zoomable aspect-[4/3] overflow-hidden bg-bone-2">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="label flex items-center gap-3 text-muted">
                  <span className="text-orange">{lead.category}</span>
                  <span className="h-px w-6 bg-current opacity-40" />
                  {shortDate(lead.publishedAt)}
                </div>
                <h2 className="t-h2 mt-6 text-[clamp(1.9rem,3.6vw,3rem)]">
                  {lead.title}
                </h2>
                <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
                  {lead.excerpt}
                </p>
                <div className="label mt-8 flex items-center gap-2 text-ink">
                  Ler a matéria
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="label mt-6 text-muted">
                  {lead.author} · {lead.readMinutes} min de leitura
                </div>
              </div>
            </Link>
          </Reveal>
        ) : null}

        {rest.length ? (
          <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal as="article" key={post.id} delay={(i % 3) * 80}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="zoomable aspect-[4/3] overflow-hidden bg-bone-2">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="label mt-6 flex items-center gap-3 text-muted">
                    <span className="text-orange">{post.category}</span>
                    <span className="h-px w-6 bg-current opacity-40" />
                    {shortDate(post.publishedAt)}
                  </div>
                  <h3 className="t-h3 mt-4 text-[1.25rem] leading-tight">
                    <span className="ulink">{post.title}</span>
                  </h3>
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <div className="label mt-5 text-muted">
                    {post.readMinutes} min
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
