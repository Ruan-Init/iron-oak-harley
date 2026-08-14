import { Link } from "wouter";
import { CalendarClock, LogOut, Package } from "lucide-react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { authClient } from "../lib/auth";
import { useMyOrders, useMyTestRides } from "../queries/account";
import { longDate, moneyExact, paymentLabels, shortDate } from "../lib/format";

export default function AccountPage() {
  const { data: session } = authClient.useSession();
  const enabled = Boolean(session?.user);
  const orders = useMyOrders(enabled);
  const rides = useMyTestRides(enabled);
  const firstName = session?.user.name?.split(" ")[0] ?? "piloto";

  return (
    <>
      <PageHero
        eyebrow="Minha conta"
        title={<>Olá, {firstName}</>}
        intro={`Sessão ativa em ${session?.user.email ?? ""}. Aqui ficam seus pedidos e test rides.`}
      >
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => authClient.signOut()}
        >
          <LogOut className="size-4" />
          Sair da conta
        </button>
      </PageHero>

      <section className="shell py-16 md:py-20">
        <div className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
          <Package className="size-4 text-orange" />
          Pedidos
        </div>

        {orders.isLoading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-28 w-full" />
            ))}
          </div>
        ) : orders.data?.length ? (
          <ul className="mt-8 space-y-6">
            {orders.data.map((order, i) => (
              <Reveal as="li" key={order.id} delay={i * 60}>
                <div className="border border-line bg-bone-2 p-7 md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                      <div className="label text-muted">Código</div>
                      <div className="display tnum mt-2 text-[1.25rem]">
                        {order.code}
                      </div>
                      <div className="label mt-3 text-muted">
                        {shortDate(order.createdAt)} ·{" "}
                        {paymentLabels[order.payment] ?? order.payment}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="label text-muted">Total</div>
                      <div className="display tnum mt-2 text-[1.25rem]">
                        {moneyExact(order.total)}
                      </div>
                      <div className="label mt-3 text-orange">
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <ul className="mt-7 divide-y divide-line border-t border-line">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-4 py-4">
                        <div className="size-14 shrink-0 overflow-hidden bg-bone">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`h-full w-full object-cover ${
                              item.kind === "moto" ? "multiply" : ""
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[0.9375rem] text-ink">
                            {item.name}
                          </div>
                          <div className="label mt-1 text-muted">
                            {item.variant ? `${item.variant} · ` : ""}
                            {item.quantity}x {moneyExact(item.unitPrice)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/pedido/${order.code}`}
                    className="ulink label mt-7 inline-block text-ink"
                  >
                    Ver detalhes do pedido
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border border-line border-dashed p-10 text-center">
            <p className="text-[0.9375rem] text-muted">
              Você ainda não fez pedidos.
            </p>
            <Link to="/motos" className="btn btn-primary mt-7">
              Ver o catálogo
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-line bg-bone-2 py-16 md:py-20">
        <div className="shell">
          <div className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
            <CalendarClock className="size-4 text-orange" />
            Test rides
          </div>

          {rides.isLoading ? (
            <div className="mt-8 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full" />
              ))}
            </div>
          ) : rides.data?.length ? (
            <ul className="mt-8 divide-y divide-line border-t border-line">
              {rides.data.map((ride, i) => (
                <Reveal as="li" key={ride.id} delay={i * 60}>
                  <div className="grid gap-3 py-6 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center md:gap-8">
                    <div className="t-h3 text-[1.0625rem]">
                      {ride.motorcycle}
                    </div>
                    <div className="text-[0.875rem] text-muted">
                      {ride.dealer}
                    </div>
                    <div className="text-[0.875rem] text-muted">
                      {longDate(ride.date)} · {ride.time}
                    </div>
                    <div className="label text-orange">{ride.status}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mt-8 border border-line border-dashed p-10 text-center">
              <p className="text-[0.9375rem] text-muted">
                Nenhum test ride agendado.
              </p>
              <Link to="/test-ride" className="btn btn-primary mt-7">
                Agendar test ride
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
