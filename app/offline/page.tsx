"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, Heart, BookOpen } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
          <h1 className="text-3xl font-bold">{isOnline ? "Online" : "Offline"} Emergency Numbers</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Banner */}
        {!isOnline && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 p-6 rounded-lg mb-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">No Internet Connection</p>
                <p className="text-sm mt-1">
                  You are currently offline. Emergency numbers listed below will always work.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Numbers Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Medical */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Medical Emergency</h2>
            </div>

            <div className="bg-background p-8 rounded-lg border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Call immediately if:</p>
              <p className="text-5xl font-bold text-primary font-mono">108</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold">Use this number for:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Severe injury or bleeding</li>
                <li>- Chest pain or difficulty breathing</li>
                <li>- Unconsciousness or unresponsiveness</li>
                <li>- Poisoning or overdose</li>
                <li>- Severe allergic reaction</li>
                <li>- Sudden severe illness</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "tel:108")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto gap-2"
            >
              <Phone className="w-5 h-5" />
              Call 108
            </Button>
          </div>

          {/* Police */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Police & Crime</h2>
            </div>

            <div className="bg-background p-8 rounded-lg border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Call immediately if:</p>
              <p className="text-5xl font-bold text-primary font-mono">100</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold">Use this number for:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Crime or theft</li>
                <li>- Assault or violence</li>
                <li>- Road accident with injury</li>
                <li>- Missing person</li>
                <li>- Suspicious activity</li>
                <li>- Personal safety threat</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "tel:100")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto gap-2"
            >
              <Phone className="w-5 h-5" />
              Call 100
            </Button>
          </div>

          {/* Fire */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Fire Emergency</h2>
            </div>

            <div className="bg-background p-8 rounded-lg border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Call immediately if:</p>
              <p className="text-5xl font-bold text-primary font-mono">101</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold">Use this number for:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Fire or smoke detected</li>
                <li>- Building in flames</li>
                <li>- Gas leak or smell</li>
                <li>- Explosion or blast</li>
                <li>- Electrical fire</li>
                <li>- Chemical spill or hazard</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "tel:101")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto gap-2"
            >
              <Phone className="w-5 h-5" />
              Call 101
            </Button>
          </div>

          {/* Disaster */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Disaster Management</h2>
            </div>

            <div className="bg-background p-8 rounded-lg border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Call immediately if:</p>
              <p className="text-5xl font-bold text-primary font-mono">1070</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-semibold">Use this number for:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Earthquake, flood, or cyclone</li>
                <li>- Landslide or natural disaster</li>
                <li>- Multiple casualties</li>
                <li>- Mass evacuation needed</li>
                <li>- Infrastructure damage</li>
                <li>- Disaster relief information</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "tel:1070")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto gap-2"
            >
              <Phone className="w-5 h-5" />
              Call 1070
            </Button>
          </div>
        </div>

        {/* Quick First-Aid Reference */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Quick First-Aid Tips</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">For Unconscious Person:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check responsiveness and breathing</li>
                <li>Call emergency services immediately</li>
                <li>Place in recovery position (on side)</li>
                <li>Keep airway clear</li>
                <li>Monitor breathing until help arrives</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">For Severe Bleeding:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Call emergency services immediately</li>
                <li>Apply direct pressure with clean cloth</li>
                <li>Keep pressure for 5-10 minutes</li>
                <li>Elevate injured area if possible</li>
                <li>Do not remove first cloth if bleeding</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">For Choking:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Ask "Are you choking?" (can't speak = yes)</li>
                <li>Stand behind person, wrap arms around</li>
                <li>Place fist above navel, below ribs</li>
                <li>Quick upward thrusts until object dislodges</li>
                <li>Call 108 if unsuccessful after few attempts</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">For Poisoning/Overdose:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Call 108 immediately with substance info</li>
                <li>Do not induce vomiting</li>
                <li>Keep sample of poison/medication</li>
                <li>Place person in recovery position</li>
                <li>Monitor breathing and consciousness</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">Important Reminders:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Always call emergency services first</strong> - Do not delay professional help for any
              recommendations
            </li>
            <li>
              <strong>Provide clear information:</strong> Location, nature of emergency, number of people affected
            </li>
            <li>
              <strong>Stay calm:</strong> Your composure helps emergency responders get information accurately
            </li>
            <li>
              <strong>Follow instructions:</strong> Listen carefully to what the dispatcher tells you to do
            </li>
            <li>
              <strong>Stay on the line:</strong> Unless told to disconnect by the operator
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-y-3">
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full py-6 text-lg h-auto bg-transparent">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
