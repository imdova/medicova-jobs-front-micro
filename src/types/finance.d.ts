/// transactions

export interface TransactionType {
  id: string;
  invoice_id: string;
  created_at: string;
  payment_method: string;
  type: "subscription" | "add-on";
  plan: string;
  planId: string;
  employer: {
    image: string;
    username: string;
    name: string;
  };
  total_amount: number;
  download_receipt_url: string;
}

/// plans

export interface SubscriptionPlan {
  id: string;
  name: string;
  optionTo?: string;
  description: string;
  highlight: boolean;
  badge?: string;
  duration: number;
  vat: number;
  vatDescription: string;
  price: number;
  discountedPrice?: number;
  currency?: string;
  features: { name: string; tag?: string }[];
  views: number;
  unlocks: number;
  jobs: number;
  invitations: number;
  users: number;
  extraAccess: number;
  status: "active" | "inactive";

  created_at: string;
}

export interface PlansReport {
  id: string;
  name: string;
  price: number;
  purchases: number;
  employers: number;
  revenue: number;
  status: "active" | "inactive";
}

/// invoices

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

export interface InvoiceType {
  id: string;
  created_at: string;
  due_date: string;
  // from: {
  //   name: string;
  //   address: string;
  //   email: string;
  //   phone: string;
  // };

  created_by: {
    id: string;
    image: string;
    name: string;
    role: string;
  };
  isCreatedBySystem: boolean;
  type: "subscription" | "add-on";
  payment_method?: string | null;
  status: "paid" | "overdue" | "canceled" | "pending";
  payment_type: "one-time" | "recurring";
  employer: {
    id: string;
    image: string;
    username: string;
    name: string;
    // email: string;
    // phone: string;
    // country: string;
    // state: string;
    // city: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  currency: string;
  tax: number;
  total: number;
}

/// ad-ons

export type AddonStatus =
  | "draft"
  | "active"
  | "inactive"
  | "historical"
  | "deleted";

export interface AddonFeature {
  jobs?: number; // Number of job posts included
  unlocks?: number; // Number of candidate profile unlocks
  invites?: number; // Number of invitations employer can send
  views?: number; // Number of job views (if applicable)
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number; // Base price before VAT/discount
  vatPercent: number;
  discountPercent: number;
  totalPrice: number; // After discount + VAT
  currency: string; // e.g., "USD", "EUR", "EGP"
  badge?: string; // e.g., "Most Popular"
  isHighlighted: boolean;
  status: AddonStatus;
  active: boolean;
  isHistorical: boolean;
  features: AddonFeature;
  createdAt: string;
  updatedAt: string;
}

/// features
export interface FeatureTier {
  min: number; // inclusive
  max: number; // inclusive
  unitPrice: number; // price per unit in this range
}

export interface Feature {
  id: string;
  name: string; // e.g., "Unlocks"
  description: string;
  unit: string; // e.g., "per unlock"
  tiers: FeatureTier[]; // tiered pricing rules
  isActive: boolean; // whether users can select this feature
  currency: string;
}
