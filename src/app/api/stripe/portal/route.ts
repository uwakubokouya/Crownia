import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
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

        let customerId = profile?.stripe_customer_id

        if (!customerId) {
            // Create a new customer in Stripe if one doesn't exist
            const newCustomer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    user_id: user.id
                }
            })
            customerId = newCustomer.id

            // Save to database
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/settings`,
        })

        return NextResponse.redirect(session.url)
    } catch (error) {
        console.error('Stripe Portal Error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
