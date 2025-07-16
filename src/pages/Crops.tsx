
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Wheat, ShoppingCart, ArrowLeft } from "lucide-react";

const Crops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, loading, refreshProducts } = useProducts();
  // Only show products of type 'crop'
  const cropProducts = products.filter(p => p.product_type === 'crop');
  const { toast } = useToast();
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const filteredProducts = cropProducts.filter(
    product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subcategory || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  type Product = {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    subcategory?: string;
    category?: string;
    description?: string;
    farmer_id?: string;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: `₦${product.price.toLocaleString()}`,
      image: product.image_url || "https://images.unsplash.com/photo-1586201375761-83865001e8c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: product.subcategory || product.category,
      description: product.description,
      farmer_id: product.farmer_id,
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Loading crop products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Wheat className="w-8 h-8 text-agro-green" />
              <h1 className="text-agro-green-dark">Crop Products</h1>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 max-w-3xl">
              Fresh crops directly from local farmers. All products are organically grown and carefully harvested for premium quality.
            </p>
            <Button 
              className="bg-agro-green hover:bg-agro-green-dark flex items-center gap-2"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="w-4 h-4" />
                Go to Cart ({getTotalItems()})
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image_url || "https://images.unsplash.com/photo-1586201375761-83865001e8c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <p className="text-sm text-agro-green font-medium">{product.subcategory || product.category}</p>
                <h3 className="font-semibold text-lg mt-1 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm flex-grow mb-4">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-agro-brown font-bold">₦{product.price.toLocaleString()}</p>
                  <Button 
                    variant="outline" 
                    className="border-agro-green text-agro-green hover:bg-agro-green hover:text-white"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Wheat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No crop products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;
