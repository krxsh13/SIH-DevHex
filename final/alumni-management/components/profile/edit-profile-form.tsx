"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

interface EditProfileFormProps {
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
    skills?: string[]
    interests?: string[]
  }
  onSave: (data: any) => void
  onCancel: () => void
}

export function EditProfileForm({ user, onSave, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState(user)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSave(formData)
    setIsLoading(false)
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button type="button" variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional/Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{user.role === "student" ? "Academic Information" : "Professional Information"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.role === "alumni" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={formData.title || ""} onChange={(e) => updateField("title", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => updateField("company", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input id="major" value={formData.major || ""} onChange={(e) => updateField("major", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Select
                value={formData.graduationYear?.toString() || ""}
                onValueChange={(value) => updateField("graduationYear", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i + 5).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={formData.linkedin || ""}
              onChange={(e) => updateField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              value={formData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
