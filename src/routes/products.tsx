import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

export const productSearchSchema = z.object({
  category: z.enum(["eg", "wireless", "nbr"]).optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "rating"]).optional(),
  q: z.string().optional(),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

export const Route = createFileRoute("/products")({
  validateSearch: productSearchSchema,
  component: () => <Outlet />,
});
