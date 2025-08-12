"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react"
import {signInWithOAuth} from "@/utils/auth-helpers/client"

type SignupFormProps = {
  onSignUp: (formData: FormData) => Promise<void>;
}

export function SignupForm({ onSignUp }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    console.log('[Reddimon Debug] Google signin clicked');
    console.log('[Reddimon Debug] window.Reddimon available:', !!window.Reddimon);
    
    // Preserve tracking data before OAuth redirect
    if (typeof window !== 'undefined' && window.Reddimon) {
      const trackingData = window.Reddimon.getTrackingData();
      console.log('[Reddimon Debug] Tracking data before OAuth:', trackingData);
      
      if (trackingData.reddimon_link_id) {
        sessionStorage.setItem('reddimon_temp', JSON.stringify(trackingData));
        console.log('[Reddimon Debug] Saved tracking data to sessionStorage');
      } else {
        console.log('[Reddimon Debug] No reddimon_link_id found in tracking data');
      }
    } else {
      console.log('[Reddimon Debug] Reddimon not available or window undefined');
    }
    
    setIsLoading(true);
    try {
      await signInWithOAuth(e);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (formData: FormData) => {
    console.log('[Reddimon Debug] Email signup form submitted');
    console.log('[Reddimon Debug] window.Reddimon available:', !!window.Reddimon);
    
    // Track the conversion manually for email signup
    if (typeof window !== 'undefined' && window.Reddimon) {
      console.log('[Reddimon Debug] Attempting to track email signup');
      try {
        const result = await window.Reddimon.trackSignup();
        console.log('[Reddimon Debug] Email signup tracking result:', result);
      } catch (error) {
        console.error('[Reddimon Debug] Error tracking email signup:', error);
      }
    } else {
      console.log('[Reddimon Debug] Reddimon not available for email signup tracking');
    }
    
    await onSignUp(formData);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign up</CardTitle>
        <CardDescription className="text-center">Choose your preferred signup method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Signup Button */}
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>


        {/* Signup Form */}
        <form className="space-y-4" action={handleEmailSignUp}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

        <Button
          type="submit"
          className="w-full h-11 bg-violet-500 hover:bg-violet-600 text-white"
          disabled={isLoading}
        >
          Create account
          <span className="ml-1">→</span>
        </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
