import { useState, useRef } from "react";
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
import type { User } from '@supabase/supabase-js';

const FarmerDashboard = () => {
  console.log("FarmerDashboard rendered");
  const { toast } = useToast();
  const { updateRequestStatus, getFarmerRequests, refreshRequests, loading } = usePurchaseRequests();
  const { user, profile } = useAuth();
  const { addProduct, products, deleteProduct, updateProduct, loading: productsLoading, refreshProducts } = useProducts();
  
  // Remove all form refs and state from FarmerDashboard
  // const [productForm, setProductForm] = useState({
  //   name: "",
  //   category: "",
  //   price: "",
  //   quantity: "",
  //   description: "",
  //   image: "",
  //   duration: "",
  //   whatIncluded: [] as string[],
  // });

  // const [newIncludedItem, setNewIncludedItem] = useState("");
  // const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);
  // const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  // const [uploading, setUploading] = useState(false);
  // const [uploadError, setUploadError] = useState<string | null>(null);

  // Add state for delete dialog and edit dialog
  interface Product {
    id: string;
    name: string;
    category: string;
    subcategory?: string | null;
    price: number;
    quantity: number;
    description: string;
    image?: string | null;
    duration?: string | null;
    whatIncluded?: string[] | null;
    product_type: "crop" | "livestock" | "service" | "device";
    farmer_id: string;
    // Add any additional known fields here as needed
    // Remove index signature to avoid 'any'
  }

  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Product | null>(null);

  // Handler for opening edit dialog
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditForm({ ...product });
  };

  // Handler for saving edit
  const handleEditSave = async () => {
    if (!editingProduct || !editForm) return;
    // Ensure price and quantity are numbers, and product_type is correct
    const updateData: Partial<Product> = {
      ...editForm,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
      product_type: editForm.product_type as "crop" | "livestock" | "service" | "device",
    };
    await updateProduct(editForm.id, updateData);
    setEditingProduct(null);
    setEditForm(null);
    refreshProducts();
  };

  // Handler for closing edit dialog
  const handleEditClose = () => {
    setEditingProduct(null);
    setEditForm(null);
  };

  // Get farmer's purchase requests
  const farmerRequests = getFarmerRequests();

  // Helper to filter products by type and farmer
  const getFarmerProducts = (type: string) => {
    return products.filter(
      (p) => p.product_type === type.toLowerCase() && p.farmer_id === user?.id
    );
  };

  // Remove all form refs and state from FarmerDashboard
  // const handleProductSubmit = async (e: React.FormEvent, productType: string) => {
  //   e.preventDefault();
    
  //   if (!user) {
  //     toast({
  //       title: "Authentication Required",
  //       description: "You must be logged in to add products.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     await addProduct({
  //       name: productForm.name,
  //       category: productForm.category,
  //       subcategory: null,
  //       price: parseFloat(productForm.price),
  //       quantity: parseInt(productForm.quantity),
  //       description: productForm.description,
  //       image_url: productForm.image,
  //       product_type: productType.toLowerCase() as "crop" | "livestock" | "service" | "device",
  //       duration: productForm.duration || null,
  //       what_included: productForm.whatIncluded.length > 0 ? productForm.whatIncluded : null,
  //       farmer_id: user.id,
  //       is_active: true,
  //     });

  //     toast({
  //       title: "Product Added!",
  //       description: "Your product has been successfully added to the marketplace.",
  //     });
      
  //     // Reset form
  //     setProductForm({
  //       name: "",
  //       category: "",
  //       price: "",
  //       quantity: "",
  //       description: "",
  //       image: "",
  //       duration: "",
  //       whatIncluded: [],
  //     });
  //     setNewIncludedItem("");
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add product. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleInputChange = (field: string, value: string) => {
  //   setProductForm(prev => ({ ...prev, [field]: value }));
  // };

  // const addIncludedItem = () => {
  //   if (newIncludedItem.trim() && !productForm.whatIncluded.includes(newIncludedItem.trim())) {
  //     setProductForm(prev => ({
  //       ...prev,
  //       whatIncluded: [...prev.whatIncluded, newIncludedItem.trim()]
  //     }));
  //     setNewIncludedItem("");
  //   }
  // };

  // const removeIncludedItem = (item: string) => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     whatIncluded: prev.whatIncluded.filter(i => i !== item)
  //   }));
  // };

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

  // Remove all form refs and state from FarmerDashboard
  // const handleImageUpload = async (file: File) => {
  //   setUploading(true);
  //   setUploadError(null);
  //   const fileExt = file.name.split('.').pop();
  //   const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  //   const filePath = `products/${fileName}`;
  //   // Use the 'images' bucket
  //   const { error } = await supabase.storage.from('images').upload(filePath, file);
  //   if (error) {
  //     setUploadError(error.message || 'Failed to upload image.');
  //     setUploading(false);
  //     return;
  //   }
  //   const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  //   handleInputChange("image", data.publicUrl);
  //   setUploading(false);
  // };

  const ProductForm = ({
    type,
    categories,
    addProduct,
    user,
    toast
  }: {
    type: string;
    categories: string[];
    addProduct: (product: Record<string, unknown>) => Promise<unknown>;
    user: User | null;
    toast: (opts: { title: string; description: string; variant?: string }) => void;
  }) => {
    // Move all refs and state here
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const durationRef = useRef<HTMLInputElement>(null);
    const includedInputRef = useRef<HTMLInputElement>(null);
    const [includedList, setIncludedList] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [category, setCategory] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleProductSubmit = async (e: React.FormEvent) => {
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
          name: nameRef.current?.value || "",
          category: category,
          subcategory: null,
          price: parseFloat(priceRef.current?.value || "0"),
          quantity: parseInt(quantityRef.current?.value || "0"),
          description: descriptionRef.current?.value || "",
          image_url: imageUrl,
          product_type: type.toLowerCase() as "crop" | "livestock" | "service" | "device",
          duration: durationRef.current?.value || null,
          what_included: includedList.length > 0 ? includedList : null,
          farmer_id: user.id,
          is_active: true,
        });
        toast({
          title: "Product Added!",
          description: "Your product has been successfully added to the marketplace.",
        });
        // Reset form
        if (nameRef.current) nameRef.current.value = "";
        setCategory("");
        if (priceRef.current) priceRef.current.value = "";
        if (quantityRef.current) quantityRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        setImageUrl("");
        setSelectedFileName(null);
        if (durationRef.current) durationRef.current.value = "";
        setIncludedList([]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add product. Please try again.",
          variant: "destructive",
        });
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
      setImageUrl(data.publicUrl);
    setUploading(false);
  };

    const addIncludedItem = () => {
      const value = includedInputRef.current?.value.trim() || "";
      if (value && !includedList.includes(value)) {
        setIncludedList(prev => [...prev, value]);
        if (includedInputRef.current) includedInputRef.current.value = "";
      }
    };

    const removeIncludedItem = (item: string) => {
      setIncludedList(prev => prev.filter(i => i !== item));
    };

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
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{type} Name</Label>
              
              
            
              <Input
                id="name"
                type="text"
                placeholder={`Enter ${type.toLowerCase()} name`}
                ref={nameRef}
                required
              />
            </div>
            <div className="space-y-2">
              <div className=" rounded p-2">
                <Label htmlFor="category" className="block mb-1">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="block w-full border rounded px-3 py-2 bg-black"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price in Naira"
                ref={priceRef}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Available Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                ref={quantityRef}
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
                  ref={durationRef}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add what's included in this service"
                      ref={includedInputRef}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
                    />
                    <Button type="button" onClick={addIncludedItem} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {includedList.length > 0 && (
                    <div className="space-y-1">
                      {includedList.map((item, index) => (
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
              ref={descriptionRef}
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
                    setSelectedFileName(file.name);
                    await handleImageUpload(file);
                  } else {
                    setSelectedFileName(null);
                  }
                }}
              />
              <span className="text-xs text-gray-700 ml-2">
                {selectedFileName ? selectedFileName : "No file chosen"}
              </span>
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
                addProduct={addProduct}
                user={user}
                toast={(opts) => toast({
                  title: opts.title,
                  description: opts.description,
                  variant: opts.variant === "destructive" ? "destructive" : "default"
                })}
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
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEditClick(product)}>
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
                addProduct={addProduct}
                user={user}
                toast={({ title, description, variant }) =>
                  toast({
                    title,
                    description,
                    variant: variant as "default" | "destructive" | undefined,
                  })
                }
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
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEditClick(product)}>
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
                addProduct={addProduct}
                user={user}
                toast={({ title, description, variant }) =>
                  toast({
                    title,
                    description,
                    variant: variant === "destructive" ? "destructive" : "default",
                  })
                }
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
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEditClick(product)}>
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
                addProduct={addProduct}
                user={user}
                toast={(opts: { title: string; description: string; variant?: "default" | "destructive" }) => toast(opts)}
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
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleEditClick(product)}>
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
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={open => !open && handleEditClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <Label>Name</Label>
              <input className="w-full bg-slate-800 border rounded px-2 py-1" value={editForm.name} onChange={e => setEditForm({ ...editForm!, name: e.target.value })} />
              <Label>Category</Label>
              <input className="w-full bg-slate-800 border rounded px-2 py-1" value={editForm.category} onChange={e => setEditForm({ ...editForm!, category: e.target.value })} />
              <Label>Price</Label>
              <input className="w-full bg-slate-800 border rounded px-2 py-1" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm!, price: Number(e.target.value) })} />
              <Label>Quantity</Label>
              <input className="w-full bg-slate-800 border rounded px-2 py-1" type="number" value={editForm.quantity} onChange={e => setEditForm({ ...editForm!, quantity: Number(e.target.value) })} />
              <Label>Description</Label>
              <textarea className="w-full bg-slate-800 border rounded px-2 py-1" value={editForm.description} onChange={e => setEditForm({ ...editForm!, description: e.target.value })} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FarmerDashboard;
