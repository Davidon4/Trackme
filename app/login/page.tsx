import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-8">
          <Zap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold">NextGen</span>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-muted-foreground mb-8">
          This is a placeholder login page. The signup functionality is fully implemented above.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/signup">Go to Sign Up</Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
