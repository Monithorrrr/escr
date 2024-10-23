"use client";

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/types';
import { EscrowService } from '@/lib/escrow';
import { DisputeForm } from './dispute-form';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TransactionCardProps {
  transaction: Transaction;
  currentUserId: string;
  onStatusChange: () => void;
}

export function TransactionCard({ transaction, currentUserId, onStatusChange }: TransactionCardProps) {
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmDelivery = async () => {
    setIsProcessing(true);
    try {
      const escrowService = EscrowService.getInstance();
      await escrowService.releaseEscrow(transaction.id);
      onStatusChange();
    } catch (error) {
      console.error('Error confirming delivery:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isBuyer = currentUserId === transaction.buyer_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction #{transaction.id.slice(0, 8)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{transaction.status}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-medium">${transaction.amount}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isBuyer && transaction.status === 'in_escrow' && (
          <>
            <Button
              variant="outline"
              onClick={() => setShowDisputeForm(true)}
              disabled={isProcessing}
            >
              Open Dispute
            </Button>
            <Button onClick={handleConfirmDelivery} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Confirm Delivery'}
            </Button>
          </>
        )}
      </CardFooter>

      <AlertDialog open={showDisputeForm} onOpenChange={setShowDisputeForm}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <DisputeForm
            transactionId={transaction.id}
            userId={currentUserId}
            onDisputeSubmitted={() => {
              setShowDisputeForm(false);
              onStatusChange();
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}