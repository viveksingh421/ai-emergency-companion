import { store } from "./store"

// Keep sessions in memory only for server-side API routes
const serverSessions: Record<string, { userId: string; expiresAt: number }> = {}

export const auth = {
  register(email: string, name: string, password: string) {
    const existingUser = store.getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    try {
      const user = store.createUser(email, name, password)
      const token = this.createSession(user.id)
      return { success: true, user, token }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  },

  login(email: string, password: string) {
    const user = store.getUserByEmail(email)
    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    const token = this.createSession(user.id)
    return { success: true, user, token }
  },

  createSession(userId: string): string {
    const token = `token_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const sessionData = {
      userId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    serverSessions[token] = sessionData
    return token
  },

  validateSession(token: string): { userId: string } | null {
    const session = serverSessions[token]

    if (!session) {
      return null
    }

    // Check if expired
    if (session.expiresAt < Date.now()) {
      delete serverSessions[token]
      return null
    }

    return { userId: session.userId }
  },

  logout(token: string): void {
    delete serverSessions[token]
  },
}
