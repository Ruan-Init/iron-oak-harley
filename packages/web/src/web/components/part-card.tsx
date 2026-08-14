import { Check, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { moneyExact } from "../lib/format";
import { getCartKey, useAddToCart } from "../queries/cart";

export type PartSummary = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

export function PartCard({ part }: { part: PartSummary }) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);
  const pending = addToCart.isPending;

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <div className="group flex flex-col border-t border-line pt-5">
      <div className="zoomable relative aspect-[4/5] overflow-hidden bg-bone-2">
        <img
          src={part.image}
          alt={part.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="label mt-5 text-muted">{part.category}</div>
      <h3 className="mt-2 text-[1.0625rem] leading-snug font-semibold">
        {part.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
        {part.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="display tnum text-[1.125rem]">
          {moneyExact(part.price)}
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            addToCart.mutate(
              {
                cartKey: getCartKey(),
                kind: "peca",
                productId: part.id,
                quantity: 1,
              },
              { onSuccess: () => setAdded(true) },
            );
          }}
          className="flex size-10 items-center justify-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-bone disabled:opacity-50"
          aria-label={`Adicionar ${part.name} ao carrinho`}
        >
          {pending ? (
            <Loader2 className="spin size-4" strokeWidth={2} />
          ) : added ? (
            <Check className="size-4 text-orange" strokeWidth={2} />
          ) : (
            <Plus className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

export function PartCardSkeleton() {
  return (
    <div className="border-t border-line pt-5">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="skeleton mt-5 h-3 w-20" />
      <div className="skeleton mt-3 h-4 w-2/3" />
      <div className="skeleton mt-3 h-3 w-full" />
    </div>
  );
}
