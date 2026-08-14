import { Link, useParams } from "wouter";
import { Check, Printer } from "lucide-react";
import { useOrder } from "../queries/checkout";
import { moneyExact, paymentLabels, shortDate } from "../lib/format";

export default function OrderPage() {
  const { code } = useParams<{ code: string }>();
  const query = useOrder(code);

  if (query.isLoading) {
    return (
      <div className="shell py-24">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton mt-6 h-14 w-2/3 max-w-lg" />
        <div className="skeleton mt-10 h-40 w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="t-h2">Pedido não encontrado</h1>
        <p className="mt-6 text-[0.9375rem] text-muted">
          Confira o código recebido por e-mail.
        </p>
        <Link to="/motos" className="btn btn-primary mt-9">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const { order, items } = query.data;

  return (
    <div className="shell py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="enter flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-orange text-white">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <span className="label text-muted">Pedido confirmado</span>
        </div>

        <h1
          className="t-h2 enter mt-7"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          Obrigado, {order.customerName.split(" ")[0]}
        </h1>

        <p
          className="enter mt-6 text-[0.9375rem] leading-relaxed text-muted"
          style={{ "--delay": "140ms" } as React.CSSProperties}
        >
          Registramos seu pedido{" "}
          <span className="tnum font-semibold text-ink">{order.code}</span> e enviamos
          a confirmação para {order.email}. Um consultor entra em contato em até um dia
          útil para alinhar entrega e documentação.
        </p>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <div className="label border-b border-line pb-4 text-muted">Itens</div>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-5 border-b border-line py-6"
              >
                <div className="size-20 shrink-0 overflow-hidden bg-bone-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className={`size-full object-cover ${
                      item.kind === "moto" ? "multiply" : ""
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="label text-muted">
                    {item.kind === "moto" ? "Motocicleta" : "Acessório"}
                  </div>
                  <div className="mt-1 text-[0.9375rem] font-semibold">
                    {item.name}
                  </div>
                  {item.variant ? (
                    <div className="text-[0.8125rem] text-muted">
                      Cor: {item.variant}
                    </div>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="tnum text-[0.9375rem] font-semibold">
                    {moneyExact(item.unitPrice * item.quantity)}
                  </div>
                  <div className="tnum text-[0.75rem] text-muted">
                    {item.quantity} × {moneyExact(item.unitPrice)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/motos" className="btn btn-outline">
              Continuar comprando
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline"
            >
              <Printer className="size-4" strokeWidth={1.8} />
              Imprimir
            </button>
          </div>
        </div>

        <aside className="space-y-10">
          <div className="border-t-2 border-ink pt-7">
            <h2 className="t-h3">Resumo</h2>
            <dl className="mt-6 space-y-3 text-[0.875rem]">
              <div className="flex justify-between">
                <dt className="text-muted">Código</dt>
                <dd className="tnum font-semibold">{order.code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Data</dt>
                <dd className="tnum">{shortDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Pagamento</dt>
                <dd>{paymentLabels[order.payment] ?? order.payment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Status</dt>
                <dd className="text-orange capitalize">{order.status}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tnum">{moneyExact(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Frete</dt>
                <dd className="tnum">
                  {order.shipping ? moneyExact(order.shipping) : "Incluído"}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-5">
                <dt className="label">Total</dt>
                <dd className="display tnum text-[1.5rem] leading-none">
                  {moneyExact(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-line pt-7">
            <div className="label text-muted">Entrega</div>
            <p className="mt-4 text-[0.875rem] leading-relaxed">
              {order.customerName}
              <br />
              {order.address}
              <br />
              {order.city} — {order.state}, {order.zip}
              <br />
              <span className="tnum text-muted">{order.phone}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
