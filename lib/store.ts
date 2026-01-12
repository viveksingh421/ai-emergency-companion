interface User {
  id: string
  email: string
  name: string
  password: string
  emergencyContacts: EmergencyContact[]
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
}

interface EmergencyAlert {
  id: string
  userId: string
  type: "medical" | "accident" | "fire" | "disaster"
  location: { lat: number; lng: number }
  timestamp: number
  alertsSent: string[] // contact IDs
}

// Get users from localStorage or initialize empty
const getUsers = (): Map<string, User> => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("emergency_users")
    if (stored) {
      const data = JSON.parse(stored)
      return new Map(Object.entries(data))
    }
  }
  return new Map()
}

// Save users to localStorage
const saveUsers = (users: Map<string, User>) => {
  if (typeof window !== "undefined") {
    const data = Object.fromEntries(users)
    localStorage.setItem("emergency_users", JSON.stringify(data))
  }
}

// In-memory storage with localStorage persistence
let users: Map<string, User> = getUsers()
const emergencyAlerts: Map<string, EmergencyAlert> = new Map()

export const store = {
  _getUsers(): Map<string, User> {
    users = getUsers()
    return users
  },

  // User operations
  createUser(email: string, name: string, password: string): User {
    const id = Math.random().toString(36).substring(2, 11)
    const user: User = {
      id,
      email,
      name,
      password,
      emergencyContacts: [],
    }
    const currentUsers = this._getUsers()
    currentUsers.set(id, user)
    saveUsers(currentUsers)
    users = currentUsers
    return user
  },

  getUserByEmail(email: string): User | undefined {
    const currentUsers = this._getUsers()
    return Array.from(currentUsers.values()).find((u) => u.email === email)
  },

  getUserById(id: string): User | undefined {
    const currentUsers = this._getUsers()
    return currentUsers.get(id)
  },

  // Emergency contact operations
  addEmergencyContact(userId: string, name: string, phone: string): EmergencyContact | null {
    const currentUsers = this._getUsers()
    const user = currentUsers.get(userId)
    if (!user) return null
    if (user.emergencyContacts.length >= 5) return null

    const contact: EmergencyContact = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      phone,
    }
    user.emergencyContacts.push(contact)
    currentUsers.set(userId, user)
    saveUsers(currentUsers)
    users = currentUsers
    return contact
  },

  removeEmergencyContact(userId: string, contactId: string): boolean {
    const currentUsers = this._getUsers()
    const user = currentUsers.get(userId)
    if (!user) return false
    const index = user.emergencyContacts.findIndex((c) => c.id === contactId)
    if (index === -1) return false
    user.emergencyContacts.splice(index, 1)
    currentUsers.set(userId, user)
    saveUsers(currentUsers)
    users = currentUsers
    return true
  },

  // Emergency alert operations
  createEmergencyAlert(
    userId: string,
    type: "medical" | "accident" | "fire" | "disaster",
    lat: number,
    lng: number,
  ): EmergencyAlert {
    const id = Math.random().toString(36).substring(2, 11)
    const alert: EmergencyAlert = {
      id,
      userId,
      type,
      location: { lat, lng },
      timestamp: Date.now(),
      alertsSent: [],
    }
    emergencyAlerts.set(id, alert)
    return alert
  },

  getEmergencyAlerts(userId: string): EmergencyAlert[] {
    return Array.from(emergencyAlerts.values()).filter((a) => a.userId === userId)
  },

  sendAlertToContacts(alertId: string, contactIds: string[]): boolean {
    const alert = emergencyAlerts.get(alertId)
    if (!alert) return false
    alert.alertsSent = contactIds
    return true
  },
}
