"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Building, Calendar, MessageSquare, UserPlus } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export interface AlumniProfile {
  id: string
  name: string
  title: string
  company: string
  location: string
  graduationYear: string
  industry: string
  skills: string[]
  bio: string
  profileImage?: string
  isConnected: boolean
  isAvailableForMentorship: boolean
}

interface AlumniCardProps {
  alumni: AlumniProfile
  onConnect: (id: string) => void
  onMessage: (id: string) => void
  onViewProfile: (id: string) => void
}

export function AlumniCard({ alumni, onConnect, onMessage, onViewProfile }: AlumniCardProps) {
  const { ref, isVisible } = useScrollAnimation()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
      }`}
    >
      <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 transform cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16 group-hover:scale-110 transition-transform duration-300">
              <AvatarImage src={alumni.profileImage || "/placeholder.svg"} alt={alumni.name} />
              <AvatarFallback className="text-lg">{getInitials(alumni.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                    {alumni.name}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {alumni.title}
                  </p>
                </div>
                {alumni.isAvailableForMentorship && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
                    Mentor
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{alumni.company}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{alumni.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Class of {alumni.graduationYear}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-foreground transition-colors duration-300">
                {alumni.bio}
              </p>

              {/* Skills */}
              {alumni.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {alumni.skills.slice(0, 3).map((skill, index) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className={`text-xs hover:scale-105 transition-transform duration-200 animation-delay-${index * 100}`}
                      >
                        {skill}
                      </Badge>
                    ))}
                    {alumni.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs hover:scale-105 transition-transform duration-200">
                        +{alumni.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onViewProfile(alumni.id)}
                  variant="outline"
                  className="bg-transparent hover:scale-105 transition-transform duration-200"
                >
                  View Profile
                </Button>
                {alumni.isConnected ? (
                  <Button
                    size="sm"
                    onClick={() => onMessage(alumni.id)}
                    className="flex items-center hover:scale-105 transition-transform duration-200"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onConnect(alumni.id)}
                    className="flex items-center hover:scale-105 transition-transform duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
