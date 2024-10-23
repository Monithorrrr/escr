"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EscrowService } from '@/lib/escrow';

interface DisputeFormProps {
  transactionId: string;
  userId: string;
  onDisputeSubmitted: () => void;
}

export function DisputeForm({ transactionId, userId, onDisputeSubmitted }: DisputeFormProps) {
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const escrowService = EscrowService.getInstance();
      const dispute = await escrowService.initiateDispute(transactionId, userId, reason);

      if (evidence.length > 0) {
        // Handle file uploads to Supabase Storage
        const fileUrls = await Promise.all(
          evidence.map(async (file) => {
            const fileName = `${dispute.id}/${file.name}`;
            const { data, error } = await supabase.storage
              .from('dispute-evidence')
              .upload(fileName, file);
            if (error) throw error;
            return data.path;
          })
        );

        await escrowService.submitDisputeEvidence(
          dispute.id,
          userId,
          'Initial evidence submission',
          fileUrls
        );
      }

      onDisputeSubmitted();
    } catch (error) {
      console.error('Error submitting dispute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Dispute</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe your dispute reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Input
              type="file"
              multiple
              onChange={(e) => setEvidence(Array.from(e.target.files || []))}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload any relevant evidence (images, documents, etc.)
            </p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}