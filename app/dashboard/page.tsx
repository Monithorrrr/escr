"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Product, Transaction } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(profile);

      // Fetch user's products
      const { data: userProducts } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      setProducts(userProducts || []);

      // Fetch user's transactions
      const { data: userTransactions } = await supabase
        .from('transactions')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5);
      setTransactions(userTransactions || []);
    };

    fetchData();
  }, [router]);

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email: {user.email}</p>
              <p className="text-sm text-muted-foreground">
                Role: {userProfile.role || 'Not set'}
              </p>
              <p className="text-sm text-muted-foreground">
                Wallet Balance: ${userProfile.wallet_balance || '0.00'}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {userProfile.verification_status}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </div>
                  <span className="text-sm">{product.status}</span>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground">No products listed</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">${transaction.amount}</p>
                    <p className="text-sm text-muted-foreground">{transaction.status}</p>
                  </div>
                  <span className="text-sm">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}