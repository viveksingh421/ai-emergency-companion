"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import Link from "next/link"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-4 flex items-center gap-3 shadow-lg">
      <WifiOff className="w-5 h-5 text-yellow-500" />
      <div className="flex-1">
        <p className="font-semibold text-sm">No Internet</p>
        <p className="text-xs text-muted-foreground">
          <Link href="/offline" className="underline hover:no-underline">
            View emergency numbers
          </Link>
        </p>
      </div>
    </div>
  )
}
