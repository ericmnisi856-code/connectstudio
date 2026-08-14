import type { Product } from "./catalog";

export type OrderItem = {
  slug: string;
  name: string;
  model: string;
  price: number;
  qty: number;
};

export type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  company?: string | undefined;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string | undefined;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
};

const ORDERS_KEY = "studio-connect-orders";

export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SC-${timestamp}-${random}`;
}

export function buildOrderItems(
  items: { product: Product; qty: number }[],
): OrderItem[] {
  return items.map(({ product, qty }) => ({
    slug: product.slug,
    name: product.name,
    model: product.model,
    price: product.price,
    qty,
  }));
}

export function saveOrder(order: Order): void {
  try {
    const existing = getOrders();
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
  } catch {
    /* ignore */
  }
}

export function getOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrder(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}
