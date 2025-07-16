import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePurchaseRequests, PurchaseRequest } from "@/hooks/usePurchaseRequests";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, CheckCircle, XCircle, Clock, CreditCard, Receipt, Download, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

const Purchases = () => {
  const { toast } = useToast();
  const { loading, markAsPaid, getUserRequests, refreshRequests, deleteRequest } = usePurchaseRequests();
  const { user, profile } = useAuth();
  const [paidRequests, setPaidRequests] = useState<Set<string>>(new Set());
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);

  // Always fetch user purchase requests on mount
  useEffect(() => {
    refreshRequests();
  }, []);

  // Get user's purchase requests
  const userRequests = getUserRequests();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-agro-green text-lg font-semibold">Loading purchase requests...</span>
      </div>
    );
  }

  const handlePayment = async (requestId: string, amount: number) => {
    setProcessingPaymentId(requestId);
    // Simulate payment processing
    setTimeout(async () => {
      await markAsPaid(requestId);
      setPaidRequests(prev => new Set(prev).add(requestId));
      toast({
        title: "Payment Successful",
        description: `Payment of ₦${amount.toLocaleString()} has been processed successfully.`,
      });
      setProcessingPaymentId(null);
    }, 1000);
  };
  

  const generateReceiptPDF = (request: PurchaseRequest) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("AGROCONNECT RECEIPT", 20, 30);
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Receipt details
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    
    let yPosition = 50;
    const lineHeight = 8;
    
    // Receipt ID and Date
    doc.setFont(undefined, "bold");
    doc.text(`Receipt ID: ${request.id}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Customer Details
    doc.setFont(undefined, "bold");
    doc.text("CUSTOMER DETAILS:", 20, yPosition);
    yPosition += lineHeight;
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${profile?.full_name || profile?.email || "N/A"}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Email: ${profile?.email || "N/A"}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Farmer Details
    doc.setFont(undefined, "bold");
    doc.text("FARMER DETAILS:", 20, yPosition);
    yPosition += lineHeight;
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${request.farmer_profile?.full_name || "N/A"}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Email: ${request.farmer_profile?.email || "N/A"}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Address: ${request.farmer_profile?.address || "N/A"}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Items
    doc.setFont(undefined, "bold");
    doc.text("ITEMS PURCHASED:", 20, yPosition);
    yPosition += lineHeight;
    doc.setFont(undefined, "normal");
  
    request.products?.forEach((product, index) => {
      const quantity = request.quantities[index];
      doc.text(`- ${product.name} x ${quantity}`, 20, yPosition);
      yPosition += lineHeight;
    });
    
    yPosition += lineHeight;
    
    // Total Amount
    doc.setFont(undefined, "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL AMOUNT: ₦${request.total_amount.toLocaleString()}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text("PAYMENT STATUS: PAID", 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Thank you for using AgroConnect!", 20, yPosition);
    
    return doc;
  };

  const downloadReceipt = (request: PurchaseRequest) => {
    const doc = generateReceiptPDF(request);
    doc.save(`receipt-${request.id}.pdf`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'paid':
        return <Receipt className="w-4 h-4 text-blue-600" />;
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
      case 'paid':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agro-green-dark mb-2">My Purchases</h1>
          <p className="text-gray-600">Track your purchase requests and payments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Purchase Requests
            </CardTitle>
            <CardDescription>
              View and manage your purchase requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.farmer_profile?.full_name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{request.farmer_profile?.email || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {request.products?.map((product, index) => (
                            <div key={index} className="text-sm">
                              {product.name} x {request.quantities[index]}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₦{request.total_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {request.status === 'accepted' && (
                          <Button 
                            size="sm" 
                            className="bg-agro-green hover:bg-agro-green-dark"
                            onClick={() => handlePayment(request.id, request.total_amount)}
                            disabled={processingPaymentId === request.id}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            {processingPaymentId === request.id ? 'Processing...' : 'Pay Now'}
                          </Button>
                        )}
                        {request.status === 'paid' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled>
                              <Receipt className="w-4 h-4 mr-2" />
                              Paid
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Receipt Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="text-center">
                                    <h3 className="text-lg font-bold text-agro-green-dark">AGROCONNECT RECEIPT</h3>
                                    <div className="h-px bg-gray-300 my-3"></div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p><strong>Receipt ID:</strong> {request.id}</p>
                                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-bold">CUSTOMER DETAILS:</h4>
                                    <p>Name: {profile?.full_name || profile?.email || "N/A"}</p>
                                    <p>Email: {profile?.email || "N/A"}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-bold">FARMER DETAILS:</h4>
                                    <p>Name: {request.farmer_profile?.full_name || "N/A"}</p>
                                    <p>Email: {request.farmer_profile?.email || "N/A"}</p>
                                    <p>Address: {request.farmer_profile?.address || "N/A"}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-bold">ITEMS PURCHASED:</h4>
                                    {request.products?.map((product, index) => (
                                      <p key={index}>- {product.name} x {request.quantities[index]}</p>
                                    ))}
                                  </div>
                                  
                                  <div className="space-y-2 border-t pt-2">
                                    <p className="text-lg font-bold">TOTAL AMOUNT: ₦{request.total_amount.toLocaleString()}</p>
                                    <p className="font-bold text-green-600">PAYMENT STATUS: PAID</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadReceipt(request)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </div>
                        )}
                        {request.status === 'pending' && (
                          <span className="text-sm text-gray-500">Awaiting response</span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="text-sm text-red-500">Request rejected</span>
                        )}
                        {(request.status === 'pending' || request.status === 'rejected') && (
                          <Dialog open={deleteDialogOpenId === request.id} onOpenChange={open => setDeleteDialogOpenId(open ? request.id : null)}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 mt-2"
                                disabled={deletingRequestId === request.id}
                                onClick={() => setDeleteDialogOpenId(request.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {deletingRequestId === request.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Purchase Request?</DialogTitle>
                              </DialogHeader>
                              <p>Are you sure you want to delete this purchase request? This action cannot be undone.</p>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={async () => {
                                    setDeletingRequestId(request.id);
                                    await deleteRequest(request.id);
                                    setDeletingRequestId(null);
                                    setDeleteDialogOpenId(null);
                                  }}
                                  disabled={deletingRequestId === request.id}
                                >
                                  {deletingRequestId === request.id ? 'Deleting...' : 'Delete'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {userRequests.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Requests</h3>
                <p className="text-gray-500">Your purchase requests will appear here when you make them.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Purchases;
