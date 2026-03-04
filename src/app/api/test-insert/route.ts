import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name) { return cookieStore.get(name)?.value },
                }
            }
        )

        // Force a dummy user ID for testing. 
        // We bypass RLS using the Service Role Key anyway just to see if the table allows inserts.
        const dummyId = 'd1b54ac6-2244-4860-9dc4-177b9dcca967'

        // Attempt an insert
        const { data, error } = await supabase
            .from('customers')
            .insert({
                user_id: dummyId,
                display_name: 'Test API Customer ' + Date.now(),
                display_name_normalized: 'testapicustomer' + Date.now(),
                stage: 'interest'
            })
            .select()

        return NextResponse.json({ data, error })
    } catch (err: any) {
        return NextResponse.json({ catchRow: err.message })
    }
}
