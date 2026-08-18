import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SimpleProductAdderProps {
  onProductAdded: () => void;
}

export function SimpleProductAdder({ onProductAdded }: SimpleProductAdderProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleQuickAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Create simple product object - no arrays to avoid validation issues
      const product = {
        slug: formData.get("slug") as string,
        name: formData.get("name") as string,
        model: formData.get("model") as string,
        category: formData.get("category") as string,
        tagline: formData.get("tagline") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        rating: 4.5, // Default rating
        reviews: 0, // Default reviews
        // Simple arrays to avoid validation issues
        highlights: [],
        specs: [],
        useCases: [],
      };

      console.log("Quick adding product:", product);

      // Call direct Netlify function to bypass TanStack validation
      const response = await fetch('/.netlify/functions/create-product-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create product: ${errorText}`);
      }

      const result = await response.json();
      console.log("Product created:", result);
      
      toast.success("Product added successfully!");
      onProductAdded();
      
      // Reset form
      e.currentTarget.reset();
      
    } catch (error: any) {
      console.error("Quick add error:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Add Product</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Simple product creation without complex validation. You can edit details later.
      </p>
      
      <form onSubmit={handleQuickAdd} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="quick-name">Product Name *</Label>
            <Input
              id="quick-name"
              name="name"
              required
              placeholder="e.g. Reyee EG105G-V2 Gateway"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="quick-model">Model *</Label>
            <Input
              id="quick-model"
              name="model"
              required
              placeholder="e.g. RG-EG105G-V2"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="quick-slug">Slug *</Label>
            <Input
              id="quick-slug"
              name="slug"
              required
              placeholder="e.g. rg-eg105g-v2"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="quick-category">Category *</Label>
            <select
              id="quick-category"
              name="category"
              required
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              <option value="eg">EG Series Gateways</option>
              <option value="wireless">Wireless Routers</option>
              <option value="nbr">NBR Security Routers</option>
            </select>
          </div>
          <div>
            <Label htmlFor="quick-price">Price (ZAR) *</Label>
            <Input
              id="quick-price"
              name="price"
              type="number"
              required
              placeholder="2199"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="quick-stock">Stock *</Label>
            <Input
              id="quick-stock"
              name="stock"
              type="number"
              required
              placeholder="10"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="quick-tagline">Tagline *</Label>
          <Input
            id="quick-tagline"
            name="tagline"
            required
            placeholder="e.g. 5-port desktop cloud gateway for up to 100 clients"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="quick-description">Description *</Label>
          <Textarea
            id="quick-description"
            name="description"
            required
            rows={3}
            placeholder="Describe the product features and benefits..."
            className="mt-1.5"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-gradient text-primary-foreground hover:opacity-90"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}