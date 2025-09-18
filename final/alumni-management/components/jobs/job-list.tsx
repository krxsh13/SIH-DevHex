"use client"

import { useState, useMemo } from "react"
import { JobCard, type JobPosting } from "./job-card"
import { JobFilters } from "./job-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobListProps {
  jobs: JobPosting[]
  onApply: (id: string) => void
  onBookmark: (id: string) => void
  onViewDetails: (id: string) => void
}

export function JobList({ jobs, onApply, onBookmark, onViewDetails }: JobListProps) {
  const [filters, setFilters] = useState({
    search: "",
    jobType: "",
    location: "",
    industry: "",
    experienceLevel: "",
    skills: [],
    salaryRange: "",
  })
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Job type filter
      if (filters.jobType && job.jobType !== filters.jobType) return false

      // Location filter
      if (filters.location && job.location !== filters.location) return false

      // Experience level filter
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false

      // Salary range filter
      if (filters.salaryRange && job.salaryRange !== filters.salaryRange) return false

      // Skills filter
      if (filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase())),
        )
        if (!hasMatchingSkill) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        case "oldest":
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
        case "company":
          return a.company.localeCompare(b.company)
        case "title":
          return a.title.localeCompare(b.title)
        case "applicants":
          return b.applicants - a.applicants
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, filters, sortBy])

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="space-y-6">
      <JobFilters onFiltersChange={handleFiltersChange} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedJobs.length)} of{" "}
            {filteredAndSortedJobs.length} jobs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="title">Job Title</SelectItem>
              <SelectItem value="applicants">Most Applied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Grid */}
      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApply} onBookmark={onBookmark} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() =>
              handleFiltersChange({
                search: "",
                jobType: "",
                location: "",
                industry: "",
                experienceLevel: "",
                skills: [],
                salaryRange: "",
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-transparent"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage !== pageNum ? "bg-transparent" : ""}
                >
                  {pageNum}
                </Button>
              )
            })}
            {totalPages > 5 && <span className="text-muted-foreground">...</span>}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-transparent"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
