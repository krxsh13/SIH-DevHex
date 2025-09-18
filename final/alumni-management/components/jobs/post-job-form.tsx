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

interface PostJobFormProps {
  onSubmit: (jobData: JobFormData) => void
  onCancel: () => void
}

export interface JobFormData {
  title: string
  company: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  description: string
  requirements: string[]
  skills: string[]
}

export function PostJobForm({ onSubmit, onCancel }: PostJobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryRange: "",
    description: "",
    requirements: [],
    skills: [],
  })

  const [requirementInput, setRequirementInput] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)

  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Remote"]
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

  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      updateFormData({ requirements: [...formData.requirements, requirementInput.trim()] })
      setRequirementInput("")
    }
  }

  const removeRequirement = (requirement: string) => {
    updateFormData({ requirements: formData.requirements.filter((r) => r !== requirement) })
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateFormData({ skills: [...formData.skills, skillInput.trim()] })
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    updateFormData({ skills: formData.skills.filter((s) => s !== skill) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!formData.title || !formData.company || !formData.description || !formData.jobType) {
      alert("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error posting job:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>Share job opportunities with the alumni community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g. TechCorp Inc."
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value) => updateFormData({ jobType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => updateFormData({ experienceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Select value={formData.salaryRange} onValueChange={(value) => updateFormData({ salaryRange: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {salaryRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
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

          {/* Description */}
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={6}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a requirement..."
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((requirement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{requirement}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeRequirement(requirement)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
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
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
