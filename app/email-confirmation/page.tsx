import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getErrorRedirect, getStatusRedirect, getURL } from "@/utils/helpers";
import { redirectToPath } from "@/utils/auth-helpers/server";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Script from "next/script";

type EmailConfirmationPageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EmailConfirmationPage({ searchParams }: EmailConfirmationPageProps) {
  const resolvedSearchParams = await searchParams;
  const sp = resolvedSearchParams || {};
  
  async function resendVerification(formData: FormData) {
    'use server'
    const email = String(formData.get('email') || '').trim();
    console.log('[email-confirmation] Resend requested for:', email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      console.log('[email-confirmation] Invalid email provided');
      return redirectToPath(
        getErrorRedirect('/email-confirmation', 'Invalid email', 'Please enter a valid email address.')
      );
    }

    const supabase = await createClient();
    const emailRedirectTo = getURL('/auth/v1/callback');
    console.log('[email-confirmation] Using emailRedirectTo:', emailRedirectTo);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo }
    });

    if (error) {
      console.error('[email-confirmation] Resend error:', error);
      return redirectToPath(
        getErrorRedirect('/email-confirmation', 'Could not resend email', error.message)
      );
    }

    console.log('[email-confirmation] Resend succeeded');
    return redirectToPath(
      getStatusRedirect('/email-confirmation', 'Email sent', 'Please check your inbox for a new confirmation link.')
    );
  }

  const status = (sp.status as string) || '';
  const statusDescription = (sp.status_description as string) || '';
  const error = (sp.error as string) || '';
  const errorDescription = (sp.error_description as string) || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Script 
        src="https://www.reddimon.com/reddimon-tracker.js" 
        async 
        defer 
        strategy="afterInteractive"
      />
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Confirm your email</CardTitle>
            <CardDescription className="text-center">
              We sent you a confirmation link. Click the link in your email to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status && (
              <Alert>
                <AlertTitle>{status}</AlertTitle>
                {statusDescription && (
                  <AlertDescription>{statusDescription}</AlertDescription>
                )}
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>{error}</AlertTitle>
                {errorDescription && (
                  <AlertDescription>{errorDescription}</AlertDescription>
                )}
              </Alert>
            )}

            <form className="space-y-4" action={resendVerification}>
              <div className="space-y-2">
                <Label htmlFor="email">Didn&apos;t receive an email? Resend it</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <Button type="submit" className="w-full">Resend confirmation email</Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Wrong email? <Link className="underline" href="/signup">Go back to sign up</Link>
              </p>
              <p className="mt-2">
                Already confirmed? <Link className="underline" href="/login">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}