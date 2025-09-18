"use client"

import { useState, useMemo } from "react"
import { EventCard, type EventData } from "./event-card"
import { EventFilters } from "./event-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventListProps {
  events: EventData[]
  onRegister: (id: string) => void
  onUnregister: (id: string) => void
  onBookmark: (id: string) => void
  onViewDetails: (id: string) => void
}

export function EventList({ events, onRegister, onUnregister, onBookmark, onViewDetails }: EventListProps) {
  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    location: "",
    timeframe: "",
    status: "",
  })
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Event type filter
      if (filters.eventType && event.eventType !== filters.eventType) return false

      // Location filter
      if (filters.location && event.location !== filters.location) return false

      // Status filter
      if (filters.status) {
        switch (filters.status) {
          case "Upcoming":
            if (event.isPastEvent) return false
            break
          case "Past":
            if (!event.isPastEvent) return false
            break
          case "Registered":
            if (!event.isRegistered) return false
            break
          case "Available":
            if (event.isPastEvent || event.isRegistered) return false
            break
        }
      }

      // Timeframe filter
      if (filters.timeframe) {
        const eventDate = new Date(event.date)
        const now = new Date()
        const oneWeek = 7 * 24 * 60 * 60 * 1000
        const oneMonth = 30 * 24 * 60 * 60 * 1000
        const threeMonths = 90 * 24 * 60 * 60 * 1000

        switch (filters.timeframe) {
          case "This Week":
            if (eventDate.getTime() - now.getTime() > oneWeek) return false
            break
          case "This Month":
            if (eventDate.getTime() - now.getTime() > oneMonth) return false
            break
          case "Next Month":
            if (eventDate.getTime() - now.getTime() < oneMonth || eventDate.getTime() - now.getTime() > 2 * oneMonth)
              return false
            break
          case "This Quarter":
            if (eventDate.getTime() - now.getTime() > threeMonths) return false
            break
          case "Past Events":
            if (!event.isPastEvent) return false
            break
        }
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "attendees":
          return b.currentAttendees - a.currentAttendees
        case "type":
          return a.eventType.localeCompare(b.eventType)
        default:
          return 0
      }
    })

    return filtered
  }, [events, filters, sortBy])

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <div className="space-y-6">
      <EventFilters onFiltersChange={handleFiltersChange} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedEvents.length)} of{" "}
            {filteredAndSortedEvents.length} events
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="attendees">Attendees</SelectItem>
              <SelectItem value="type">Event Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {paginatedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={onRegister}
              onUnregister={onUnregister}
              onBookmark={onBookmark}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() =>
              handleFiltersChange({
                search: "",
                eventType: "",
                location: "",
                timeframe: "",
                status: "",
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
