"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { AlertCircle, Shield, MapPin } from "lucide-react"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="text-2xl font-bold text-primary">Emergency Companion</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Help. Faster. When Every Second Matters.
          </h1>

          <p className="text-xl text-muted-foreground">
            AI-powered emergency assistance for medical, accident, and disaster situations. Get immediate first-aid
            guidance and alert your emergency contacts instantly.
          </p>

          <div className="space-y-4 pt-4">
            <div className="inline-block text-lg italic text-primary">"In emergencies, clarity saves lives."</div>
            <div className="inline-block text-lg italic text-primary">
              "You're never alone when help is one tap away."
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg h-auto">
                Get Started Now
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg h-auto bg-transparent">
              Emergency Help
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">One-Tap Help</h3>
              <p className="text-muted-foreground">
                Press the emergency button and select your situation type. We guide you through every step.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Live Location</h3>
              <p className="text-muted-foreground">
                Your location is automatically shared with emergency services and your trusted contacts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">AI First-Aid</h3>
              <p className="text-muted-foreground">
                Get step-by-step first-aid instructions tailored to your emergency type, instantly available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Emergency Numbers - India</h2>
          <p className="text-lg text-muted-foreground">Always accessible, even without internet:</p>

          <div className="grid sm:grid-cols-2 gap-4 pt-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Ambulance/Medical</div>
              <div className="text-3xl font-bold text-primary mt-2">108</div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Police</div>
              <div className="text-3xl font-bold text-primary mt-2">100</div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Fire</div>
              <div className="text-3xl font-bold text-primary mt-2">101</div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground">Disaster Management</div>
              <div className="text-3xl font-bold text-primary mt-2">1070</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6 text-center text-muted-foreground space-y-2">
        <p>&copy; 2025 Emergency Companion. Built for saving lives.</p>
        <p className="text-sm">Created by VS Team</p>
      </footer>
    </div>
  )
}
