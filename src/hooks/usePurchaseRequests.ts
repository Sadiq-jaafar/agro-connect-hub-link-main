import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface PurchaseRequest {
  id: string;
  customer_id: string;
  farmer_id: string;
  product_ids: string[];
  quantities: number[];
  total_amount: number;
  message?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined data
  customer_profile?: {
    full_name: string | null;
    email: string;
  } | null;
  farmer_profile?: {
    full_name: string | null;
    email: string;
  } | null;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    image_url?: string | null;
  }>;
}

export const usePurchaseRequests = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch purchase requests
      const { data: requestsData, error } = await supabase
        .from('purchase_requests')
        .select('*')
        .or(`customer_id.eq.${user.id},farmer_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!requestsData) {
        setRequests([]);
        return;
      }

      // Fetch profiles and products for each request
      const requestsWithDetails = await Promise.all(
        requestsData.map(async (request) => {
          // Fetch customer profile
          const { data: customerProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', request.customer_id)
            .single();

          // Fetch farmer profile
          const { data: farmerProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', request.farmer_id)
            .single();

          // Fetch products
          const { data: products } = await supabase
            .from('products')
            .select('id, name, price, category, image_url')
            .in('id', request.product_ids);

          return {
            ...request,
            customer_profile: customerProfile,
            farmer_profile: farmerProfile,
            products: products || [],
          };
        })
      );

      setRequests(requestsWithDetails);
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    farmer_id: string;
    product_ids: string[];
    quantities: number[];
    total_amount: number;
    message?: string;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('purchase_requests')
        .insert({
          customer_id: user.id,
          ...requestData,
        });

      if (error) throw error;

      toast({
        title: "Purchase Request Sent",
        description: "Your request has been sent to the farmer",
      });

      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error creating purchase request:', error);
      toast({
        title: "Error",
        description: "Failed to send purchase request",
        variant: "destructive",
      });
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('purchase_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Request Accepted" : "Request Rejected",
        description: `Purchase request has been ${status}`,
      });

      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const markAsPaid = async (requestId: string) => {
    try {
      // Get the request details first
      const { data: request, error: requestError } = await supabase
        .from('purchase_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update request status to paid
      const { error: updateError } = await supabase
        .from('purchase_requests')
        .update({ status: 'paid' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Reduce product quantities
      for (let i = 0; i < request.product_ids.length; i++) {
        const productId = request.product_ids[i];
        const purchasedQuantity = request.quantities[i];

        // Get current product
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', productId)
          .single();

        if (productError) {
          console.error('Error fetching product:', productError);
          continue;
        }

        const newQuantity = product.quantity - purchasedQuantity;

        if (newQuantity <= 0) {
          // Delete product if quantity is zero or less
          await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        } else {
          // Update quantity
          await supabase
            .from('products')
            .update({ quantity: newQuantity })
            .eq('id', productId);
        }
      }

      toast({
        title: "Payment Completed",
        description: "Payment has been processed and inventory updated",
      });

      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('purchase_requests')
        .delete()
        .eq('id', requestId);
      if (error) throw error;
      toast({
        title: 'Request Deleted',
        description: 'The purchase request has been deleted.',
      });
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete purchase request',
        variant: 'destructive',
      });
    }
  };

  const getUserRequests = () => {
    return requests.filter(request => request.customer_id === user?.id);
  };

  const getFarmerRequests = () => {
    return requests.filter(request => request.farmer_id === user?.id);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    markAsPaid,
    getUserRequests,
    getFarmerRequests,
    refreshRequests: fetchRequests,
    deleteRequest,
  };
};