"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { EventList } from "@/components/events/event-list"
import { CreateEventForm, type EventFormData } from "@/components/events/create-event-form"
import type { EventData } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

const mockEvents: EventData[] = [
  {
    id: "1",
    title: "Alumni Networking Night - Mumbai",
    description:
      "Join us for an evening of networking with fellow alumni from various industries. Great opportunity to make new connections in the financial capital of India.",
    eventType: "Networking",
    date: "2024-02-15",
    time: "6:00 PM - 9:00 PM",
    location: "Mumbai, Maharashtra",
    organizer: "Priya Sharma",
    maxAttendees: 100,
    currentAttendees: 67,
    isRegistered: false,
    isBookmarked: false,
    isPastEvent: false,
    speakers: ["Arjun Patel", "Sneha Reddy"],
    tags: ["networking", "career", "social"],
  },
  {
    id: "2",
    title: "Tech Career Panel - Bangalore",
    description:
      "Industry experts from top Indian tech companies will discuss career opportunities and growth in India's Silicon Valley.",
    eventType: "Panel",
    date: "2024-02-20",
    time: "7:00 PM - 8:30 PM",
    location: "Bangalore, Karnataka",
    organizer: "Arjun Patel",
    maxAttendees: 200,
    currentAttendees: 145,
    isRegistered: true,
    isBookmarked: true,
    isPastEvent: false,
    speakers: ["Vikram Singh", "Ananya Gupta", "Rohit Kumar"],
    tags: ["technology", "career", "panel"],
  },
  {
    id: "3",
    title: "Resume Building Workshop",
    description:
      "Learn how to craft a compelling resume for the Indian job market. Interactive workshop with personalized feedback from HR experts.",
    eventType: "Workshop",
    date: "2024-02-25",
    time: "2:00 PM - 4:00 PM",
    location: "Delhi, NCR",
    organizer: "Sneha Reddy",
    maxAttendees: 30,
    currentAttendees: 28,
    isRegistered: false,
    isBookmarked: true,
    isPastEvent: false,
    speakers: ["Kavya Nair"],
    tags: ["career", "workshop", "resume"],
  },
  {
    id: "4",
    title: "Alumni Startup Showcase - Hyderabad",
    description:
      "Alumni entrepreneurs will pitch their startups and share their journey in the Indian startup ecosystem. Networking reception to follow.",
    eventType: "Social",
    date: "2024-01-10",
    time: "6:30 PM - 9:00 PM",
    location: "Hyderabad, Telangana",
    organizer: "Rajesh Iyer",
    currentAttendees: 85,
    isRegistered: true,
    isBookmarked: false,
    isPastEvent: true,
    speakers: ["Multiple Alumni Founders"],
    tags: ["startup", "entrepreneurship", "networking"],
  },
  {
    id: "5",
    title: "Data Science Meetup - Pune",
    description:
      "Monthly meetup for data science professionals. This month's topic: AI/ML Applications in Indian Industries.",
    eventType: "Alumni Meetup",
    date: "2024-03-05",
    time: "6:00 PM - 8:00 PM",
    location: "Pune, Maharashtra",
    organizer: "Vikram Singh",
    maxAttendees: 50,
    currentAttendees: 23,
    isRegistered: false,
    isBookmarked: false,
    isPastEvent: false,
    speakers: ["Dr. Meera Krishnan", "Amit Agarwal"],
    tags: ["data science", "machine learning", "meetup"],
  },
  {
    id: "6",
    title: "Finance Industry Conference - Mumbai",
    description:
      "Annual conference bringing together alumni working in Indian financial services. Focus on digital banking and fintech innovations.",
    eventType: "Conference",
    date: "2024-03-15",
    time: "9:00 AM - 5:00 PM",
    location: "Mumbai, Maharashtra",
    organizer: "Ananya Gupta",
    maxAttendees: 300,
    currentAttendees: 156,
    isRegistered: false,
    isBookmarked: false,
    isPastEvent: false,
    speakers: ["Raghuram Rajan", "Shikha Sharma", "Uday Kotak"],
    tags: ["finance", "conference", "professional development"],
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>(mockEvents)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleRegister = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, isRegistered: true, currentAttendees: event.currentAttendees + 1 } : event,
      ),
    )
    toast({
      title: "Registration Successful",
      description: "You have been registered for this event.",
    })
  }

  const handleUnregister = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, isRegistered: false, currentAttendees: Math.max(0, event.currentAttendees - 1) }
          : event,
      ),
    )
    toast({
      title: "Unregistered Successfully",
      description: "You have been unregistered from this event.",
    })
  }

  const handleBookmark = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? { ...event, isBookmarked: !event.isBookmarked } : event)),
    )
    const event = events.find((e) => e.id === id)
    toast({
      title: event?.isBookmarked ? "Bookmark Removed" : "Event Bookmarked",
      description: event?.isBookmarked ? "Event removed from bookmarks." : "Event added to your bookmarks.",
    })
  }

  const handleViewDetails = (id: string) => {
    toast({
      title: "Opening Event Details",
      description: "Loading detailed event information...",
    })
  }

  const handleCreateEvent = async (eventData: EventFormData) => {
    // Simulate API call
    const newEvent: EventData = {
      id: Math.random().toString(36).substr(2, 9),
      ...eventData,
      organizer: user?.name || "Anonymous",
      currentAttendees: 0,
      isRegistered: false,
      isBookmarked: false,
      isPastEvent: false,
    }

    setEvents((prevEvents) => [newEvent, ...prevEvents])
    setShowCreateForm(false)
    toast({
      title: "Event Created Successfully",
      description: "Your event is now live and visible to all users.",
    })
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <CreateEventForm onSubmit={handleCreateEvent} onCancel={() => setShowCreateForm(false)} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">Discover networking opportunities, workshops, and community events</p>
          </div>
          {user && (user.role === "admin" || user.role === "alumni") && (
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        <EventList
          events={events}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
          onBookmark={handleBookmark}
          onViewDetails={handleViewDetails}
        />
      </main>
      <Footer />
    </div>
  )
}
