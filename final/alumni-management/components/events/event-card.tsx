"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Clock, Users, Bookmark } from "lucide-react"

export interface EventData {
  id: string
  title: string
  description: string
  eventType: string
  date: string
  time: string
  location: string
  organizer: string
  organizerImage?: string
  maxAttendees?: number
  currentAttendees: number
  isRegistered: boolean
  isBookmarked: boolean
  isPastEvent: boolean
  speakers?: string[]
  tags?: string[]
}

interface EventCardProps {
  event: EventData
  onRegister: (id: string) => void
  onUnregister: (id: string) => void
  onBookmark: (id: string) => void
  onViewDetails: (id: string) => void
}

export function EventCard({ event, onRegister, onUnregister, onBookmark, onViewDetails }: EventCardProps) {
  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "networking":
        return "default"
      case "career":
        return "secondary"
      case "workshop":
        return "outline"
      case "panel":
        return "destructive"
      case "social":
        return "default"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isFullyBooked = event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={getEventTypeColor(event.eventType)}>{event.eventType}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(event.id)}
                className={event.isBookmarked ? "text-primary" : "text-muted-foreground"}
              >
                <Bookmark className={`h-4 w-4 ${event.isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.currentAttendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ""} attendees
            </span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2 mb-4 p-2 bg-muted/30 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={event.organizerImage || "/placeholder.svg"} alt={event.organizer} />
            <AvatarFallback className="text-xs">{getInitials(event.organizer)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">Organized by</div>
            <div className="text-xs text-muted-foreground">{event.organizer}</div>
          </div>
        </div>

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Speakers</div>
            <div className="flex flex-wrap gap-1">
              {event.speakers.slice(0, 2).map((speaker, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {speaker}
                </Badge>
              ))}
              {event.speakers.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{event.speakers.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-border">
          <Button size="sm" variant="outline" onClick={() => onViewDetails(event.id)} className="bg-transparent">
            View Details
          </Button>
          {event.isPastEvent ? (
            <Badge variant="secondary">Past Event</Badge>
          ) : event.isRegistered ? (
            <Button size="sm" variant="secondary" onClick={() => onUnregister(event.id)}>
              Unregister
            </Button>
          ) : (
            <Button size="sm" onClick={() => onRegister(event.id)} disabled={isFullyBooked}>
              {isFullyBooked ? "Fully Booked" : "Register"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
