import { store } from "@/lib/store"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { userId, type, latitude, longitude, mapsLink, contactIds } = await request.json()

    if (!userId || !type || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create emergency alert in store
    const alert = store.createEmergencyAlert(userId, type, latitude, longitude)

    // Send alert to contacts (simulated)
    store.sendAlertToContacts(alert.id, contactIds)

    // In production, here you would:
    // 1. Send SMS to emergency contacts using Twilio or similar
    // 2. Notify emergency services via API
    // 3. Log the alert to database
    // 4. Start tracking location updates

    console.log("[Emergency Alert]", {
      alertId: alert.id,
      type,
      location: { lat: latitude, lng: longitude },
      mapsLink,
      contactsAlerted: contactIds.length,
      timestamp: new Date(alert.timestamp).toISOString(),
    })

    return NextResponse.json({
      success: true,
      alert: {
        id: alert.id,
        type: alert.type,
        location: alert.location,
        contactsAlerted: contactIds.length,
      },
    })
  } catch (error) {
    console.error("Emergency alert error:", error)
    return NextResponse.json({ success: false, error: "Failed to send emergency alert" }, { status: 500 })
  }
}
