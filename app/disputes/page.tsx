"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dispute } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { EscrowService } from '@/lib/escrow';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data, error } = await supabase
      .from('disputes')
      .select(`
        *,
        transactions:transaction_id (
          buyer_id,
          seller_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disputes:', error);
      return;
    }

    setDisputes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolveDispute = async (disputeId: string, refundBuyer: boolean) => {
    try {
      const escrowService = EscrowService.getInstance();
      await escrowService.resolveDispute(
        disputeId,
        refundBuyer ? 'Refund issued to buyer' : 'Funds released to seller',
        refundBuyer
      );
      fetchDisputes();
    } catch (error) {
      console.error('Error resolving dispute:', error);
    }
  };

  if (loading) {
    return <div className="container py-8">Loading disputes...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dispute Resolution Center</h1>
      <div className="grid gap-6">
        {disputes.map((dispute) => (
          <Card key={dispute.id}>
            <CardHeader>
              <CardTitle>Dispute #{dispute.id.slice(0, 8)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Reason:</h3>
                  <p className="text-muted-foreground">{dispute.reason}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status:</h3>
                  <p className="text-muted-foreground">{dispute.status}</p>
                </div>
                {dispute.status === 'open' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleResolveDispute(dispute.id, true)}
                    >
                      Refund Buyer
                    </Button>
                    <Button onClick={() => handleResolveDispute(dispute.id, false)}>
                      Release to Seller
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {disputes.length === 0 && (
          <p className="text-muted-foreground">No disputes found.</p>
        )}
      </div>
    </div>
  );
}