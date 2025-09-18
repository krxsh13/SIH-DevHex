"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"

interface AlumniFiltersProps {
  onFiltersChange: (filters: AlumniFilters) => void
}

export interface AlumniFilters {
  search: string
  batch: string
  company: string
  location: string
  skills: string[]
  industry: string
}

export function AlumniFilters({ onFiltersChange }: AlumniFiltersProps) {
  const [filters, setFilters] = useState<AlumniFilters>({
    search: "",
    batch: "",
    company: "",
    location: "",
    skills: [],
    industry: "",
  })

  const [skillInput, setSkillInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const batches = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]
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

  const updateFilters = (newFilters: Partial<AlumniFilters>) => {
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
    const clearedFilters: AlumniFilters = {
      search: "",
      batch: "",
      company: "",
      location: "",
      skills: [],
      industry: "",
    }
    setFilters(clearedFilters)
    setSkillInput("")
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search ||
    filters.batch ||
    filters.company ||
    filters.location ||
    filters.skills.length > 0 ||
    filters.industry

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Alumni</span>
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
            placeholder="Search by name, company, or title..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Batch Filter */}
              <div>
                <Label htmlFor="batch">Graduation Year</Label>
                <Select value={filters.batch} onValueChange={(value) => updateFilters({ batch: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
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

              {/* Company Filter */}
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  placeholder="Enter company name"
                  value={filters.company}
                  onChange={(e) => updateFilters({ company: e.target.value })}
                />
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <Label htmlFor="skills">Skills</Label>
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
