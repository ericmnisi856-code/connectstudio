import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Package, Loader2 } from "lucide-react";

interface ProductWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProductData {
  // Step 1: Basic Info
  name: string;
  model: string;
  slug: string;
  category: string;
  
  // Step 2: Details  
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  stock: number;
  
  // Step 3: Advanced
  badge?: string;
  image?: string;
  rating: number;
  reviews: number;
}

export function ProductWizard({ onSuccess, onCancel }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [productData, setProductData] = React.useState<ProductData>({
    name: '',
    model: '',
    slug: '',
    category: '',
    tagline: '',
    description: '',
    price: 0,
    stock: 0,
    rating: 4.5,
    reviews: 0,
  });

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name, model, category' },
    { number: 2, title: 'Details', description: 'Pricing, description, stock' },
    { number: 3, title: 'Advanced', description: 'Images, ratings, badges' },
  ];

  const updateData = (field: keyof ProductData, value: string | number) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  React.useEffect(() => {
    if (productData.name && !productData.slug) {
      updateData('slug', generateSlug(productData.name));
    }
  }, [productData.name, productData.slug]);

  const validateStep1 = () => {
    return productData.name.trim() && 
           productData.model.trim() && 
           productData.slug.trim() && 
           productData.category.trim();
  };

  const validateStep2 = () => {
    return productData.tagline.trim() && 
           productData.description.trim() && 
           productData.price > 0 && 
           productData.stock >= 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitProduct = async () => {
    setLoading(true);
    
    try {
      // Create clean product object for database
      const dbProduct = {
        slug: productData.slug.trim(),
        name: productData.name.trim(),
        model: productData.model.trim(),
        category: productData.category,
        tagline: productData.tagline.trim(),
        description: productData.description.trim(),
        price: productData.price,
        compare_at: productData.compareAt || null,
        stock: productData.stock,
        rating: productData.rating,
        reviews: productData.reviews,
        badge: productData.badge?.trim() || null,
        image: productData.image?.trim() || null,
        highlights: [], // Empty array - no validation issues
        specs: [], // Empty array - no validation issues  
        use_cases: [], // Empty array - no validation issues
      };

      console.log('[Wizard] Submitting product:', dbProduct);

      // Use the existing Supabase client that's already working in the app
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: product, error } = await supabase
        .from("products")
        .insert([dbProduct])
        .select()
        .single();

      if (error) {
        console.error('[Wizard] Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      const result = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        model: product.model,
        category: product.category,
        tagline: product.tagline,
        description: product.description,
        price: product.price,
        compareAt: product.compare_at,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        image: product.image,
        highlights: product.highlights || [],
        specs: product.specs || [],
        useCases: product.use_cases || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };

      console.log('[Wizard] Product created successfully:', result);
      
      toast.success(`Product "${productData.name}" created successfully!`);
      onSuccess();
      
    } catch (error: any) {
      console.error('[Wizard] Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              New Product Wizard
            </CardTitle>
            <CardDescription>
              Step {currentStep} of 3 - {steps[currentStep - 1].description}
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-2">
              {currentStep > step.number ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : currentStep === step.number ? (
                <Circle className="w-5 h-5 text-blue-600 fill-blue-100" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <div className="hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
              </div>
              {step.number < steps.length && (
                <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Product Information</h3>
            
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={productData.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="e.g. Reyee EG105G-V2 Cloud Gateway"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model">Model Number *</Label>
                <Input
                  id="model"
                  value={productData.model}
                  onChange={(e) => updateData('model', e.target.value)}
                  placeholder="e.g. RG-EG105G-V2"
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={productData.category}
                  onChange={(e) => updateData('category', e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  <option value="eg">EG Series Gateways</option>
                  <option value="wireless">Wireless Routers</option>
                  <option value="nbr">NBR Security Routers</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={productData.slug}
                onChange={(e) => updateData('slug', e.target.value)}
                placeholder="Auto-generated from name"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be the URL: /products/{productData.slug}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            
            <div>
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                value={productData.tagline}
                onChange={(e) => updateData('tagline', e.target.value)}
                placeholder="e.g. 5-port desktop cloud gateway for up to 100 clients"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e) => updateData('description', e.target.value)}
                placeholder="Detailed product description..."
                rows={4}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (ZAR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={productData.price}
                  onChange={(e) => updateData('price', Number(e.target.value))}
                  placeholder="2199"
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="compareAt">Compare At (ZAR)</Label>
                <Input
                  id="compareAt"
                  type="number"
                  value={productData.compareAt || ''}
                  onChange={(e) => updateData('compareAt', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="2599"
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productData.stock}
                  onChange={(e) => updateData('stock', Number(e.target.value))}
                  placeholder="10"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Advanced */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="badge">Badge (Optional)</Label>
                <Input
                  id="badge"
                  value={productData.badge || ''}
                  onChange={(e) => updateData('badge', e.target.value)}
                  placeholder="e.g. Best Seller, New, Sale"
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="image">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={productData.image || ''}
                  onChange={(e) => updateData('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={productData.rating}
                  onChange={(e) => updateData('rating', Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="reviews">Number of Reviews</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={productData.reviews}
                  onChange={(e) => updateData('reviews', Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="text-sm space-y-1">
                <div><strong>Name:</strong> {productData.name}</div>
                <div><strong>Model:</strong> {productData.model}</div>
                <div><strong>Price:</strong> R{productData.price?.toLocaleString()}</div>
                <div><strong>Stock:</strong> {productData.stock} units</div>
                <div><strong>Category:</strong> {productData.category}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={submitProduct}
              disabled={loading}
              className="bg-emerald-gradient text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}