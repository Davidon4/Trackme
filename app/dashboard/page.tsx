"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap } from "lucide-react"
import Link from "next/link";
import {useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";

export default function DashboardPage() {
    const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Zap className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">NextGen</span>
          </Link>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Welcome to NextGen!</CardTitle>
              <CardDescription>
                Your account has been created successfully. You're now ready to start building amazing products.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                This is your dashboard where you can manage your projects, view analytics, and access all NextGen
                features.
              </p>
              <div className="flex gap-4 justify-center">
                <Button>Get Started</Button>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
