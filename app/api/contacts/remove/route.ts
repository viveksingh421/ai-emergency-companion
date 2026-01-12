import { store } from "@/lib/store"
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const session = auth.validateSession(token)
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const { contactId } = await request.json()

    if (!contactId) {
      return NextResponse.json({ success: false, error: "Missing contact ID" }, { status: 400 })
    }

    const user = store.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const success = store.removeEmergencyContact(user.id, contactId)
    if (!success) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to remove contact" }, { status: 500 })
  }
}
