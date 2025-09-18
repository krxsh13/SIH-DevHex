"use client"

import { useState, useMemo } from "react"
import { AlumniCard, type AlumniProfile } from "./alumni-card"
import { AlumniFilters } from "./alumni-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlumniListProps {
  alumni: AlumniProfile[]
  onConnect: (id: string) => void
  onMessage: (id: string) => void
  onViewProfile: (id: string) => void
}

export function AlumniList({ alumni, onConnect, onMessage, onViewProfile }: AlumniListProps) {
  const [filters, setFilters] = useState<AlumniFilters>({
    search: "",
    batch: "",
    company: "",
    location: "",
    skills: [],
    industry: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredAndSortedAlumni = useMemo(() => {
    const filtered = alumni.filter((person) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          person.name.toLowerCase().includes(searchLower) ||
          person.company.toLowerCase().includes(searchLower) ||
          person.title.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Batch filter
      if (filters.batch && person.graduationYear !== filters.batch) return false

      // Company filter
      if (filters.company && !person.company.toLowerCase().includes(filters.company.toLowerCase())) return false

      // Location filter
      if (filters.location && person.location !== filters.location) return false

      // Industry filter
      if (filters.industry && person.industry !== filters.industry) return false

      // Skills filter
      if (filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some((skill) =>
          person.skills.some((personSkill) => personSkill.toLowerCase().includes(skill.toLowerCase())),
        )
        if (!hasMatchingSkill) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "company":
          return a.company.localeCompare(b.company)
        case "year":
          return Number.parseInt(b.graduationYear) - Number.parseInt(a.graduationYear)
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filtered
  }, [alumni, filters, sortBy])

  const totalPages = Math.ceil(filteredAndSortedAlumni.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAlumni = filteredAndSortedAlumni.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: AlumniFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="space-y-6">
      <AlumniFilters onFiltersChange={handleFiltersChange} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedAlumni.length)} of{" "}
            {filteredAndSortedAlumni.length} alumni
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="year">Graduation Year</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alumni Grid */}
      {paginatedAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedAlumni.map((person) => (
            <AlumniCard
              key={person.id}
              alumni={person}
              onConnect={onConnect}
              onMessage={onMessage}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No alumni found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() =>
              handleFiltersChange({
                search: "",
                batch: "",
                company: "",
                location: "",
                skills: [],
                industry: "",
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
