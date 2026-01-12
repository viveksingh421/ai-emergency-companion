import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = auth.register(email, name, password)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        name: result.user!.name,
        emergencyContacts: result.user!.emergencyContacts,
      },
      token: result.token,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
