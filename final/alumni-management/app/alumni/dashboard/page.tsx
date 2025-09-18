"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { AlumniDashboard } from "@/components/dashboard/alumni-dashboard"

export default function AlumniDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "alumni")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "alumni") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AlumniDashboard />
      </main>
    </div>
  )
}
