import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
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

    return NextResponse.redirect(getStatusRedirect('/dashboard', 'Successfully signed in!'));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(getErrorRedirect('/error', 'Authentication failed'));
  }
}