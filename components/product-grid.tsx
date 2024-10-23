"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { EscrowService } from '@/lib/escrow';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProducts();
    getUser();
  }, []);

  const handlePurchase = async (product: Product) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      const escrowService = EscrowService.getInstance();
      await escrowService.createEscrowTransaction(
        product.id,
        user.id,
        product.seller_id,
        product.price
      );
      router.push('/transactions');
    } catch (error) {
      console.error('Error creating escrow transaction:', error);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <AspectRatio ratio={4/3}>
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </AspectRatio>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{product.title}</CardTitle>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
                <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(product)}
                  disabled={user?.id === product.seller_id}
                >
                  {user?.id === product.seller_id ? 'Your Product' : 'Purchase with Escrow'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}