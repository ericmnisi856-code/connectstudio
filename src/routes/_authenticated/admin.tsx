import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldAlert, LogOut, Package } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminDashboard,
  useStatusMutation,
  type Order,
} from "@/components/admin/admin-dashboard";
import { ProductManagement } from "@/components/admin/product-management";
import { getIsAdmin, listOrders, updateOrderStatus } from "@/lib/orders.functions";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products.functions";
import { products, type Product } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Studio Connect" },
      {
        name: "description",
        content:
          "Store overview, sales reports, payments and product stock for Studio Connect.",
      },
      { property: "og:title", content: "Admin Dashboard | Studio Connect" },
      {
        property: "og:description",
        content: "Store overview, reports, payments and product stock.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchIsAdmin = useServerFn(getIsAdmin);
  const fetchOrders = useServerFn(listOrders);
  const fetchProducts = useServerFn(getProducts);
  const setStatus = useServerFn(updateOrderStatus);
  const addProduct = useServerFn(createProduct);
  const editProduct = useServerFn(updateProduct);
  const removeProduct = useServerFn(deleteProduct);

  const adminQuery = useQuery({ queryKey: ["is-admin"], queryFn: () => fetchIsAdmin() });
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
    enabled: adminQuery.data?.isAdmin === true,
  });
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    enabled: adminQuery.data?.isAdmin === true,
  });

  const statusMutation = useStatusMutation(setStatus as never);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  async function handleProductCreate(product: any) {
    try {
      await addProduct({ data: product });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  }

  async function handleProductUpdate(slug: string, product: any) {
    try {
      // Find product by slug to get its ID
      const productToUpdate = productsQuery.data?.find((p: any) => p.slug === slug);
      if (!productToUpdate?.id) {
        throw new Error("Product not found");
      }
      await editProduct({ data: { id: productToUpdate.id, updates: product } });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  }

  async function handleProductDelete(slug: string) {
    try {
      // Find product by slug to get its ID
      const productToDelete = productsQuery.data?.find((p: any) => p.slug === slug);
      if (!productToDelete?.id) {
        throw new Error("Product not found");
      }
      await removeProduct({ data: { id: productToDelete.id } });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  }

  if (adminQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!adminQuery.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is signed in but does not have admin permissions yet.
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </Button>
      </div>
    );
  }

  const orders = (ordersQuery.data ?? []) as unknown as Order[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Admin dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Store overview, orders, and product management
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 size-4" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <AdminDashboard
            orders={orders}
            isLoading={ordersQuery.isLoading}
            onStatusChange={(vars) => statusMutation.mutate(vars)}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductManagement
            products={productsQuery.data ?? []}
            onProductCreate={handleProductCreate}
            onProductUpdate={handleProductUpdate}
            onProductDelete={handleProductDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
