
import { Link } from "react-router-dom";
import { Tractor, Sprout, Factory, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    name: "Tractor Services",
    description: "Modern tractors and equipment for field preparation, planting, and harvesting",
    icon: Tractor,
    link: "/services/tractor",
  },
  {
    id: 2,
    name: "Seed Services",
    description: "High-quality seeds for various crops with guaranteed germination rates",
    icon: Sprout,
    link: "/services/seed",
  },
  {
    id: 3,
    name: "Fertilizer Services",
    description: "Organic and conventional fertilizers tailored to your soil's needs",
    icon: Factory,
    link: "/services/fertilizer",
  },
  {
    id: 4,
    name: "Irrigation Solutions",
    description: "Modern irrigation systems for efficient water management and crop health",
    icon: Droplets,
    link: "/services/irrigation",
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-16 bg-agro-green-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Our Agricultural Services</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Expert agricultural services to maximize your farm's productivity and sustainability
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-agro-green/80 p-6 rounded-lg hover:bg-agro-green transition-colors duration-300">
              <div className="bg-white/10 p-4 rounded-full inline-flex mb-4">
                <service.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
              <p className="text-gray-200 mb-4">{service.description}</p>
              <Button 
                variant="link" 
                className="text-white p-0 hover:text-agro-cream"
                asChild
              >
                <Link to={service.link}>Learn More →</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="bg-white text-agro-green-dark hover:bg-agro-cream"
            size="lg"
            asChild
          >
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
