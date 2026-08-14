import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function Eyebrow({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <div className={cn("label flex items-center gap-3 text-muted", className)}>
      {index ? <span className="text-orange">{index}</span> : null}
      <span className="h-px w-8 bg-current opacity-40" />
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  index,
  title,
  intro,
  action,
  light,
  className,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <Eyebrow index={index} className={light ? "text-bone/50" : undefined}>
          {eyebrow}
        </Eyebrow>
        <h2 className="t-h2 mt-5">{title}</h2>
        {intro ? (
          <p
            className={cn(
              "mt-5 max-w-xl text-[0.9375rem] leading-relaxed",
              light ? "text-bone/65" : "text-muted",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  value,
  unit,
  label,
  light,
}: {
  value: string;
  unit?: string;
  label: string;
  light?: boolean;
}) {
  return (
    <div>
      <div className="display flex items-baseline gap-1 text-[clamp(1.75rem,3.4vw,2.75rem)]">
        <span className="tnum">{value}</span>
        {unit ? (
          <span
            className={cn(
              "text-[0.7rem] tracking-[0.1em]",
              light ? "text-bone/50" : "text-muted",
            )}
          >
            {unit}
          </span>
        ) : null}
      </div>
      <div
        className={cn("label mt-2", light ? "text-bone/45" : "text-muted")}
      >
        {label}
      </div>
    </div>
  );
}
