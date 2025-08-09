import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  console.log('Callback route hit');
  
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(
        new URL(`/login?error=No code provided`, baseUrl)
      );
    }

    const supabase = await createClient();

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      throw exchangeError;
    }

    // Get the user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw userError || new Error('User not found');
    }

    // Check if user exists in the database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.redirect(new URL('/dashboard', baseUrl));

  } catch (error) {
    console.error('Callback route error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=Authentication failed&error_description=${
        error instanceof Error ? error.message : 'Unknown error'
      }`, baseUrl)
    );
  }
}