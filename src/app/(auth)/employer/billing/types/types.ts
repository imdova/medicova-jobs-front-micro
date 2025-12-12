// src/types/types.ts
export interface BillingRecord {
    id: string;
    invoiceNumber: string;
    date: string;
    amount: string;
    plan: string;
    users: string;
    status: 'paid' | 'pending' | 'failed';
    pdfUrl?: string;
}

export interface PlanDetails {
    name: string;
    price: string;
    description: string;
    status: 'active' | 'inactive' | 'expired';
    users: {
        current: number;
        total: number;
        avatars: string[];
    };
}

export interface PaymentMethod {
    type: 'visa' | 'mastercard' | 'amex' | 'paypal';
    lastFour: string;
    expiry: string;
    email: string;
    isDefault: boolean;
}