"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, GraduationCap, Mail, Phone, Linkedin, Globe } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: "admin" | "alumni" | "student"
    avatar?: string
    title?: string
    company?: string
    location?: string
    graduationYear?: number
    major?: string
    phone?: string
    linkedin?: string
    website?: string
    bio?: string
  }
  isOwnProfile?: boolean
  onEdit?: () => void
  onConnect?: () => void
}

export function ProfileHeader({ user, isOwnProfile = false, onEdit, onConnect }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <Badge variant={user.role === "admin" ? "destructive" : user.role === "alumni" ? "default" : "secondary"}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>

            {user.title && (
              <div className="flex items-center gap-2 text-lg text-gray-700 mb-1">
                <Briefcase className="w-5 h-5" />
                <span>{user.title}</span>
                {user.company && <span className="text-gray-500">at {user.company}</span>}
              </div>
            )}

            {user.major && (
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span>{user.major}</span>
                {user.graduationYear && <span className="text-gray-500">• Class of {user.graduationYear}</span>}
              </div>
            )}

            {user.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{user.location}</span>
              </div>
            )}
          </div>

          {user.bio && <p className="text-gray-700 leading-relaxed">{user.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <a href={user.linkedin} className="text-primary hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <a href={user.website} className="text-primary hover:underline">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isOwnProfile ? <Button onClick={onEdit}>Edit Profile</Button> : <Button onClick={onConnect}>Connect</Button>}
        </div>
      </div>
    </div>
  )
}
