import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { installment, money } from "../lib/format";
import { cn } from "../lib/utils";

export type BikeSummary = {
  slug: string;
  name: string;
  family: string;
  year: number;
  price: number;
  tagline: string;
  displacement: number;
  power: number;
  image: string;
  featured?: boolean;
};

export function BikeCard({
  bike,
  index,
  className,
}: {
  bike: BikeSummary;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      to={`/motos/${bike.slug}`}
      className={cn(
        "zoomable group flex flex-col border-t border-line pt-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="label text-muted">
            {typeof index === "number"
              ? `${String(index + 1).padStart(2, "0")} · ${bike.family}`
              : bike.family}
          </div>
          <h3 className="t-h3 mt-3 transition-colors group-hover:text-orange">
            {bike.name}
          </h3>
        </div>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange"
          strokeWidth={1.6}
        />
      </div>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden bg-bone">
        <img
          src={bike.image}
          alt={bike.name}
          loading="lazy"
          className="multiply size-full object-cover"
        />
        {bike.featured ? (
          <span className="label absolute top-3 left-0 bg-orange px-2.5 py-1.5 text-white">
            Destaque
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-[0.875rem] leading-relaxed text-muted">
        {bike.tagline}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <div className="display tnum text-[1.375rem] leading-none">
            {money(bike.price)}
          </div>
          <div className="mt-1.5 text-[0.75rem] text-muted">
            ou 48x de <span className="tnum">{installment(bike.price)}</span>
          </div>
        </div>
        <div className="label tnum text-right text-muted">
          {bike.displacement} cc
          <br />
          {bike.power} cv
        </div>
      </div>
    </Link>
  );
}

export function BikeCardSkeleton() {
  return (
    <div className="border-t border-line pt-6">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-4 h-7 w-2/3" />
      <div className="skeleton mt-4 aspect-[4/3] w-full" />
      <div className="skeleton mt-5 h-3 w-full" />
      <div className="skeleton mt-2 h-3 w-1/2" />
    </div>
  );
}
