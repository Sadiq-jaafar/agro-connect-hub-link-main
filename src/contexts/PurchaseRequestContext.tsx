
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface PurchaseRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    category: string;
    image: string;
  }>;
  totalAmount: number;
  status: 'accepted' | 'pending' | 'rejected' | 'paid';
  requestDate: string;
  message?: string;
}

interface PurchaseRequestContextType {
  requests: PurchaseRequest[];
  addRequest: (request: Omit<PurchaseRequest, 'id' | 'requestDate'>) => void;
  updateRequestStatus: (requestId: string, status: 'accepted' | 'rejected') => void;
  markAsPaid: (requestId: string) => void;
  getUserRequests: (userId: string) => PurchaseRequest[];
  getFarmerRequests: (farmerId: string) => PurchaseRequest[];
}

const PurchaseRequestContext = createContext<PurchaseRequestContextType | undefined>(undefined);

export const usePurchaseRequest = () => {
  const context = useContext(PurchaseRequestContext);
  if (!context) {
    throw new Error('usePurchaseRequest must be used within a PurchaseRequestProvider');
  }
  return context;
};

export const PurchaseRequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const { toast } = useToast();

  const addRequest = (newRequest: Omit<PurchaseRequest, 'id' | 'requestDate'>) => {
    const request: PurchaseRequest = {
      ...newRequest,
      id: `REQ-${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
    };
    
    setRequests(prev => [...prev, request]);
    
    toast({
      title: "Purchase Request Sent",
      description: `Your request has been sent to ${newRequest.farmerName}`,
    });
  };

  const updateRequestStatus = (requestId: string, status: 'accepted' | 'rejected') => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
    
    toast({
      title: status === 'accepted' ? "Request Accepted" : "Request Rejected",
      description: `Purchase request ${requestId} has been ${status}`,
    });
  };

  const markAsPaid = (requestId: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: 'paid' as const } : request
      )
    );
    
    toast({
      title: "Payment Completed",
      description: `Payment for request ${requestId} has been processed`,
    });
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(request => request.customerId === userId);
  };

  const getFarmerRequests = (farmerId: string) => {
    return requests.filter(request => request.farmerId === farmerId);
  };

  return (
    <PurchaseRequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        markAsPaid,
        getUserRequests,
        getFarmerRequests,
      }}
    >
      {children}
    </PurchaseRequestContext.Provider>
  );
};
