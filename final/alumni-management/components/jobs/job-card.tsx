"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Clock, DollarSign, Users, Bookmark } from "lucide-react"

export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  description: string
  requirements: string[]
  skills: string[]
  postedBy: string
  postedDate: string
  applicants: number
  isBookmarked: boolean
  hasApplied: boolean
}

interface JobCardProps {
  job: JobPosting
  onApply: (id: string) => void
  onBookmark: (id: string) => void
  onViewDetails: (id: string) => void
}

export function JobCard({ job, onApply, onBookmark, onViewDetails }: JobCardProps) {
  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "default"
      case "part-time":
        return "secondary"
      case "internship":
        return "outline"
      case "contract":
        return "destructive"
      case "remote":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <Building className="h-4 w-4 mr-2" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{job.location}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(job.id)}
            className={job.isBookmarked ? "text-primary" : "text-muted-foreground"}
          >
            <Bookmark className={`h-4 w-4 ${job.isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getJobTypeColor(job.jobType)}>{job.jobType}</Badge>
          <Badge variant="outline">{job.experienceLevel}</Badge>
          {job.salaryRange && (
            <Badge variant="secondary" className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salaryRange}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{job.postedDate}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{job.applicants} applicants</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(job.id)} className="bg-transparent">
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onApply(job.id)}
              disabled={job.hasApplied}
              className={job.hasApplied ? "bg-secondary" : ""}
            >
              {job.hasApplied ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
