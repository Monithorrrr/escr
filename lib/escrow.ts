import { supabase } from './supabase';
import { Transaction, EscrowAccount, Dispute } from './types';

export class EscrowService {
  private static instance: EscrowService;
  private monoPublicKey = 'test_pk_wxud6h6f5ghlthmxkqyr';
  private monoSecretKey = 'test_sk_tz98sm4az9ydfku21oou';

  private constructor() {}

  public static getInstance(): EscrowService {
    if (!EscrowService.instance) {
      EscrowService.instance = new EscrowService();
    }
    return EscrowService.instance;
  }

  async createEscrowTransaction(
    productId: string,
    buyerId: string,
    sellerId: string,
    amount: number
  ): Promise<Transaction> {
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          product_id: productId,
          buyer_id: buyerId,
          seller_id: sellerId,
          amount,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (transactionError) throw new Error(transactionError.message);

    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .insert([
        {
          transaction_id: transaction.id,
          balance: amount,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (escrowError) throw new Error(escrowError.message);

    return transaction;
  }

  async releaseEscrow(transactionId: string): Promise<void> {
    const { error: escrowError } = await supabase
      .from('escrow_accounts')
      .update({ status: 'released' })
      .eq('transaction_id', transactionId);

    if (escrowError) throw new Error(escrowError.message);

    const { error: transactionError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId);

    if (transactionError) throw new Error(transactionError.message);
  }

  async initiateDispute(
    transactionId: string,
    userId: string,
    reason: string
  ): Promise<Dispute> {
    const { data: dispute, error } = await supabase
      .from('disputes')
      .insert([
        {
          transaction_id: transactionId,
          created_by: userId,
          reason,
          status: 'open',
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    await supabase
      .from('transactions')
      .update({ status: 'disputed' })
      .eq('id', transactionId);

    return dispute;
  }

  async submitDisputeEvidence(
    disputeId: string,
    userId: string,
    description: string,
    fileUrls: string[]
  ): Promise<void> {
    const { error } = await supabase.from('dispute_evidence').insert([
      {
        dispute_id: disputeId,
        user_id: userId,
        description,
        file_urls: fileUrls,
      },
    ]);

    if (error) throw new Error(error.message);
  }

  async resolveDispute(
    disputeId: string,
    resolution: string,
    refundBuyer: boolean
  ): Promise<void> {
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .update({ status: 'resolved', resolution })
      .eq('id', disputeId)
      .select()
      .single();

    if (disputeError) throw new Error(disputeError.message);

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', dispute.transaction_id)
      .single();

    if (transactionError) throw new Error(transactionError.message);

    const escrowStatus = refundBuyer ? 'refunded' : 'released';
    await supabase
      .from('escrow_accounts')
      .update({ status: escrowStatus })
      .eq('transaction_id', transaction.id);
  }
}