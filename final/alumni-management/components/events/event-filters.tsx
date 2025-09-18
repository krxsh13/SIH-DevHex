"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilters) => void
}

export interface EventFilters {
  search: string
  eventType: string
  location: string
  timeframe: string
  status: string
}

export function EventFilters({ onFiltersChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    eventType: "",
    location: "",
    timeframe: "",
    status: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  const eventTypes = ["Networking", "Career", "Workshop", "Panel", "Social", "Alumni Meetup", "Conference"]
  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Virtual",
  ]
  const timeframes = ["This Week", "This Month", "Next Month", "This Quarter", "Past Events"]
  const statuses = ["All Events", "Upcoming", "Past", "Registered", "Available"]

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const clearedFilters: EventFilters = {
      search: "",
      eventType: "",
      location: "",
      timeframe: "",
      status: "",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search || filters.eventType || filters.location || filters.timeframe || filters.status

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Events</span>
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
            placeholder="Search events by title, description, or speaker..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Event Type Filter */}
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={filters.eventType} onValueChange={(value) => updateFilters({ eventType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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

              {/* Timeframe Filter */}
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={filters.timeframe} onValueChange={(value) => updateFilters({ timeframe: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe} value={timeframe}>
                        {timeframe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
