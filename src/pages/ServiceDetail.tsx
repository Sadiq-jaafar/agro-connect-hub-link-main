
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, CheckCircle } from "lucide-react";

// Service data (in a real app, this would come from an API)
const serviceData = {
  tractor: {
    title: "Tractor Services",
    description: "Access modern tractors and agricultural equipment for field preparation, planting, harvesting, and more.",
    price: "From ₦18,750/hour",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    features: [
      "Field preparation and tilling",
      "Planting and seeding operations", 
      "Harvesting assistance",
      "Land clearing and grading",
      "Trained operators available"
    ],
    provider: {
      name: "AgriTech Services Ltd",
      location: "Lagos, Nigeria",
      phone: "+234 801 234 5678",
      email: "info@agritech.ng",
      rating: 4.8
    }
  },
  seed: {
    title: "Seed Services",
    description: "High-quality seeds for various crops with guaranteed germination rates and expert planting advice.",
    price: "Custom pricing",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    features: [
      "Premium certified seeds",
      "Variety selection assistance",
      "Germination testing",
      "Seed treatment options",
      "Seasonal planting guidance"
    ],
    provider: {
      name: "Premium Seeds Co",
      location: "Kaduna, Nigeria", 
      phone: "+234 802 345 6789",
      email: "orders@premiumseeds.ng",
      rating: 4.9
    }
  },
  fertilizer: {
    title: "Fertilizer Services",
    description: "Organic and conventional fertilizers tailored to your soil's needs with professional application services.",
    price: "From ₦50,000/acre",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    features: [
      "Soil testing and analysis",
      "Custom fertilizer formulation", 
      "Precision application",
      "Organic options available",
      "Seasonal treatment plans"
    ],
    provider: {
      name: "FertiliCare Solutions",
      location: "Kano, Nigeria",
      phone: "+234 803 456 7890", 
      email: "support@fertilicare.ng",
      rating: 4.7
    }
  },
  irrigation: {
    title: "Irrigation Solutions", 
    description: "Modern irrigation systems for efficient water management and improved crop health and yields.",
    price: "Custom quotes",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    features: [
      "System design and installation",
      "Drip irrigation setup",
      "Sprinkler system maintenance", 
      "Water conservation solutions",
      "Smart irrigation technology"
    ],
    provider: {
      name: "AquaFlow Systems",
      location: "Abuja, Nigeria",
      phone: "+234 804 567 8901",
      email: "info@aquaflow.ng", 
      rating: 4.6
    }
  },
  pesticide: {
    title: "Pesticide & Herbicide Services",
    description: "Safe and effective pest and weed control solutions to protect your crops and maximize yields.",
    price: "From �N37,500/acre", 
    image: "https://images.unsplash.com/photo-1599227679630-2fa7f9d15a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    features: [
      "Integrated pest management",
      "Targeted application",
      "Eco-friendly options",
      "Pre-emergent weed control", 
      "Regular monitoring services"
    ],
    provider: {
      name: "CropGuard Services",
      location: "Ibadan, Nigeria",
      phone: "+234 805 678 9012",
      email: "contact@cropguard.ng",
      rating: 4.5
    }
  },
  consulting: {
    title: "Agricultural Consulting",
    description: "Expert advice from agricultural professionals to optimize your farming operations and profitability.",
    price: "₦30,000/hour",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
    features: [
      "Crop selection guidance",
      "Yield improvement strategies",
      "Sustainable farming practices",
      "Financial planning assistance",
      "Market access consulting"
    ],
    provider: {
      name: "AgriConsult Pro",
      location: "Lagos, Nigeria", 
      phone: "+234 806 789 0123",
      email: "experts@agriconsult.ng",
      rating: 4.9
    }
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    farmSize: "",
    location: "",
    preferredDate: "",
    message: ""
  });

  const service = serviceId ? serviceData[serviceId as keyof typeof serviceData] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Service Request Submitted!",
      description: `Your request for ${service?.title} has been sent to ${service?.provider.name}. They will contact you within 24 hours.`,
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      farmSize: "",
      location: "",
      preferredDate: "",
      message: ""
    });
    
    console.log("Service request:", { service: serviceId, ...formData });
  };

  if (!service) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button asChild>
            <Link to="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/services">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div>
            <div className="mb-6">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-agro-green-dark mb-4">{service.title}</h1>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <p className="text-2xl font-bold text-agro-brown mb-6">{service.price}</p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-agro-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">{service.provider.name}</h4>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {service.provider.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {service.provider.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {service.provider.email}
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-medium">{service.provider.rating}</span>
                    <span className="text-gray-500 ml-1">rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request This Service</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll connect you with the service provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Farm Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Additional Requirements</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your specific needs..."
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-agro-green hover:bg-agro-green-dark"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Service
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
