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

    const { name, phone } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const user = store.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const contact = store.addEmergencyContact(user.id, name, phone)
    if (!contact) {
      return NextResponse.json({ success: false, error: "Could not add contact (max 5 reached)" }, { status: 400 })
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add contact" }, { status: 500 })
  }
}
