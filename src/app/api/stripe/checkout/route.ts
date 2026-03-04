import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || new URL(req.url).origin

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            customer: profile?.stripe_customer_id || undefined,
            customer_email: profile?.stripe_customer_id ? undefined : user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/settings?success=true`,
            cancel_url: `${origin}/settings?canceled=true`,
            metadata: {
                userId: user.id,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Stripe Checkout Error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
