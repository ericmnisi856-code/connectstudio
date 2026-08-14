import * as React from "react";
import { products, type Product } from "./catalog";

export type CartLine = { slug: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  onAddToCart?: () => void; // Callback for add to cart events
  setOnAddToCart: (callback: () => void) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "studio-connect-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [onAddToCart, setOnAddToCart] = React.useState<(() => void) | undefined>();

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = React.useMemo<CartContextValue>(() => {
    const items = lines
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        return product ? { product, qty: line.qty } : null;
      })
      .filter((v): v is { product: Product; qty: number } => v !== null);

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const vat = Math.round(subtotal * 0.15);
    const shipping = subtotal === 0 || subtotal > 5000 ? 0 : 350;

    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal,
      vat,
      shipping,
      total: subtotal + vat + shipping,
      add: (slug, qty = 1) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === slug);
          if (existing)
            return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
          return [...prev, { slug, qty }];
        });
        // Trigger add to cart callback (for confetti + cart open)
        onAddToCart?.();
      },
      setQty: (slug, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
      onAddToCart,
      setOnAddToCart: (callback) => setOnAddToCart(() => callback),
    };
  }, [lines, onAddToCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
