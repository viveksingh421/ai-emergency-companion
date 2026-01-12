"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle, Phone, Copy, Check } from "lucide-react"
import Link from "next/link"

type EmergencyType = "medical" | "accident" | "fire" | "disaster" | null

interface LocationData {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
}

export default function EmergencyPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [alertsSent, setAlertsSent] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  if (!user || !token) {
    router.push("/login")
    return null
  }

  const emergencyDescriptions = {
    medical: {
      title: "Medical Emergency",
      description: "Injury, sudden illness, or health crisis",
      color: "text-red-600",
    },
    accident: {
      title: "Accident",
      description: "Road traffic, fall, or collision incident",
      color: "text-orange-600",
    },
    fire: {
      title: "Fire Emergency",
      description: "Fire, smoke, or explosion hazard",
      color: "text-red-700",
    },
    disaster: {
      title: "Disaster",
      description: "Natural disaster or major incident",
      color: "text-red-800",
    },
  }

  const getLocation = () => {
    setIsLoadingLocation(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        })
        setIsLoadingLocation(false)
      },
      (error) => {
        setLocationError(`Could not get location: ${error.message}`)
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const generateMapsLink = (): string => {
    if (!location) return ""
    return `https://maps.google.com/?q=${location.lat},${location.lng}`
  }

  const sendEmergencyAlert = async () => {
    if (!emergencyType || !location || user.emergencyContacts.length === 0) {
      return
    }

    try {
      const mapsLink = generateMapsLink()
      const response = await fetch("/api/emergency/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          type: emergencyType,
          latitude: location.lat,
          longitude: location.lng,
          mapsLink,
          contactIds: user.emergencyContacts.map((c) => c.id),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAlertsSent(true)
      }
    } catch (error) {
      console.error("Failed to send alerts")
    }
  }

  const copyMapsLink = () => {
    const link = generateMapsLink()
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Step 1: Select Emergency Type
  if (!emergencyType) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              × Close
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            <div className="bg-card border border-border rounded-lg p-8 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">Emergency Situation</h1>
                <p className="text-muted-foreground text-lg">
                  Select the type of emergency you're experiencing so we can provide the right guidance
                </p>
              </div>

              <div className="space-y-4">
                {(Object.keys(emergencyDescriptions) as EmergencyType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmergencyType(type)}
                    className="w-full bg-background border border-border hover:border-primary hover:bg-primary/5 rounded-lg p-6 text-left transition space-y-2"
                  >
                    <h3 className={`text-xl font-bold ${emergencyDescriptions[type].color}`}>
                      {emergencyDescriptions[type].title}
                    </h3>
                    <p className="text-muted-foreground">{emergencyDescriptions[type].description}</p>
                  </button>
                ))}
              </div>

              {user.emergencyContacts.length === 0 && (
                <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 p-4 rounded-lg">
                  <p className="font-semibold">Note:</p>
                  <p className="text-sm">
                    You haven't added emergency contacts yet.{" "}
                    <Link href="/contacts" className="underline hover:no-underline">
                      Add contacts
                    </Link>{" "}
                    to alert them during emergencies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Get Location & Send Alerts
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => {
            setEmergencyType(null)
            setLocation(null)
            setAlertsSent(false)
          }}
          className="text-muted-foreground hover:text-foreground transition"
        >
          × Close
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {!alertsSent ? (
            <div className="bg-card border border-border rounded-lg p-8 space-y-8">
              {/* Emergency Type Confirmation */}
              <div className="space-y-4">
                <p className="text-muted-foreground">Emergency Type Selected:</p>
                <div className="bg-background p-6 rounded-lg border border-primary/30">
                  <h2 className={`text-2xl font-bold ${emergencyDescriptions[emergencyType].color}`}>
                    {emergencyDescriptions[emergencyType].title}
                  </h2>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Your Location
                </h3>

                {!location ? (
                  <div className="space-y-4">
                    {locationError && (
                      <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
                        {locationError}
                      </div>
                    )}
                    <Button
                      onClick={getLocation}
                      disabled={isLoadingLocation}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto"
                    >
                      {isLoadingLocation ? "Getting Location..." : "Share My Location"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      We'll share your live location with emergency services and your emergency contacts.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-background p-6 rounded-lg border border-border space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Latitude</p>
                        <p className="text-lg font-mono">{location.lat.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Longitude</p>
                        <p className="text-lg font-mono">{location.lng.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                        <p className="text-lg font-mono">{Math.round(location.accuracy)} meters</p>
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-700/50 text-green-200 p-4 rounded-lg flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <p>Location acquired successfully</p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={copyMapsLink} variant="outline" className="flex-1 gap-2 bg-transparent">
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Map Link
                          </>
                        )}
                      </Button>
                      <Button onClick={getLocation} variant="outline" className="flex-1 bg-transparent">
                        Refresh Location
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contacts Alert Preview */}
              {user.emergencyContacts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Will Alert These Contacts
                  </h3>
                  <div className="space-y-2">
                    {user.emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-background p-4 rounded-lg border border-border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <Phone className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Alert Button */}
              <Button
                onClick={sendEmergencyAlert}
                disabled={!location}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto font-bold"
              >
                Send Emergency Alert
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By sending this alert, emergency contacts and services will be notified of your location and situation.
              </p>
            </div>
          ) : (
            /* Alert Sent Confirmation */
            <div className="bg-card border border-border rounded-lg p-8 space-y-8 text-center">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-400" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-green-400">Alert Sent!</h2>
                <p className="text-lg text-muted-foreground">
                  Emergency alerts have been sent to {user.emergencyContacts.length} contact
                  {user.emergencyContacts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border space-y-4">
                <p className="font-semibold">Alert includes:</p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Your name: {user.name}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Emergency type: {emergencyDescriptions[emergencyType].title}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Live location link: {location ? "Included" : "Unknown"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Timestamp: {location ? new Date(location.timestamp).toLocaleTimeString() : "Unknown"}
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/guidance")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg h-auto"
                >
                  View First-Aid Guidance
                </Button>

                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full py-6 text-lg h-auto bg-transparent">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
