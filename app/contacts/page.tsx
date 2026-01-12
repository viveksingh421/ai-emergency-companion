"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EmergencyContact {
  id: string
  name: string
  phone: string
}

export default function ContactsPage() {
  const { user, token, refreshUser } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", phone: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user?.emergencyContacts) {
      setContacts(user.emergencyContacts)
    }
  }, [user])

  if (!user || !token) {
    router.push("/login")
    return null
  }

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newContact.name || !newContact.phone) {
      setError("Please fill in all fields")
      return
    }

    if (contacts.length >= 5) {
      setError("You can only add up to 5 emergency contacts")
      return
    }

    try {
      const response = await fetch("/api/contacts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newContact.name,
          phone: newContact.phone,
        }),
      })

      const data = await response.json()
      if (data.success) {
        await refreshUser()
        setNewContact({ name: "", phone: "" })
        setSuccess("Contact added successfully")
        setIsAdding(false)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to add contact")
      }
    } catch (err) {
      setError("Failed to add contact")
    }
  }

  const handleRemoveContact = async (contactId: string) => {
    try {
      const response = await fetch("/api/contacts/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactId }),
      })

      const data = await response.json()
      if (data.success) {
        await refreshUser()
        setSuccess("Contact removed")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to remove contact")
      }
    } catch (err) {
      setError("Failed to remove contact")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Info Card */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Manage Your Emergency Contacts</h2>
          <p className="text-muted-foreground mb-4">
            Add 2-5 trusted people (family, friends, colleagues) who should be alerted when you trigger an emergency.
            They will receive alerts with your location and situation details.
          </p>
          <p className="text-sm text-muted-foreground">
            Maximum of 5 contacts. Contact details are only used during emergencies.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 border border-destructive/20">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-lg mb-6 border border-green-900/40">{success}</div>
        )}

        {/* Current Contacts */}
        {contacts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Your Emergency Contacts ({contacts.length}/5)</h3>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-card border border-border rounded-lg p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-lg">{contact.name}</p>
                    <p className="text-muted-foreground">{contact.phone}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Contact Form */}
        {contacts.length < 5 && (
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6">{isAdding ? "Add New Contact" : "Add First Contact"}</h3>

            {!isAdding ? (
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Emergency Contact
              </Button>
            ) : (
              <form onSubmit={handleAddContact} className="space-y-6">
                <div>
                  <Label htmlFor="name">Contact Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mom, Best Friend"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    Add Contact
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false)
                      setNewContact({ name: "", phone: "" })
                      setError("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Full Contacts Notice */}
        {contacts.length >= 5 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-lg font-semibold text-primary">You have reached the maximum of 5 emergency contacts</p>
            <p className="text-muted-foreground mt-2">Remove a contact if you'd like to add a new one.</p>
          </div>
        )}
      </div>
    </div>
  )
}
