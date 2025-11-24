import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the service role key
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function GET() {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

        if (error) throw error

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
