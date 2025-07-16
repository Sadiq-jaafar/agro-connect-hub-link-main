-- Create purchase requests table that sends details to backend
CREATE TABLE IF NOT EXISTS public.purchase_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  farmer_id UUID NOT NULL,
  product_ids UUID[] NOT NULL,
  quantities INTEGER[] NOT NULL,
  total_amount NUMERIC NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers can create purchase requests" 
ON public.purchase_requests 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view their own purchase requests" 
ON public.purchase_requests 
FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() = farmer_id);

CREATE POLICY "Farmers can update requests for their products" 
ON public.purchase_requests 
FOR UPDATE 
USING (auth.uid() = farmer_id);

-- Add updated_at trigger
CREATE TRIGGER update_purchase_requests_updated_at
BEFORE UPDATE ON public.purchase_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();