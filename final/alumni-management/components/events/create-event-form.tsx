"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface CreateEventFormProps {
  onSubmit: (eventData: EventFormData) => void
  onCancel: () => void
}

export interface EventFormData {
  title: string
  description: string
  eventType: string
  date: string
  time: string
  location: string
  maxAttendees?: number
  speakers: string[]
  tags: string[]
}

export function CreateEventForm({ onSubmit, onCancel }: CreateEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventType: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: undefined,
    speakers: [],
    tags: [],
  })

  const [speakerInput, setSpeakerInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  const eventTypes = ["Networking", "Career", "Workshop", "Panel", "Social", "Alumni Meetup", "Conference"]
  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Virtual",
  ]

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const addSpeaker = () => {
    if (speakerInput.trim() && !formData.speakers.includes(speakerInput.trim())) {
      updateFormData({ speakers: [...formData.speakers, speakerInput.trim()] })
      setSpeakerInput("")
    }
  }

  const removeSpeaker = (speaker: string) => {
    updateFormData({ speakers: formData.speakers.filter((s) => s !== speaker) })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData({ tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    updateFormData({ tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!formData.title || !formData.description || !formData.eventType || !formData.date || !formData.time) {
      alert("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>Organize events for the alumni community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Alumni Networking Night"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="eventType">Event Type *</Label>
              <Select value={formData.eventType} onValueChange={(value) => updateFormData({ eventType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData({ date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateFormData({ time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => updateFormData({ location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maxAttendees">Max Attendees (Optional)</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="e.g. 50"
                value={formData.maxAttendees || ""}
                onChange={(e) =>
                  updateFormData({ maxAttendees: e.target.value ? Number.parseInt(e.target.value) : undefined })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Event Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the event, what attendees can expect, and any special details..."
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={6}
              required
            />
          </div>

          {/* Speakers */}
          <div>
            <Label htmlFor="speakers">Speakers</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a speaker..."
                value={speakerInput}
                onChange={(e) => setSpeakerInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpeaker())}
              />
              <Button type="button" onClick={addSpeaker} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.speakers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.speakers.map((speaker, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{speaker}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpeaker(speaker)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
