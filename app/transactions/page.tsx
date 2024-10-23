"use client";

import { useEffect, useState } from 'react';
import { TransactionCard } from '@/components/transaction-card';
import { Transaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const userId = session.session.user.id;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="container py-8">Loading transactions...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Transactions</h1>
      <div className="grid gap-6">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            currentUserId={supabase.auth.user()?.id || ''}
            onStatusChange={fetchTransactions}
          />
        ))}
        {transactions.length === 0 && (
          <p className="text-muted-foreground">No transactions found.</p>
        )}
      </div>
    </div>
  );
}