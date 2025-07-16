import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { Wheat, Beef, Wrench, Smartphone, Upload, Plus, ShoppingCart, CheckCircle, XCircle, Clock, Minus, Pencil, Trash2 } from "lucide-react";
import FarmerHeader from "@/components/FarmerHeader";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const FarmerDashboard = () => {
  console.log("FarmerDashboard rendered");
  const { toast } = useToast();
  const { updateRequestStatus, getFarmerRequests, refreshRequests, loading } = usePurchaseRequests();
  const { user, profile } = useAuth();
  const { addProduct, products, deleteProduct, updateProduct, loading: productsLoading, refreshProducts } = useProducts();
  
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
    duration: "",
    whatIncluded: [] as string[],
  });

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Get farmer's purchase requests
  const farmerRequests = getFarmerRequests();

  // Helper to filter products by type and farmer
  const getFarmerProducts = (type: string) => {
    return products.filter(
      (p) => p.product_type === type.toLowerCase() && p.farmer_id === user?.id
    );
  };

  const handleProductSubmit = async (e: React.FormEvent, productType: string) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add products.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProduct({
        name: productForm.name,
        category: productForm.category,
        subcategory: null,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        description: productForm.description,
        image_url: productForm.image,
        product_type: productType.toLowerCase() as "crop" | "livestock" | "service" | "device",
        duration: productForm.duration || null,
        what_included: productForm.whatIncluded.length > 0 ? productForm.whatIncluded : null,
        farmer_id: user.id,
        is_active: true,
      });

      toast({
        title: "Product Added!",
        description: "Your product has been successfully added to the marketplace.",
      });
      
      // Reset form
      setProductForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        image: "",
        duration: "",
        whatIncluded: [],
      });
      setNewIncludedItem("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const addIncludedItem = () => {
    if (newIncludedItem.trim() && !productForm.whatIncluded.includes(newIncludedItem.trim())) {
      setProductForm(prev => ({
        ...prev,
        whatIncluded: [...prev.whatIncluded, newIncludedItem.trim()]
      }));
      setNewIncludedItem("");
    }
  };

  const removeIncludedItem = (item: string) => {
    setProductForm(prev => ({
      ...prev,
      whatIncluded: prev.whatIncluded.filter(i => i !== item)
    }));
  };

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject') => {
    updateRequestStatus(requestId, action === 'accept' ? 'accepted' : 'rejected');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    // Use the 'images' bucket
    const { error } = await supabase.storage.from('images').upload(filePath, file);
    if (error) {
      setUploadError(error.message || 'Failed to upload image.');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    handleInputChange("image", data.publicUrl);
    setUploading(false);
  };

  const ProductForm = ({ type, categories }: { type: string; categories: string[] }) => {
    console.log(`ProductForm rendered for type: ${type}`);
    return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New {type}
        </CardTitle>
        <CardDescription>
          Upload your {type.toLowerCase()} to reach more customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => handleProductSubmit(e, type)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{type} Name</Label>
              
              
            
              <Input
                id="name"
                type="text"
                placeholder={`Enter ${type.toLowerCase()} name`}
                value={productForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={productForm.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price in Naira"
                value={productForm.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Available Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={productForm.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                required
              />
            </div>
          </div>

          {type === "Service" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration of Availability</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 hours, 1 day, 1 week"
                  value={productForm.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add what's included in this service"
                      value={newIncludedItem}
                      onChange={(e) => setNewIncludedItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
                    />
                    <Button type="button" onClick={addIncludedItem} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {productForm.whatIncluded.length > 0 && (
                    <div className="space-y-1">
                      {productForm.whatIncluded.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{item}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIncludedItem(item)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${type.toLowerCase()}`}
              value={productForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(file);
                  }
                }}
              />
              {uploading && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
              {uploadError && <span className="text-xs text-red-500 ml-2">{uploadError}</span>}
              <Button type="button" variant="outline" size="sm" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-agro-green hover:bg-agro-green-dark" disabled={uploading}>
            Add {type}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerHeader />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-agro-green-dark mb-2">Farmer Dashboard</h1>
            <p className="text-gray-600">Manage your products, livestock, services, devices, and customer requests</p>
          </div>

          <Tabs defaultValue="crops" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="crops" className="flex items-center gap-2">
                <Wheat className="w-4 h-4" />
                Crops
              </TabsTrigger>
              <TabsTrigger value="livestock" className="flex items-center gap-2">
                <Beef className="w-4 h-4" />
                Livestock
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Devices
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Purchase Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crops">
              <ProductForm 
                type="Crop" 
                categories={["Grains", "Vegetables", "Fruits", "Legumes", "Tubers", "Spices"]} 
              />
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Your Crops</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFarmerProducts("crop").map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="mr-2" /* onClick={...} */>
                              <Pencil className="w-4 h-4" /> Edit
                            </Button>
                            <Dialog open={deleteDialogOpenId === product.id} onOpenChange={open => setDeleteDialogOpenId(open ? product.id : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpenId(product.id)}>
                                  <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Product?</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      setDeletingProductId(product.id);
                                      await deleteProduct(product.id);
                                      setDeletingProductId(null);
                                      setDeleteDialogOpenId(null);
                                      refreshProducts();
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {getFarmerProducts("crop").length === 0 && (
                    <div className="text-center py-4 text-gray-500">No crops uploaded yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="livestock">
              <ProductForm 
                type="Livestock" 
                categories={["Cattle", "Poultry", "Fish", "Goats", "Sheep", "Pigs"]} 
              />
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Your Livestock</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFarmerProducts("livestock").map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="mr-2" /* onClick={...} */>
                              <Pencil className="w-4 h-4" /> Edit
                            </Button>
                            <Dialog open={deleteDialogOpenId === product.id} onOpenChange={open => setDeleteDialogOpenId(open ? product.id : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpenId(product.id)}>
                                  <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Product?</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      setDeletingProductId(product.id);
                                      await deleteProduct(product.id);
                                      setDeletingProductId(null);
                                      setDeleteDialogOpenId(null);
                                      refreshProducts();
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {getFarmerProducts("livestock").length === 0 && (
                    <div className="text-center py-4 text-gray-500">No livestock uploaded yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <ProductForm 
                type="Service" 
                categories={["Land Preparation", "Harvesting", "Transportation", "Storage", "Consultation", "Equipment Rental"]} 
              />
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFarmerProducts("service").map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="mr-2" /* onClick={...} */>
                              <Pencil className="w-4 h-4" /> Edit
                            </Button>
                            <Dialog open={deleteDialogOpenId === product.id} onOpenChange={open => setDeleteDialogOpenId(open ? product.id : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpenId(product.id)}>
                                  <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Product?</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      setDeletingProductId(product.id);
                                      await deleteProduct(product.id);
                                      setDeletingProductId(null);
                                      setDeleteDialogOpenId(null);
                                      refreshProducts();
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {getFarmerProducts("service").length === 0 && (
                    <div className="text-center py-4 text-gray-500">No services uploaded yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices">
              <ProductForm 
                type="Device" 
                categories={["Tractors", "Irrigation Systems", "Harvesting Equipment", "Processing Equipment", "Monitoring Devices", "Hand Tools"]} 
              />
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Your Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFarmerProducts("device").map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="mr-2" /* onClick={...} */>
                              <Pencil className="w-4 h-4" /> Edit
                            </Button>
                            <Dialog open={deleteDialogOpenId === product.id} onOpenChange={open => setDeleteDialogOpenId(open ? product.id : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpenId(product.id)}>
                                  <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Product?</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      setDeletingProductId(product.id);
                                      await deleteProduct(product.id);
                                      setDeletingProductId(null);
                                      setDeleteDialogOpenId(null);
                                      refreshProducts();
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {getFarmerProducts("device").length === 0 && (
                    <div className="text-center py-4 text-gray-500">No devices uploaded yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Customer Purchase Requests
                  </CardTitle>
                  <CardDescription>
                    View and manage purchase requests from customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {farmerRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{request.customer_profile?.full_name || "N/A"}</p>
                                <p className="text-sm text-gray-500">{request.customer_profile?.email || "N/A"}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                               <div>
                                 <p className="font-medium">{request.products?.map(item => item.name).join(', ')}</p>
                                 <p className="text-sm text-gray-500">{request.products?.map(item => item.category).join(', ')}</p>
                               </div>
                             </TableCell>
                             <TableCell>{request.quantities?.reduce((sum, qty) => sum + qty, 0)} items</TableCell>
                             <TableCell>₦{request.total_amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </div>
                            </TableCell>
                            <TableCell>{request.created_at}</TableCell>
                            <TableCell>
                              {request.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => handleRequestAction(request.id, 'accept')}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => handleRequestAction(request.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {request.status !== 'pending' && (
                                <span className="text-sm text-gray-500">No actions</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {farmerRequests.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Requests</h3>
                      <p className="text-gray-500">Customer purchase requests will appear here when available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
