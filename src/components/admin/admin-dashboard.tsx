import { useMemo, useState } from "react";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Loader2,
  Package,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatZAR, products as catalog } from "@/lib/catalog";

export const STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type Status = (typeof STATUSES)[number];

export type OrderItem = {
  slug: string;
  name: string;
  model: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  order_number: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  notes: string | null;
  items: unknown;
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
  created_at: string;
};

function itemsOf(order: Order): OrderItem[] {
  return (order.items as OrderItem[] | null) ?? [];
}

const PAID_STATUSES = new Set(["processing", "shipped", "delivered"]);

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="font-display text-2xl font-bold">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({
  orders,
  isLoading,
  onStatusChange,
}: {
  orders: Order[];
  isLoading: boolean;
  onStatusChange: (vars: { id: string; status: Status }) => void;
}) {
  const [tab, setTab] = useState("overview");

  const metrics = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const paid = orders
      .filter((o) => PAID_STATUSES.has(o.status))
      .reduce((sum, o) => sum + o.total, 0);
    const outstanding = orders
      .filter((o) => o.status === "pending")
      .reduce((sum, o) => sum + o.total, 0);
    const vat = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.vat, 0);
    const counts = STATUSES.map((s) => ({
      status: s,
      count: orders.filter((o) => o.status === s).length,
    }));
    const units = orders
      .filter((o) => o.status !== "cancelled")
      .flatMap(itemsOf)
      .reduce((sum, i) => sum + i.qty, 0);

    const byMonth = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + o.total);
    }
    const months = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-12);

    const bySlug = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      for (const i of itemsOf(o)) {
        const prev = bySlug.get(i.slug) ?? { name: i.name, qty: 0, revenue: 0 };
        prev.qty += i.qty;
        prev.revenue += i.qty * i.price;
        bySlug.set(i.slug, prev);
      }
    }
    const topProducts = [...bySlug.entries()]
      .map(([slug, v]) => ({ slug, ...v }))
      .sort((a, b) => b.revenue - a.revenue);

    const byProvince = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      byProvince.set(o.province, (byProvince.get(o.province) ?? 0) + o.total);
    }

    return {
      revenue,
      paid,
      outstanding,
      vat,
      counts,
      units,
      months,
      topProducts,
      provinces: [...byProvince.entries()].sort((a, b) => b[1] - a[1]),
      aov: orders.length ? Math.round(revenue / Math.max(1, orders.length)) : 0,
    };
  }, [orders]);

  const soldBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of metrics.topProducts) map.set(p.slug, p.qty);
    return map;
  }, [metrics.topProducts]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxMonth = Math.max(1, ...metrics.months.map(([, v]) => v));

  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-8">
      <TabsList className="flex w-full flex-wrap justify-start gap-1">
        <TabsTrigger value="overview">
          <LayoutDashboard className="mr-2 size-4" /> Overview
        </TabsTrigger>
        <TabsTrigger value="orders">
          <Inbox className="mr-2 size-4" /> Orders
        </TabsTrigger>
        <TabsTrigger value="reports">
          <BarChart3 className="mr-2 size-4" /> Reports
        </TabsTrigger>
        <TabsTrigger value="payments">
          <CreditCard className="mr-2 size-4" /> Payments
        </TabsTrigger>
        <TabsTrigger value="products">
          <Boxes className="mr-2 size-4" /> Products
        </TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Gross revenue"
            value={formatZAR(metrics.revenue)}
            hint="Excludes cancelled orders"
            icon={TrendingUp}
          />
          <Stat label="Orders" value={String(orders.length)} hint={`${metrics.units} units sold`} icon={Inbox} />
          <Stat label="Average order" value={formatZAR(metrics.aov)} icon={BarChart3} />
          <Stat
            label="Awaiting payment"
            value={formatZAR(metrics.outstanding)}
            hint="Pending orders"
            icon={CreditCard}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.counts.map(({ status, count }) => (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <Progress
                    className="mt-2"
                    value={orders.length ? (count / orders.length) * 100 : 0}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.order_number}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.full_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {o.status}
                    </Badge>
                    <span className="font-semibold">{formatZAR(o.total)}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Orders */}
      <TabsContent value="orders" className="mt-6">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <Inbox className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New orders placed through checkout will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-lg font-bold">{order.order_number}</h2>
                      <Badge variant="secondary" className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("en-ZA")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl font-bold">
                      {formatZAR(order.total)}
                    </span>
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        onStatusChange({ id: order.id, status: value as Status })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Customer
                    </h3>
                    <p className="mt-2 text-sm">
                      {order.full_name}
                      {order.company ? ` · ${order.company}` : ""}
                      <br />
                      {order.email}
                      <br />
                      {order.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Delivery
                    </h3>
                    <address className="mt-2 text-sm not-italic">
                      {order.address}
                      <br />
                      {order.city}, {order.province} {order.postal_code}
                    </address>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Items
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      {itemsOf(order).map((item) => (
                        <li key={item.slug}>
                          {item.qty} × {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.notes ? (
                  <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                    {order.notes}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Reports */}
      <TabsContent value="reports" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by month</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.months.length === 0 ? (
              <p className="text-sm text-muted-foreground">No revenue recorded yet.</p>
            ) : (
              <div className="flex h-56 items-end gap-3">
                {metrics.months.map(([month, value]) => (
                  <div key={month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium">{formatZAR(value)}</span>
                    <div
                      className="w-full rounded-t-md bg-primary"
                      style={{ height: `${Math.max(4, (value / maxMonth) * 100)}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{month}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Best sellers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.topProducts.slice(0, 8).map((p) => (
                <div key={p.slug} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-3">{p.name}</span>
                  <span className="whitespace-nowrap text-muted-foreground">
                    {p.qty} · {formatZAR(p.revenue)}
                  </span>
                </div>
              ))}
              {metrics.topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sales data yet.</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue by province</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.provinces.map(([province, value]) => (
                <div key={province} className="flex items-center justify-between text-sm">
                  <span>{province}</span>
                  <span className="text-muted-foreground">{formatZAR(value)}</span>
                </div>
              ))}
              {metrics.provinces.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sales data yet.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Payments */}
      <TabsContent value="payments" className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Collected" value={formatZAR(metrics.paid)} hint="Confirmed orders" icon={CreditCard} />
          <Stat label="Awaiting payment" value={formatZAR(metrics.outstanding)} icon={Loader2} />
          <Stat label="VAT collected" value={formatZAR(metrics.vat)} icon={BarChart3} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment ledger</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Subtotal</th>
                  <th className="py-2 pr-4">VAT</th>
                  <th className="py-2 pr-4">Shipping</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">State</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{o.order_number}</td>
                    <td className="py-2 pr-4">{o.full_name}</td>
                    <td className="py-2 pr-4">{formatZAR(o.subtotal)}</td>
                    <td className="py-2 pr-4">{formatZAR(o.vat)}</td>
                    <td className="py-2 pr-4">{formatZAR(o.shipping)}</td>
                    <td className="py-2 pr-4 font-semibold">{formatZAR(o.total)}</td>
                    <td className="py-2">
                      <Badge
                        variant={
                          PAID_STATUSES.has(o.status)
                            ? "default"
                            : o.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {PAID_STATUSES.has(o.status)
                          ? "Paid"
                          : o.status === "cancelled"
                            ? "Void"
                            : "Awaiting"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Products */}
      <TabsContent value="products" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Catalog &amp; stock</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Sold</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((p) => {
                  const sold = soldBySlug.get(p.slug) ?? 0;
                  const remaining = p.stock - sold;
                  return (
                    <tr key={p.slug} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{p.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{p.model}</td>
                      <td className="py-2 pr-4">{formatZAR(p.price)}</td>
                      <td className="py-2 pr-4">{Math.max(0, remaining)}</td>
                      <td className="py-2 pr-4">{sold}</td>
                      <td className="py-2">
                        <Badge variant={remaining > 5 ? "secondary" : "destructive"}>
                          {remaining > 5 ? "In stock" : remaining > 0 ? "Low stock" : "Sold out"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="size-3.5" />
              Stock reflects catalog levels minus units sold. Ask to move products into the
              database if you want to edit pricing and stock from here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function useStatusMutation(
  setStatus: (args: { data: { id: string; status: Status } }) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: Status }) => setStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Order status updated");
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Could not update the order"),
  });
}
