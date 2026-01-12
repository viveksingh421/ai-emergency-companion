"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Users } from "lucide-react"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Emergency Button - Large and Prominent */}
        <div className="mb-12">
          <Link href="/emergency">
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-8 text-2xl font-bold h-auto rounded-lg shadow-xl animate-pulse hover:animate-none"
            >
              🚨 I NEED HELP
            </Button>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Emergency Contacts Card */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Emergency Contacts</h2>
            </div>

            {user.emergencyContacts.length === 0 ? (
              <p className="text-muted-foreground mb-6">
                You haven't added any emergency contacts yet. Add 2-5 trusted people who will be alerted in an
                emergency.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {user.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between bg-background p-3 rounded">
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link href="/contacts">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {user.emergencyContacts.length === 0 ? "Add Contacts" : "Manage Contacts"}
              </Button>
            </Link>
          </div>

          {/* Quick Info Card */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Emergency Info</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-background p-4 rounded">
                <p className="text-sm text-muted-foreground mb-1">Medical Emergencies</p>
                <p className="text-lg font-semibold">Call 108</p>
              </div>
              <div className="bg-background p-4 rounded">
                <p className="text-sm text-muted-foreground mb-1">Police</p>
                <p className="text-lg font-semibold">Call 100</p>
              </div>
              <div className="bg-background p-4 rounded">
                <p className="text-sm text-muted-foreground mb-1">Fire Emergency</p>
                <p className="text-lg font-semibold">Call 101</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            When you press the emergency button above, we'll ask you about your situation, share your location with
            emergency contacts, and provide step-by-step guidance based on the type of emergency.
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure you have added emergency contacts before an emergency occurs.
          </p>
        </div>
      </div>
    </div>
  )
}
