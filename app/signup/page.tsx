import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold">NextGen</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join thousands of developers building amazing products</p>
        </div>

        <SignupForm />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
