
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";


const getProductLink = (product) => {
  switch (product.product_type) {
    case "crop":
      return "/crops";
    case "livestock":
      return "/livestock";
    case "service":
      return "/services";
    case "device":
      return "/devices";
    default:
      return "/products";
  }
};

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  // Sort by created_at descending and take the first 4
  const sorted = [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const featured = sorted.slice(0, 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-agro-green-dark">Featured Products</h2>
          <Button variant="outline" className="border-agro-green text-agro-green hover:bg-agro-green hover:text-white" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading featured products...</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                <div className="h-52 overflow-hidden">
                  <img 
                    src={product.image_url || "https://via.placeholder.com/400x300?text=No+Image"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <p className="text-sm text-agro-green font-medium">{product.category}</p>
                  <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                  <p className="text-agro-brown font-bold mt-2">₦{product.price.toLocaleString()}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-6">
                  <Button className="w-full bg-agro-green hover:bg-agro-green-dark" asChild>
                    <Link to={getProductLink(product)}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
