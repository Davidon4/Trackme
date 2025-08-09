import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(getErrorRedirect('/error', 'No code provided'));
  }

  const supabase = await createClient();
  
  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(getErrorRedirect('/error', 'Auth session error'));
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.redirect(getErrorRedirect('/error', 'User not found'));
    }

    // Check if user exists in the database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      return NextResponse.redirect(getStatusRedirect('/dashboard', 'Welcome back!'));
    }

    // Create new user record
    const { error: createError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .single();

    if (createError) {
      return NextResponse.redirect(getErrorRedirect('/error', 'Failed to create user profile'));
    }

    return NextResponse.redirect(getStatusRedirect('/dashboard', 'Account created successfully!'));

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(getErrorRedirect('/error', 'Unexpected error during sign in'));
  }
}