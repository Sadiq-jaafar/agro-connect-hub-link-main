
import { Link } from "react-router-dom";
import { Beef, Wheat, Tractor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    title: "Livestock",
    description: "Cattle, poultry, fish, and more from certified farmers",
    icon: Beef,
    link: "/livestock",
    color: "bg-agro-brown-light",
  },
  {
    id: 2,
    title: "Crops",
    description: "Fresh grains, tubers, legumes, and vegetables",
    icon: Wheat,
    link: "/crops",
    color: "bg-agro-green",
  },
  {
    id: 3,
    title: "Services",
    description: "Agricultural equipment and professional services",
    icon: Tractor,
    link: "/services",
    color: "bg-agro-green-dark",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-agro-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-agro-green-dark mb-4">Explore Our Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover high-quality agricultural products and services to meet all your farming needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link to={category.link} key={category.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className={`${category.color} h-24 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300`}>
                    <category.icon size={48} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
