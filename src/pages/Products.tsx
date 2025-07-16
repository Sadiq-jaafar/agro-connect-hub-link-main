
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Beef, Wheat, ShoppingCart, Loader2 } from "lucide-react";
import PopularPurchases from "@/components/products/PopularPurchases";
import { useProducts } from "@/hooks/useProducts";


const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { addToCart, getTotalItems } = useCart();
  const { products, loading } = useProducts();
  
  const filterProducts = (productType: "livestock" | "crop") => {
    return products.filter(product => {
      const matchesType = product.product_type === productType;
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesType && matchesSearch;
    });
  };

  interface Product {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    category: string;
    description?: string;
    farmer_id: string;
    // [key: string]: any; // fallback for any extra fields (removed to avoid 'any' type)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: `₦${product.price.toLocaleString()}`,
      image: product.image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: product.category,
      description: product.description || "",
      farmer_id: product.farmer_id,
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} (₦${product.price.toLocaleString()}) has been added to your cart.`,
    });
  };

  // Add Recently Added Products section
  const recentlyAdded = products
    .slice() // copy
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-agro-green-dark mb-4">Agricultural Products</h1>
              <p className="text-gray-600 max-w-3xl">
                Explore our range of high-quality agricultural products sourced directly from verified farmers and producers.
              </p>
            </div>
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

        {/* Remove PopularPurchases and trending dummy data */}
        {/* Add Recently Added Products section */}
        <h2 className="text-2xl font-bold mb-6">Recently Added Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {recentlyAdded.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <p className="text-sm text-agro-green font-medium">{product.category}</p>
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-agro-green" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <Tabs defaultValue="livestock">
            <TabsList className="mb-8">
              <TabsTrigger value="livestock" className="flex items-center">
                <Beef className="w-4 h-4 mr-2" />
                Livestock
              </TabsTrigger>
              <TabsTrigger value="crops" className="flex items-center">
                <Wheat className="w-4 h-4 mr-2" />
                Crops
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="livestock" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterProducts("livestock").map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <p className="text-sm text-agro-green font-medium">{product.category}</p>
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
              
              {filterProducts("livestock").length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No livestock products found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="crops" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterProducts("crop").map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.image_url || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <p className="text-sm text-agro-green font-medium">{product.category}</p>
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
              
              {filterProducts("crop").length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No crop products found matching your search.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Products;
