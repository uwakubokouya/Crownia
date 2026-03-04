import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
    const { data, error } = await supabase
        .from('customers')
        .insert([
            {
                user_id: 'd1b54ac6-2244-4860-9dc4-177b9dcca967',
                display_name: 'Test Customer',
                display_name_normalized: 'testcustomer',
                stage: 'interest',
                current_type: null,
                notes: 'test'
            }
        ])
        .select()
        .single()

    console.log("DATA TYPE:", typeof data)
    console.dir(data, { depth: null })
    console.log("ERROR:", error)
}

test()
