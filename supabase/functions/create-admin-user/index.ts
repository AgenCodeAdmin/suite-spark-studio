import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

Deno.serve(async (req) => {
  const { email, password } = await req.json()

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
    // Create the user
    const { data: user, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      app_metadata: { is_admin: true } // Set admin metadata directly
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError.message)
      return new Response(JSON.stringify({ error: createUserError.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ message: 'Admin user created successfully', user: user }), {
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