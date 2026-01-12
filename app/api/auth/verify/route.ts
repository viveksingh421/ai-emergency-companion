import { store } from "@/lib/store"
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
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

    const user = store.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Return user without password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emergencyContacts: user.emergencyContacts,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to verify token" }, { status: 500 })
  }
}
