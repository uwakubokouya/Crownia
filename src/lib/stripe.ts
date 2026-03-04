import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-02-25.clover', // Required type version
    appInfo: {
        name: 'Crownia',
        version: '1.0.0',
    },
})
