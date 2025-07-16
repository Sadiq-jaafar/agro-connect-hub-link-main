
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Premium Beef Cattle",
    category: "Livestock",
    price: "$1,200.00",
    image: "https://images.unsplash.com/photo-1597024436273-b920b9ff5bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    link: "/products/livestock/beef-cattle",
  },
  {
    id: 2,
    name: "Organic Rice",
    category: "Crops",
    price: "$12.99/kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "/products/crops/rice",
  },
  {
    id: 3,
    name: "Free-Range Chickens",
    category: "Livestock",
    price: "$25.00",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    link: "/products/livestock/chickens",
  },
  {
    id: 4,
    name: "Organic Soybeans",
    category: "Crops",
    price: "$8.99/kg",
    image: "https://images.unsplash.com/photo-1612460138281-c96af6ff71a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    link: "/products/crops/soybeans",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-agro-green-dark">Featured Products</h2>
          <Button variant="outline" className="border-agro-green text-agro-green hover:bg-agro-green hover:text-white" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
              <div className="h-52 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-6 flex-grow">
                <p className="text-sm text-agro-green font-medium">{product.category}</p>
                <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                <p className="text-agro-brown font-bold mt-2">{product.price}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-6">
                <Button className="w-full bg-agro-green hover:bg-agro-green-dark" asChild>
                  <Link to={product.link}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
