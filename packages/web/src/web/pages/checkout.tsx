import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Landmark, Loader2, QrCode } from "lucide-react";
import { useCart, getCartKey } from "../queries/cart";
import { useCreateOrder } from "../queries/checkout";
import { authClient } from "../lib/auth";
import { moneyExact } from "../lib/format";

type Payment = "pix" | "cartao" | "financiamento";

const PAYMENTS: { value: Payment; label: string; hint: string; icon: typeof QrCode }[] =
  [
    { value: "pix", label: "Pix", hint: "5% de desconto na confirmação", icon: QrCode },
    {
      value: "cartao",
      label: "Cartão de crédito",
      hint: "Até 12x sem juros para acessórios",
      icon: CreditCard,
    },
    {
      value: "financiamento",
      label: "Financiamento",
      hint: "Análise em até 24h úteis",
      icon: Landmark,
    },
  ];

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const cart = useCart();
  const createOrder = useCreateOrder();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    document: "",
    address: "",
    city: "",
    state: "SP",
    zip: "",
  });
  const [payment, setPayment] = useState<Payment>("pix");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    setForm((prev) => ({
      ...prev,
      customerName: prev.customerName || session.user.name,
      email: prev.email || session.user.email,
    }));
  }, [session]);

  const empty = !cart.isLoading && !cart.data?.lines.length;

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    createOrder.mutate(
      { cartKey: getCartKey(), payment, ...form },
      {
        onSuccess: (data) => navigate(`/pedido/${data.code}`),
        onError: (err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível concluir o pedido. Revise os dados.",
          ),
      },
    );
  }

  if (empty) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="t-h2">Carrinho vazio</h1>
        <p className="mt-6 text-[0.9375rem] text-muted">
          Adicione um item antes de finalizar a compra.
        </p>
        <Link to="/motos" className="btn btn-primary mt-9">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-14 md:py-20">
      <Link
        to="/carrinho"
        className="ulink label flex items-center gap-2 text-muted"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Voltar ao carrinho
      </Link>

      <h1 className="t-h2 mt-6">Checkout</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <form onSubmit={submit} className="space-y-14">
          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">01</span> Seus dados
            </legend>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <label className="block">
                <span className="label text-muted">Nome completo</span>
                <input
                  aria-label="Nome completo"
                  required
                  minLength={3}
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className="field mt-2"
                  placeholder="Ruan Carlos Almeida"
                />
              </label>
              <label className="block">
                <span className="label text-muted">CPF ou CNPJ</span>
                <input
                  aria-label="CPF ou CNPJ"
                  required
                  minLength={6}
                  value={form.document}
                  onChange={(e) => update("document", e.target.value)}
                  className="field mt-2"
                  placeholder="000.000.000-00"
                />
              </label>
              <label className="block">
                <span className="label text-muted">E-mail</span>
                <input
                  aria-label="E-mail"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="field mt-2"
                  placeholder="voce@email.com"
                />
              </label>
              <label className="block">
                <span className="label text-muted">Telefone</span>
                <input
                  aria-label="Telefone"
                  required
                  minLength={8}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="field mt-2"
                  placeholder="(11) 99999-0000"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">02</span> Entrega
            </legend>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label text-muted">Endereço</span>
                <input
                  aria-label="Endereço"
                  required
                  minLength={5}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="field mt-2"
                  placeholder="Rua, número, complemento"
                />
              </label>
              <label className="block">
                <span className="label text-muted">Cidade</span>
                <input
                  aria-label="Cidade"
                  required
                  minLength={2}
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="field mt-2"
                  placeholder="São Paulo"
                />
              </label>
              <div className="grid grid-cols-2 gap-7">
                <label className="block">
                  <span className="label text-muted">UF</span>
                  <select
                    aria-label="UF"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="field mt-2"
                  >
                    {STATES.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="label text-muted">CEP</span>
                  <input
                    aria-label="CEP"
                    required
                    minLength={5}
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className="field mt-2"
                    placeholder="01000-000"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">03</span> Pagamento
            </legend>
            <div className="mt-7 space-y-3">
              {PAYMENTS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-4 border p-5 transition-colors ${
                    payment === option.value
                      ? "border-ink bg-bone-2"
                      : "border-line hover:border-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    aria-label={option.label}
                    className="sr-only"
                    checked={payment === option.value}
                    onChange={() => setPayment(option.value)}
                  />
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                      payment === option.value ? "border-orange" : "border-muted"
                    }`}
                  >
                    {payment === option.value ? (
                      <span className="size-2 rounded-full bg-orange" />
                    ) : null}
                  </span>
                  <option.icon className="size-4 text-muted" strokeWidth={1.8} />
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-semibold">
                      {option.label}
                    </span>
                    <span className="block text-[0.8125rem] text-muted">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="border-l-2 border-orange bg-bone-2 p-4 text-[0.875rem] text-ink">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={createOrder.isPending || cart.isLoading}
            className="btn btn-primary w-full lg:hidden"
          >
            {createOrder.isPending ? (
              <>
                <Loader2 className="spin size-4" strokeWidth={2} />
                Processando
              </>
            ) : (
              "Confirmar pedido"
            )}
          </button>
        </form>

        <aside>
          <div className="sticky top-[96px] border-t-2 border-ink pt-7">
            <h2 className="t-h3">Pedido</h2>

            <ul className="mt-7 space-y-5">
              {cart.data?.lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="size-16 shrink-0 overflow-hidden bg-bone-2">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      className={`size-full object-cover ${
                        line.kind === "moto" ? "multiply" : ""
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.875rem] font-semibold">
                      {line.name}
                    </div>
                    <div className="tnum text-[0.75rem] text-muted">
                      {line.quantity} × {moneyExact(line.unitPrice)}
                    </div>
                  </div>
                  <div className="tnum text-[0.875rem] font-semibold whitespace-nowrap">
                    {moneyExact(line.total)}
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.875rem]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tnum">{moneyExact(cart.data?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Frete</dt>
                <dd className="tnum">
                  {cart.data?.shipping
                    ? moneyExact(cart.data.shipping)
                    : "Incluído"}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-5">
                <dt className="label">Total</dt>
                <dd className="display tnum text-[1.5rem] leading-none">
                  {moneyExact(cart.data?.total ?? 0)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={createOrder.isPending || cart.isLoading}
              onClick={() =>
                document
                  .querySelector<HTMLFormElement>("form")
                  ?.requestSubmit()
              }
              className="btn btn-primary mt-8 hidden w-full lg:inline-flex"
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="spin size-4" strokeWidth={2} />
                  Processando
                </>
              ) : (
                "Confirmar pedido"
              )}
            </button>

            <p className="mt-6 text-[0.75rem] leading-relaxed text-muted">
              Ao confirmar você aceita os termos da loja. Este é um ambiente
              demonstrativo — nenhum pagamento é processado.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
