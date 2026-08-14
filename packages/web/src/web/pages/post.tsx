import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "../components/reveal";
import { usePost } from "../queries/blog";
import { shortDate } from "../lib/format";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const query = usePost(slug);

  if (query.isLoading) {
    return (
      <div className="shell py-24">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton mt-8 h-16 w-full max-w-3xl" />
        <div className="skeleton mt-10 aspect-[16/9] w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="t-h2">Matéria não encontrada</h1>
        <p className="mt-6 text-[0.9375rem] text-muted">
          O conteúdo pode ter sido movido.
        </p>
        <Link to="/blog" className="btn btn-primary mt-9">
          Voltar ao diário
        </Link>
      </div>
    );
  }

  const { post, more } = query.data;
  const paragraphs = post.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <article className="shell pt-16 pb-16 md:pt-24">
        <Link to="/blog" className="label enter inline-flex items-center gap-2 text-muted">
          <ArrowLeft className="size-4" />
          Diário de bordo
        </Link>

        <div
          className="label enter mt-10 flex flex-wrap items-center gap-3 text-muted"
          style={{ "--delay": "60ms" } as React.CSSProperties}
        >
          <span className="text-orange">{post.category}</span>
          <span className="h-px w-6 bg-current opacity-40" />
          {shortDate(post.publishedAt)}
          <span className="h-px w-6 bg-current opacity-40" />
          {post.readMinutes} min de leitura
        </div>

        <h1
          className="t-h2 enter mt-6 max-w-4xl text-[clamp(2.25rem,5.5vw,4.25rem)]"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {post.title}
        </h1>

        <p
          className="serif enter mt-8 max-w-2xl text-[1.25rem] leading-relaxed text-graphite"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          {post.excerpt}
        </p>

        <div
          className="enter mt-12 aspect-[16/9] overflow-hidden bg-bone-2"
          style={{ "--delay": "240ms" } as React.CSSProperties}
        >
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-[200px_1fr] md:gap-20">
          <div className="border-t border-line pt-6 md:sticky md:top-28 md:self-start">
            <div className="label text-muted">Por</div>
            <div className="mt-3 text-[0.9375rem] text-ink">{post.author}</div>
            <div className="label mt-8 text-muted">Publicado</div>
            <div className="mt-3 text-[0.9375rem] text-ink">
              {shortDate(post.publishedAt)}
            </div>
          </div>

          <div className="max-w-2xl">
            {paragraphs.map((line, i) =>
              line.startsWith("## ") ? (
                <h2
                  key={i}
                  className="t-h3 mt-14 mb-5 text-[1.375rem] first:mt-0"
                >
                  {line.replace("## ", "")}
                </h2>
              ) : (
                <p
                  key={i}
                  className="mt-6 text-[1rem] leading-[1.85] text-graphite first:mt-0"
                >
                  {line}
                </p>
              ),
            )}
          </div>
        </div>
      </article>

      {more.length ? (
        <section className="border-t border-line bg-bone-2 py-16 md:py-24">
          <div className="shell">
            <div className="label text-muted">Continue lendo</div>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {more.map((item, i) => (
                <Reveal as="article" key={item.id} delay={i * 80}>
                  <Link to={`/blog/${item.slug}`} className="group block">
                    <div className="zoomable aspect-[4/3] overflow-hidden bg-bone">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="label mt-5 text-orange">{item.category}</div>
                    <h3 className="t-h3 mt-3 text-[1.125rem] leading-tight">
                      <span className="ulink">{item.title}</span>
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
