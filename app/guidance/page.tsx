"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Phone, Heart, Zap } from "lucide-react"
import Link from "next/link"

type EmergencyType = "medical" | "accident" | "fire" | "disaster"

interface GuidanceStep {
  title: string
  instructions: string[]
  icon: React.ReactNode
  warning?: string
}

const guidanceContent: Record<EmergencyType, GuidanceStep[]> = {
  medical: [
    {
      title: "Assess Responsiveness",
      instructions: [
        "Check if the person is conscious",
        "Speak clearly and loudly near their ears",
        "Gently tap their shoulders if they don't respond",
        "Look for signs of breathing and movement",
      ],
      icon: <AlertCircle className="w-6 h-6" />,
      warning: "If unresponsive and not breathing, begin CPR immediately",
    },
    {
      title: "Position the Person",
      instructions: [
        "Place the person flat on their back on a firm surface",
        "If spinal injury is suspected, keep the head aligned",
        "Turn head to side if vomiting occurs",
        "Keep airway open and clear",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Control Bleeding",
      instructions: [
        "Apply direct pressure with clean cloth",
        "Keep pressure on wound for 5-10 minutes",
        "If blood soaks through, add more cloth without removing the first",
        "Elevate the bleeding area above the heart if possible",
      ],
      icon: <Zap className="w-6 h-6" />,
      warning: "Do not remove embedded objects - stabilize them instead",
    },
    {
      title: "Keep Warm & Calm",
      instructions: [
        "Cover with blanket to prevent heat loss",
        "Reassure the person and stay calm",
        "Monitor breathing and consciousness",
        "Do not give food or water",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
  ],
  accident: [
    {
      title: "Move to Safety",
      instructions: [
        "Ensure the scene is safe for you and victim",
        "If in traffic, move to the side of the road if safe",
        "Turn off vehicle engine if in a vehicle",
        "Do not move person unless in immediate danger",
      ],
      icon: <AlertCircle className="w-6 h-6" />,
      warning: "Do not move person if spinal injury is suspected",
    },
    {
      title: "Check for Injuries",
      instructions: [
        "Look for visible wounds, bleeding, or deformities",
        "Check for signs of shock (pale, sweating, rapid pulse)",
        "Ask conscious person about pain and injuries",
        "Document the victim's condition for responders",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Stop the Bleeding",
      instructions: [
        "Apply firm pressure with cloth",
        "Elevate injury above heart level if possible",
        "For limb injuries, immobilize the area",
        "Use bandages or makeshift sling to prevent movement",
      ],
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Recovery Position",
      instructions: [
        "Place person on their side",
        "Tilt head back to keep airway open",
        "Place upper leg forward for stability",
        "Monitor breathing and consciousness continuously",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
  ],
  fire: [
    {
      title: "Evacuate Immediately",
      instructions: [
        "Leave the building without delay",
        "Use stairs - never use elevators",
        "If smoke is present, crouch or crawl below it",
        "Stay low where air is clearer",
      ],
      icon: <AlertCircle className="w-6 h-6" />,
      warning: "Do not try to fight the fire unless trained - evacuate first",
    },
    {
      title: "Help Others Evacuate",
      instructions: [
        "Alert people around you - shout or ring alarm",
        "Help elderly, children, and disabled persons",
        "Check bathrooms and other enclosed spaces",
        "Do not stop for belongings",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Assembly Point",
      instructions: [
        "Proceed to designated assembly point",
        "Get as far from building as possible",
        "Check that everyone is accounted for",
        "Report to emergency responders",
      ],
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Burns Treatment",
      instructions: [
        "For minor burns, cool with water for 10-20 minutes",
        "Remove tight clothing near burn if possible",
        "Cover burn with sterile, non-stick dressing",
        "Do not apply ice directly to skin",
      ],
      icon: <Heart className="w-6 h-6" />,
      warning: "Severe burns require immediate professional medical attention",
    },
  ],
  disaster: [
    {
      title: "Seek Shelter",
      instructions: [
        "Move to sturdy building or designated shelter",
        "Stay away from windows and glass",
        "Get under desk or table if possible",
        "Cover your head and neck",
      ],
      icon: <AlertCircle className="w-6 h-6" />,
      warning: "If stuck under debris, do not move unnecessarily",
    },
    {
      title: "Assess Injuries",
      instructions: [
        "Check yourself and others for injuries",
        "Apply first aid to any wounds",
        "Look for signs of internal injury or shock",
        "Keep injured persons warm and calm",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Signal for Help",
      instructions: [
        "Tap on pipes or walls to create noise signals",
        "Use whistle if available - 3 blasts is distress signal",
        "Remain visible if possible",
        "Shout periodically to alert rescuers",
      ],
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Preserve Resources",
      instructions: [
        "Ration water and food if available",
        "Keep warm and prevent heat loss",
        "Stay calm and help others remain calm",
        "Do not wander away from safe area",
      ],
      icon: <Heart className="w-6 h-6" />,
    },
  ],
}

const emergencyTypeNames: Record<EmergencyType, string> = {
  medical: "Medical Emergency",
  accident: "Accident",
  fire: "Fire Emergency",
  disaster: "Natural Disaster",
}

export default function GuidancePage() {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null)

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-bold">First-Aid Guidance</h1>
            <Link href="/dashboard">
              <Button variant="ghost">Close</Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Select an emergency type to view step-by-step first-aid guidance. These instructions are based on standard
            first-aid practices and should complement professional medical help.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {(Object.keys(emergencyTypeNames) as EmergencyType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="bg-card border border-border hover:border-primary hover:bg-primary/5 rounded-lg p-8 text-left transition space-y-4"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{emergencyTypeNames[type]}</h3>
                <p className="text-muted-foreground">View step-by-step first-aid instructions</p>
              </button>
            ))}
          </div>

          {/* Emergency Numbers */}
          <div className="mt-12 bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Emergency Services - India</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Ambulance & Medical</p>
                <p className="text-3xl font-bold text-primary">108</p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Police</p>
                <p className="text-3xl font-bold text-primary">100</p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Fire</p>
                <p className="text-3xl font-bold text-primary">101</p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Disaster Management</p>
                <p className="text-3xl font-bold text-primary">1070</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const steps = guidanceContent[selectedType]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setSelectedType(null)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{emergencyTypeNames[selectedType]}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Warning Banner */}
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg mb-8">
          <p className="font-semibold mb-2">Important:</p>
          <p>
            Call emergency services immediately (108 for medical, 100 for police, 101 for fire). These instructions are
            supplementary to professional medical help and should not delay emergency response.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-8">
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                  {step.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Step {index + 1}: {step.title}
                  </h2>
                </div>
              </div>

              {/* Warning */}
              {step.warning && (
                <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 p-4 rounded-lg mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{step.warning}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-3">
                {step.instructions.map((instruction, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-lg">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 space-y-4">
          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Need Help?</h3>
            <p className="text-muted-foreground">Call emergency services immediately</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => (window.location.href = "tel:108")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg h-auto gap-2"
              >
                <Phone className="w-5 h-5" />
                Call 108 (Medical)
              </Button>
              <Button
                onClick={() => (window.location.href = "tel:100")}
                variant="outline"
                className="px-8 py-6 text-lg h-auto gap-2 bg-transparent"
              >
                <Phone className="w-5 h-5" />
                Call 100 (Police)
              </Button>
            </div>
          </div>

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
