"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"

interface JobFiltersProps {
  onFiltersChange: (filters: JobFilters) => void
}

export interface JobFilters {
  search: string
  jobType: string
  location: string
  industry: string
  experienceLevel: string
  skills: string[]
  salaryRange: string
}

export function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    jobType: "",
    location: "",
    industry: "",
    experienceLevel: "",
    skills: [],
    salaryRange: "",
  })

  const [skillInput, setSkillInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Remote"]
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Consulting",
    "Marketing",
    "Engineering",
    "Design",
    "Sales",
    "Operations",
  ]
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"]
  const salaryRanges = ["$0 - $50k", "$50k - $75k", "$75k - $100k", "$100k - $150k", "$150k - $200k", "$200k+"]
  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Remote",
  ]

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      const newSkills = [...filters.skills, skillInput.trim()]
      updateFilters({ skills: newSkills })
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    const newSkills = filters.skills.filter((s) => s !== skill)
    updateFilters({ skills: newSkills })
  }

  const clearFilters = () => {
    const clearedFilters: JobFilters = {
      search: "",
      jobType: "",
      location: "",
      industry: "",
      experienceLevel: "",
      skills: [],
      salaryRange: "",
    }
    setFilters(clearedFilters)
    setSkillInput("")
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search ||
    filters.jobType ||
    filters.location ||
    filters.industry ||
    filters.experienceLevel ||
    filters.skills.length > 0 ||
    filters.salaryRange

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Jobs</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="bg-transparent">
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search by job title, company, or keywords..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Type Filter */}
              <div>
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={filters.jobType} onValueChange={(value) => updateFilters({ jobType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry Filter */}
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={filters.industry} onValueChange={(value) => updateFilters({ industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={filters.experienceLevel}
                  onValueChange={(value) => updateFilters({ experienceLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Select value={filters.salaryRange} onValueChange={(value) => updateFilters({ salaryRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    {salaryRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  Add
                </Button>
              </div>
              {filters.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                      <span>{skill}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
