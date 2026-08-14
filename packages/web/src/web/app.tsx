import { Link, Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";
import { Layout } from "./components/layout";
import { ProtectedRoute } from "./components/protected-route";
import Index from "./pages/index";
import MotorcyclesPage from "./pages/motorcycles";
import MotorcyclePage from "./pages/motorcycle";
import PartsPage from "./pages/parts";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrderPage from "./pages/order";
import TestRidePage from "./pages/test-ride";
import BlogPage from "./pages/blog";
import PostPage from "./pages/post";
import ContactPage from "./pages/contact";
import SignInPage from "./pages/sign-in";
import AccountPage from "./pages/account";

function NotFound() {
  return (
    <div className="shell py-32 text-center">
      <div className="display text-[clamp(4rem,14vw,10rem)] leading-none">404</div>
      <h1 className="t-h3 mt-6">Essa rota não existe</h1>
      <p className="mx-auto mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
        A página que você procurou saiu para rodar. Volte ao showroom.
      </p>
      <Link to="/" className="btn btn-primary mt-9">
        Ir para a home
      </Link>
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Layout>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/motos" component={MotorcyclesPage} />
          <Route path="/motos/:slug" component={MotorcyclePage} />
          <Route path="/acessorios" component={PartsPage} />
          <Route path="/carrinho" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/pedido/:code" component={OrderPage} />
          <Route path="/test-ride" component={TestRidePage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={PostPage} />
          <Route path="/contato" component={ContactPage} />
          <Route path="/entrar" component={SignInPage} />
          <Route path="/minha-conta">
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
