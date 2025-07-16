
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { TrendingUp, Star, ShoppingCart } from "lucide-react";

const popularPurchases = [
  {
    id: 1,
    name: "High-Yield Wheat Seeds",
    category: "Seeds",
    price: "₦18,500/bag",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 1247,
    rating: 4.8,
    trending: true,
    description: "Premium wheat seeds with 95% germination rate"
  },
  {
    id: 2,
    name: "Organic Fertilizer Blend",
    category: "Fertilizers",
    price: "₦13,200/bag",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 892,
    rating: 4.7,
    trending: false,
    description: "All-natural fertilizer for sustainable farming"
  },
  {
    id: 3,
    name: "Drip Irrigation Kit",
    category: "Equipment",
    price: "₦52,500/set",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 634,
    rating: 4.9,
    trending: true,
    description: "Water-efficient irrigation system for crops"
  },
  {
    id: 4,
    name: "Plant Protection Spray",
    category: "Pesticides",
    price: "₦11,600/bottle",
    image: "https://images.unsplash.com/photo-1599227679630-2fa7f9d15a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 756,
    rating: 4.6,
    trending: false,
    description: "Organic pest control solution"
  },
  {
    id: 5,
    name: "Soil pH Testing Kit",
    category: "Tools",
    price: "₦8,100/kit",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 1089,
    rating: 4.5,
    trending: true,
    description: "Accurate soil testing for optimal crop growth"
  },
  {
    id: 6,
    name: "Greenhouse Film Cover",
    category: "Equipment",
    price: "₦36,400/roll",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    purchaseCount: 423,
    rating: 4.4,
    trending: false,
    description: "UV-resistant greenhouse covering material"
  }
];

const PopularPurchases = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const sortedByPopularity = [...popularPurchases].sort((a, b) => b.purchaseCount - a.purchaseCount);
  const topPurchases = sortedByPopularity.slice(0, 6);

  type Product = {
    id: number;
    name: string;
    category: string;
    price: string;
    image: string;
    purchaseCount: number;
    rating: number;
    trending: boolean;
    description: string;
  };

  const handleAddToCart = (product: Product) => {
    // Provide a dummy farmer_id since it's required by CartItem but not present in mock data
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      farmer_id: "mock-farmer-id", // Placeholder value
    });

    toast({
      title: "Added to Cart!",
      description: `${product.name} (${product.price}) has been added to your cart.`,
    });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-agro-green" />
        <h2 className="text-2xl font-bold text-agro-green-dark">Popular Among Farmers</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Discover the most purchased agricultural products by farmers in your region
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPurchases.map((product, index) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group relative">
            {product.trending && (
              <Badge className="absolute top-3 left-3 z-10 bg-orange-500 hover:bg-orange-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            
            <Badge className="absolute top-3 right-3 z-10 bg-agro-green hover:bg-agro-green-dark">
              #{index + 1}
            </Badge>

            <div className="h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-agro-brown font-bold text-lg">{product.price}</p>
                <p className="text-sm text-gray-500">
                  {product.purchaseCount.toLocaleString()} purchases
                </p>
              </div>
              
              <Button 
                className="w-full bg-agro-green hover:bg-agro-green-dark"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularPurchases;
