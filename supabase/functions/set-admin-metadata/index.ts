import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

Deno.serve(async (req) => {
  const { userId } = await req.json()

  const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbmZvdHJ4aWlvZ3Zna3VxZGthIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI5NjE3OCwiZXhwIjoyMDcwODcyMTc4fQ.WIBlmRYbXmlwpbeZ71q1mj16g2TCM2NFlTgudNyJXr4';
  const SUPABASE_URL = 'https://sinfotrxiiogvgkuqdka.supabase.co';

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  )

  try {
    const { data: user, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (fetchError) {
      console.error('Error fetching user:', fetchError.message)
      return new Response(JSON.stringify({ error: fetchError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    const currentAppMetadata = user.user.app_metadata || {}
    const newAppMetadata = { ...currentAppMetadata, is_admin: true }

    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { app_metadata: newAppMetadata }
    )

    if (updateError) {
      console.error('Error updating user metadata:', updateError.message)
      return new Response(JSON.stringify({ error: updateError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ message: 'User metadata updated successfully', user: updatedUser }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unexpected error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})