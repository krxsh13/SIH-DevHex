"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Award, Star, ExternalLink } from "lucide-react"

export interface Achievement {
  id: string
  title: string
  description: string
  alumniName: string
  alumniRole: string
  alumniImage?: string
  achievementDate: string
  category: "Award" | "Promotion" | "Recognition" | "Milestone" | "Publication"
  organization: string
  impact?: string
  mediaLinks?: string[]
  tags: string[]
}

interface AchievementCardProps {
  achievement: Achievement
  onViewDetails: (id: string) => void
  onShare: (id: string) => void
}

export function AchievementCard({ achievement, onViewDetails, onShare }: AchievementCardProps) {
  const getCategoryIcon = (category: Achievement["category"]) => {
    switch (category) {
      case "Award":
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case "Promotion":
        return <Star className="h-5 w-5 text-blue-600" />
      case "Recognition":
        return <Award className="h-5 w-5 text-purple-600" />
      case "Milestone":
        return <Star className="h-5 w-5 text-green-600" />
      case "Publication":
        return <Award className="h-5 w-5 text-indigo-600" />
      default:
        return <Trophy className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: Achievement["category"]) => {
    switch (category) {
      case "Award":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Promotion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Recognition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Milestone":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Publication":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={achievement.alumniImage || "/placeholder.svg"} alt={achievement.alumniName} />
              <AvatarFallback>
                {achievement.alumniName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{achievement.alumniName}</p>
              <p className="text-sm text-muted-foreground">{achievement.alumniRole}</p>
              <p className="text-xs text-muted-foreground">{achievement.achievementDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getCategoryIcon(achievement.category)}
            <Badge className={getCategoryColor(achievement.category)}>{achievement.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-balance">{achievement.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">{achievement.description}</p>
          <p className="text-sm font-medium text-foreground">Organization: {achievement.organization}</p>
          {achievement.impact && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium">Impact:</span> {achievement.impact}
            </p>
          )}
        </div>

        {achievement.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {achievement.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(achievement.id)}
            className="flex items-center space-x-1"
          >
            <span>View Details</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(achievement.id)}
            className="flex items-center space-x-1"
          >
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
