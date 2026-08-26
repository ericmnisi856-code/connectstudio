import * as React from "react";
import { Pencil, Trash2, Plus, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, formatZAR, type Product } from "@/lib/catalog";

type ProductFormData = Omit<Product, "slug"> & { slug?: string; image?: string };

interface ProductManagementProps {
  products: Product[];
  onProductCreate: (product: ProductFormData) => Promise<void>;
  onProductUpdate: (slug: string, product: ProductFormData) => Promise<void>;
  onProductDelete: (slug: string) => Promise<void>;
}

export function ProductManagement({
  products,
  onProductCreate,
  onProductUpdate,
  onProductDelete,
}: ProductManagementProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  async function handleCreate(product: ProductFormData) {
    try {
      await onProductCreate(product);
      setIsCreateOpen(false);
      toast.success("Product created successfully");
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    }
  }

  async function handleUpdate(slug: string, product: ProductFormData) {
    try {
      await onProductUpdate(slug, product);
      setIsEditOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await onProductDelete(slug);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-gradient text-primary-foreground hover:opacity-90">
              <Plus className="mr-2 size-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm key="create" onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.slug}
            className="rounded-xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {product.image && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{product.model}</p>
                <p className="mt-2 text-lg font-bold text-gradient">
                  {formatZAR(product.price)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Stock: {product.stock} | Rating: {product.rating}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Dialog
                open={isEditOpen && selectedProduct?.slug === product.slug}
                onOpenChange={(open) => {
                  setIsEditOpen(open);
                  if (!open) setSelectedProduct(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Pencil className="mr-1 size-3" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                  </DialogHeader>
                  {selectedProduct && (
                    <ProductForm
                      key={selectedProduct.slug}
                      product={selectedProduct}
                      onSubmit={(data) => handleUpdate(product.slug, data)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product.slug)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  onSubmit,
}: {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
}) {
  const [highlights, setHighlights] = React.useState<string[]>(
    product?.highlights || [""]
  );
  const [useCases, setUseCases] = React.useState<string[]>(
    product?.useCases || [""]
  );
  const [specs, setSpecs] = React.useState<{ label: string; value: string }[]>(
    product?.specs || [{ label: "", value: "" }]
  );
  const [imagePreview, setImagePreview] = React.useState<string | null>(product?.image || null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Update form state when product changes (for edit mode)
  React.useEffect(() => {
    if (product) {
      setHighlights(product.highlights || [""]);
      setUseCases(product.useCases || [""]);
      setSpecs(product.specs || [{ label: "", value: "" }]);
      setImagePreview(product.image || null);
    } else {
      // Reset for create mode
      setHighlights([""]);
      setUseCases([""]);
      setSpecs([{ label: "", value: "" }]);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const compareAtValue = formData.get("compareAt");
    const badgeValue = formData.get("badge");
    
    const data: ProductFormData = {
      slug: formData.get("slug") as string,
      name: formData.get("name") as string,
      model: formData.get("model") as string,
      category: formData.get("category") as any,
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      compareAt: compareAtValue ? Number(compareAtValue) : undefined,
      stock: Number(formData.get("stock")),
      rating: Number(formData.get("rating")),
      reviews: Number(formData.get("reviews")),
      badge: badgeValue && badgeValue !== "" ? (badgeValue as string) : undefined,
      highlights: highlights.filter((h) => h.trim()),
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      useCases: useCases.filter((u) => u.trim()),
      image: imagePreview || undefined,
    };

    console.log("FORM DEBUG - About to submit:", JSON.stringify(data, null, 2));
    console.log("FORM DEBUG - specs type:", Array.isArray(data.specs) ? "array" : typeof data.specs);
    console.log("FORM DEBUG - specs value:", data.specs);

    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productImage">Product Image</Label>
        <div className="mt-2 space-y-3">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-32 w-auto rounded-lg border-2 border-primary/20 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <span className="text-xs text-muted-foreground">Max 5MB (JPG, PNG, WebP)</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="productImage"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            defaultValue={product?.model}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            required
            className="mt-1.5"
            placeholder="rg-eg105g-v2"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select name="category" defaultValue={product?.category || undefined} required>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline *</Label>
        <Input
          id="tagline"
          name="tagline"
          defaultValue={product?.tagline}
          required
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description}
          required
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="price">Price (ZAR) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            defaultValue={product?.price}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="compareAt">Compare At</Label>
          <Input
            id="compareAt"
            name="compareAt"
            type="number"
            defaultValue={product?.compareAt}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="badge">Badge</Label>
          <Input
            id="badge"
            name="badge"
            defaultValue={product?.badge}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="rating">Rating (0-5) *</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={product?.rating}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="reviews">Reviews *</Label>
          <Input
            id="reviews"
            name="reviews"
            type="number"
            defaultValue={product?.reviews}
            required
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label>Highlights</Label>
        {highlights.map((highlight, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <Input
              value={highlight}
              onChange={(e) => {
                const newHighlights = [...highlights];
                newHighlights[i] = e.target.value;
                setHighlights(newHighlights);
              }}
              placeholder="Enter highlight"
            />
            {highlights.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setHighlights([...highlights, ""])}
        >
          <Plus className="mr-1 size-3" />
          Add Highlight
        </Button>
      </div>

      <div>
        <Label>Use Cases</Label>
        {useCases.map((useCase, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <Input
              value={useCase}
              onChange={(e) => {
                const newUseCases = [...useCases];
                newUseCases[i] = e.target.value;
                setUseCases(newUseCases);
              }}
              placeholder="Enter use case"
            />
            {useCases.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUseCases(useCases.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setUseCases([...useCases, ""])}
        >
          <Plus className="mr-1 size-3" />
          Add Use Case
        </Button>
      </div>

      <div>
        <Label>Specifications</Label>
        {specs.map((spec, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <Input
              value={spec.label}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[i].label = e.target.value;
                setSpecs(newSpecs);
              }}
              placeholder="Label (e.g., Ports)"
              className="flex-1"
            />
            <Input
              value={spec.value}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[i].value = e.target.value;
                setSpecs(newSpecs);
              }}
              placeholder="Value"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setSpecs([...specs, { label: "", value: "" }])}
        >
          <Plus className="mr-1 size-3" />
          Add Spec
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="bg-emerald-gradient text-primary-foreground hover:opacity-90">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
