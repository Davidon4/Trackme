'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      '/',
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return '/signin';
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  const name = String(formData.get('name'));
  let redirectPath: string;

  if (!isValidEmail(email)) {
    return getErrorRedirect(
      '/signup',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = await createClient();

  const emailRedirectTo = getURL('auth/v1/callback');

  const { error: signUpError, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: name,
      }
    }
  });

  if (signUpError) {
    redirectPath = getErrorRedirect(
      '/signup',
      'Sign up failed.',
      signUpError.message
    );
  } else if (data.user?.identities?.length === 0) {
    redirectPath = getErrorRedirect(
      '/signup',
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.'
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/email-confirmation',
      'Success!',
      'Please check your email for a confirmation link.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signup',
      'Something went wrong.',
      'You could not be signed up.'
    );
  }

  return redirectPath;
}