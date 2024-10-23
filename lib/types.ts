export interface User {
  id: string;
  email: string;
  wallet_balance: number;
  role: 'buyer' | 'seller';
  verification_status: 'pending' | 'verified';
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  status: 'available' | 'pending' | 'sold';
  images: string[];
  created_at: string;
}

export interface Transaction {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'in_escrow' | 'completed' | 'disputed';
  escrow_id: string;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  transaction_id: string;
  created_by: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution?: string;
  evidence?: DisputeEvidence[];
  created_at: string;
  updated_at: string;
}

export interface DisputeEvidence {
  id: string;
  dispute_id: string;
  user_id: string;
  description: string;
  file_urls: string[];
  created_at: string;
}

export interface EscrowAccount {
  id: string;
  transaction_id: string;
  balance: number;
  status: 'active' | 'released' | 'refunded';
  created_at: string;
}