import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  price: number;
  quantity: number;
  description: string | null;
  image_url: string | null;
  product_type: 'crop' | 'livestock' | 'service' | 'device';
  duration: string | null;
  what_included: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  farmer_id: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts((data ?? []) as Product[]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Error fetching products:', err);
      toast({
        title: "Error fetching products",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => [data as Product, ...prev]);
      toast({
        title: "Product added successfully",
        description: "Your product is now available in the marketplace.",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => prev.map(p => p.id === id ? data as Product : p));
      toast({
        title: "Product updated successfully",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Product removed successfully",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error removing product",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};