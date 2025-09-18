"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"

export default function StudentDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <StudentDashboard />
      </main>
    </div>
  )
}
