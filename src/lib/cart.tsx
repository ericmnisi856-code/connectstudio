import * as React from "react";
import { useQuery } from "@tanstack/react-query";

export type CartLine = { slug: string; qty: number };

export type ShippingMethod = 'standard' | 'express' | 'pickup';

type Product = {
  slug: string;
  name: string;
  model: string;
  price: number;
  compareAt?: number;
  stock: number;
  rating: number;
  reviews: number;
  [key: string]: any;
};

type CartContextValue = {
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  vat: number;
  shipping: number;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
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
const SHIPPING_METHOD_KEY = "studio-connect-shipping-method";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [shippingMethod, setShippingMethodState] = React.useState<ShippingMethod>('standard');
  const [onAddToCart, setOnAddToCart] = React.useState<(() => void) | undefined>();

  // Fetch products from API
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch('/api/products/list');
      if (!response.ok) return [];
      return response.json();
    },
    staleTime: 5000,
  });

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      
      const savedMethod = window.localStorage.getItem(SHIPPING_METHOD_KEY) as ShippingMethod | null;
      if (savedMethod) setShippingMethodState(savedMethod);
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

  React.useEffect(() => {
    try {
      window.localStorage.setItem(SHIPPING_METHOD_KEY, shippingMethod);
    } catch {
      /* ignore */
    }
  }, [shippingMethod]);

  const value = React.useMemo<CartContextValue>(() => {
    const items = lines
      .map((line) => {
        const product = products.find((p: Product) => p.slug === line.slug);
        return product ? { product, qty: line.qty } : null;
      })
      .filter((v): v is { product: Product; qty: number } => v !== null);

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const vat = 0; // No VAT charge
    
    // Calculate shipping based on selected method
    let shipping = 0;
    if (subtotal > 0) {
      switch (shippingMethod) {
        case 'standard':
          shipping = 80;
          break;
        case 'express':
          shipping = 90;
          break;
        case 'pickup':
          shipping = 0;
          break;
      }
    }

    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal,
      vat,
      shipping,
      shippingMethod,
      setShippingMethod: setShippingMethodState,
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
  }, [lines, products, shippingMethod, onAddToCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
