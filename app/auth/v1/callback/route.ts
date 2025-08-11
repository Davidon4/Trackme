import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  console.log('Callback route hit');
  console.log('Incoming request.url:', request.url);
  
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const type = requestUrl.searchParams.get('type');
    console.log('Parsed code from callback URL:', code);
    console.log('Parsed type from callback URL:', type);
    
    if (!code) {
      return NextResponse.redirect(
        new URL(`/login?error=No code provided`, baseUrl)
      );
    }

    const supabase = await createClient();

    let user;
    
    // Handle different auth flows
    if (type === 'signup' || type === 'recovery') {
      // Email confirmation flow - use verifyOtp
      const { data, error } = await supabase.auth.verifyOtp({
        type: type as 'signup' | 'recovery',
        token_hash: code
      });
      
      if (error) {
        console.error('verifyOtp error:', error);
        throw error;
      }
      
      user = data.user;
      console.log('verifyOtp succeeded');
    } else {
      // OAuth flow - use exchangeCodeForSession
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error('exchangeCodeForSession error:', exchangeError);
        throw exchangeError;
      }
      console.log('exchangeCodeForSession succeeded');
      
      // Get the user data
      const { data: { user: oauthUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !oauthUser) {
        console.error('getUser error or no user:', userError);
        throw userError || new Error('User not found');
      }
      
      user = oauthUser;
      console.log('getUser succeeded:', { id: user.id, email: user.email });
    }

    if (!user) {
      throw new Error('No user found after authentication');
    }

    console.log('getUser succeeded:', { id: user.id, email: user.email });

    // Check if user exists in the database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      throw checkError;
    }
    console.log('Existing user check:', existingUser ? 'found' : 'not found');

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
        console.error('Error inserting new user:', insertError);
        throw insertError;
      }
      console.log('Inserted new user row');
    }

    // For OAuth flows, redirect to dashboard with tracking restoration
    if (!type || type !== 'signup') {
      return NextResponse.redirect(new URL('/dashboard?oauth_success=true', baseUrl));
    }

    // For email confirmation, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', baseUrl));

  } catch (error) {
    console.error('Callback route error:', error);
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
    return NextResponse.redirect(
      new URL(`/login?error=Authentication failed&error_description=${
        error instanceof Error ? error.message : 'Unknown error'
      }`, baseUrl)
    );
  }
}