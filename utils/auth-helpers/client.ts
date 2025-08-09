'use client';

import {createClient} from "@/utils/supabase/client";
import {type Provider} from "@supabase/supabase-js";
import { redirectToPath } from "./server";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function handleRequest(
    e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData) => Promise<string>,
  router: AppRouterInstance | null = null
  ): Promise<boolean | void> {
    // Prevent default form submission refresh
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
    const redirectUrl: string = await requestFunc(formData);

    if (router) {
      // If client-side router is provided, use it to redirect
      return router.push(redirectUrl);
    } else {
      // Otherwise, redirect server-side
      return await redirectToPath(redirectUrl);
  }
}


export async function signInWithOAuth(e: React.FormEvent<HTMLButtonElement>) {
  e.preventDefault();
  const provider = 'google';
  const supabase = createClient();
  
  console.log('Starting OAuth flow...');
  console.log('Redirect URL:', `${window.location.origin}/api/auth/v1/callback`);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${window.location.origin}/api/auth/v1/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });

  if (error) {
    console.error('OAuth error:', error);
    throw error;
  }

  console.log('OAuth response data:', data);
  return data;
}

export async function checkExistingAccounts(email: string) {
  const supabase = createClient();
  
  // Check for existing user
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();

  return {
    isUser: !!user,
  };
} 