import { Link } from "wouter";
import { ArrowRight, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import {
  getCartKey,
  useCart,
  useClearCart,
  useRemoveFromCart,
  useSetQuantity,
} from "../queries/cart";
import { moneyExact } from "../lib/format";

export default function CartPage() {
  const cart = useCart();
  const setQuantity = useSetQuantity();
  const removeItem = useRemoveFromCart();
  const clearCart = useClearCart();
  const busy = setQuantity.isPending || removeItem.isPending || clearCart.isPending;

  return (
    <div className="shell py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <div className="label text-muted">Carrinho</div>
          <h1 className="t-h2 mt-4">Sua seleção</h1>
        </div>
        {cart.data?.lines.length ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => clearCart.mutate({ cartKey: getCartKey() })}
            className="label ulink text-muted hover:text-orange"
          >
            Esvaziar carrinho
          </button>
        ) : null}
      </div>

      {cart.isLoading ? (
        <div className="mt-10 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-6 border-b border-line pb-6">
              <div className="skeleton size-28" />
              <div className="flex-1">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton mt-3 h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : cart.data?.lines.length ? (
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <ul>
            {cart.data.lines.map((line) => (
              <li
                key={line.id}
                className="flex flex-col gap-5 border-b border-line py-7 sm:flex-row sm:items-center"
              >
                <Link
                  to={line.kind === "moto" ? `/motos/${line.slug}` : "/acessorios"}
                  className="w-full shrink-0 sm:w-32"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-bone-2">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      className={`size-full object-cover ${
                        line.kind === "moto" ? "multiply" : ""
                      }`}
                    />
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="label text-muted">
                    {line.kind === "moto" ? "Motocicleta" : "Acessório"}
                  </div>
                  <Link
                    to={line.kind === "moto" ? `/motos/${line.slug}` : "/acessorios"}
                    className="ulink mt-1.5 block text-[1.0625rem] font-semibold"
                  >
                    {line.name}
                  </Link>
                  {line.variant ? (
                    <div className="mt-1 text-[0.8125rem] text-muted">
                      Cor: {line.variant}
                    </div>
                  ) : null}
                  <div className="tnum mt-2 text-[0.8125rem] text-muted">
                    {moneyExact(line.unitPrice)} / unidade
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-3">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        setQuantity.mutate({
                          cartKey: getCartKey(),
                          id: line.id,
                          quantity: line.quantity - 1,
                        })
                      }
                      className="flex size-9 items-center justify-center transition-colors hover:bg-bone-2 disabled:opacity-40"
                      aria-label="Diminuir"
                    >
                      <Minus className="size-3.5" strokeWidth={2} />
                    </button>
                    <span className="tnum w-9 text-center text-[0.875rem] font-semibold">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={busy || line.quantity >= 10}
                      onClick={() =>
                        setQuantity.mutate({
                          cartKey: getCartKey(),
                          id: line.id,
                          quantity: line.quantity + 1,
                        })
                      }
                      className="flex size-9 items-center justify-center transition-colors hover:bg-bone-2 disabled:opacity-40"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="display tnum text-[1.125rem] whitespace-nowrap">
                    {moneyExact(line.total)}
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      removeItem.mutate({ cartKey: getCartKey(), id: line.id })
                    }
                    className="text-muted transition-colors hover:text-orange disabled:opacity-40"
                    aria-label="Remover item"
                  >
                    <Trash2 className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside>
            <div className="sticky top-[96px] border-t-2 border-ink pt-7">
              <h2 className="t-h3">Resumo</h2>
              <dl className="mt-7 space-y-4 text-[0.9375rem]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tnum font-semibold">
                    {moneyExact(cart.data.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Frete</dt>
                  <dd className="tnum font-semibold">
                    {cart.data.shipping === 0
                      ? "Incluído"
                      : moneyExact(cart.data.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-5">
                  <dt className="label pt-1.5">Total</dt>
                  <dd className="display tnum text-[1.5rem] leading-none">
                    {moneyExact(cart.data.total)}
                  </dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn btn-primary mt-8 w-full">
                Finalizar compra
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
              <Link to="/motos" className="btn btn-outline mt-3 w-full">
                Continuar comprando
              </Link>

              {busy ? (
                <div className="label mt-5 flex items-center gap-2 text-muted">
                  <Loader2 className="spin size-3.5" strokeWidth={2} />
                  Atualizando
                </div>
              ) : null}

              <p className="mt-7 text-[0.75rem] leading-relaxed text-muted">
                Pagamento simulado para fins de demonstração. Nenhuma cobrança real é
                efetuada.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <div className="py-28 text-center">
          <h2 className="t-h2">Carrinho vazio</h2>
          <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            Escolha uma moto no catálogo ou complete o equipamento na loja de
            acessórios.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/motos" className="btn btn-primary">
              Ver motos
            </Link>
            <Link to="/acessorios" className="btn btn-outline">
              Ver acessórios
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
