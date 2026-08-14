const STORAGE_KEY = "iron-oak-cart-key";

function createKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cart-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Stable per-browser cart identifier, allowing guest checkout. */
export function getCartKey(): string {
  if (typeof window === "undefined") return "server";
  let key = window.localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = createKey();
    window.localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}
