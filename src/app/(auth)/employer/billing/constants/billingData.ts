// src/constants/billingData.ts
import { BillingRecord, PlanDetails, PaymentMethod } from '../types/types';

export const planDetails: PlanDetails = {
    name: 'Basic plan',
    price: '$20',
    description: 'Our most popular plan for small teams.',
    status: 'active',
    users: {
        current: 10,
        total: 15,
        avatars: [
            'https://randomuser.me/api/portraits/women/44.jpg',
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/68.jpg',
            'https://randomuser.me/api/portraits/men/22.jpg',
        ],
    },
};
export const paymentMethods: PaymentMethod[] = [
    {
        type: 'visa',
        lastFour: '1234',
        expiry: '06/2024',
        email: 'billing@untitledui.com',
        isDefault: true,
    },
    {
        type: 'mastercard',
        lastFour: '5678',
        expiry: '09/2024',
        email: 'billing@untitledui.com',
        isDefault: false,
    },
    {
        type: 'amex',
        lastFour: '9012',
        expiry: '12/2024',
        email: 'billing@untitledui.com',
        isDefault: false,
    }
];

export const billingHistory: BillingRecord[] = [
    {
        id: '1',
        invoiceNumber: '007',
        date: 'Dec 1, 2022',
        amount: 'USD $10.00',
        plan: 'Basic plan',
        users: '10 users',
        status: 'paid',
    },
    {
        id: '2',
        invoiceNumber: '006',
        date: 'Nov 1, 2022',
        amount: 'USD $10.00',
        plan: 'Basic plan',
        users: '10 users',
        status: 'paid',
    },
    {
        id: '3',
        invoiceNumber: '005',
        date: 'Oct 1, 2022',
        amount: 'USD $10.00',
        plan: 'Basic plan',
        users: '10 users',
        status: 'paid',
    },
];