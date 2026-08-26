import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductWizard } from "./product-wizard";
import { formatZAR } from "@/lib/catalog";
import { Plus, Search, Edit, Trash2, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NewProductManagerProps {
  products: any[];
  onRefresh: () => void;
}

export function NewProductManager({ products, onRefresh }: NewProductManagerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showWizard, setShowWizard] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

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

  const handleWizardSuccess = () => {
    setShowWizard(false);
    setEditingProduct(null);
    onRefresh();
    toast.success("Product list updated!");
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      // Use Netlify Blobs API for delete
      const response = await fetch('/api/products/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: product.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete product: ${response.statusText}`);
      }

      toast.success(`"${product.name}" deleted successfully`);
      onRefresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product catalog with the improved wizard interface
          </p>
        </div>
        
        <Button
          onClick={() => setShowWizard(true)}
          className="bg-emerald-gradient text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, model, or category..."
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            {products.length} Total Products
          </span>
          {searchQuery && (
            <span>{filteredProducts.length} Filtered Results</span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {products.length === 0 ? (
              <>
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start building your product catalog by adding your first product.
                </p>
                <Button
                  onClick={() => setShowWizard(true)}
                  className="bg-emerald-gradient text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or clear the search.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {product.model} • {product.category}
                    </CardDescription>
                  </div>
                  
                  {product.badge && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0 ml-2">
                      {product.badge}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {product.image && (
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      {formatZAR(product.price)}
                    </span>
                    {product.compareAt && product.compareAt > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatZAR(product.compareAt)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Stock: {product.stock}</span>
                    <span>★ {product.rating} ({product.reviews})</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.tagline}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowWizard(true);
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <ProductWizard
            product={editingProduct}
            onSuccess={handleWizardSuccess}
            onCancel={() => {
              setShowWizard(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}