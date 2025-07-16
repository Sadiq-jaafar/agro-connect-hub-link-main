import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Star, Wrench } from "lucide-react";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, loading, refreshProducts } = useProducts();
  // Only show products of type 'service'
  const serviceProducts = products.filter(p => p.product_type === 'service');
  // Only show products of type 'device'
  const deviceProducts = products.filter(p => p.product_type === 'device');
  const [devices, setDevices] = useState<typeof deviceProducts>([]);
  const { toast } = useToast();

  useEffect(() => {
  }, []);

  // const fetchServicesAndDevices = async () => { // This function is no longer needed
  //   try {
  //     // Fetch services
  //     const { data: servicesData, error: servicesError } = await supabase
  //       .from('products')
  //       .select('*')
  //       .eq('product_type', 'service')
  //       .eq('is_active', true);

  //     if (servicesError) throw servicesError;

  //     // Fetch devices
  //     const { data: devicesData, error: devicesError } = await supabase
  //       .from('products')
  //       .select('*')
  //       .eq('category', 'Equipment')
  //       .eq('is_active', true);

  //     if (devicesError) throw devicesError;
      
  //     setServices(servicesData || []);
  //     setDevices(devicesData || []);
  //   } catch (error) {
  //     console.error('Error fetching services and devices:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to load services and devices.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredServices = serviceProducts.filter(
    service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDevices = deviceProducts.filter(
    device => 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Loading services and devices...</p>
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
              <Users className="w-8 h-8 text-agro-green" />
              <h1 className="text-3xl font-bold text-agro-green-dark">Agricultural Services & Equipment</h1>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Professional agricultural services and equipment to help optimize your farming operations and maximize productivity.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder="Search services or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Equipment & Devices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="mt-6">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{service.name}</span>
                        <Badge variant="secondary">{service.subcategory || service.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-agro-green" />
                          <span className="font-semibold">₦{service.price.toLocaleString()}</span>
                        </div>
                        {service.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-agro-green" />
                            <span>{service.duration}</span>
                          </div>
                        )}
                        {service.what_included && service.what_included.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">What's included:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {service.what_included.map((item: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="w-1 h-1 bg-agro-green rounded-full"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4 bg-agro-green hover:bg-agro-green-dark" asChild>
                        <Link to={`/service-detail/${service.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No services found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            {filteredDevices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <Card key={device.id} className="hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={device.image_url || "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                        alt={device.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{device.name}</span>
                        <Badge variant="secondary">{device.subcategory || device.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{device.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4 text-agro-green" />
                        <span className="font-semibold text-agro-brown">₦{device.price.toLocaleString()}</span>
                      </div>
                      <Button className="w-full bg-agro-green hover:bg-agro-green-dark">
                        Contact Seller
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No equipment found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Services;