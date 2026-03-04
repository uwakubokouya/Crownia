import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const subscription = event.data.object as Stripe.Subscription
    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        const userId = session.metadata?.userId

        if (userId) {
            await supabase
                .from('profiles')
                .update({
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    plan: 'basic', // default upgrade
                })
                .eq('id', userId)
        }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const status = subscription.status
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single()

        if (profile) {
            const plan = status === 'active' ? 'basic' : 'free'
            await supabase
                .from('profiles')
                .update({
                    stripe_subscription_id: subscription.id,
                    plan,
                })
                .eq('id', profile.id)
        }
    }

    return new NextResponse('OK', { status: 200 })
}
