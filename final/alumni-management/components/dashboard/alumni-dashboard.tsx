"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, Calendar, MessageSquare, Plus, Eye } from "lucide-react"

export function AlumniDashboard() {
  // Mock data - replace with real API calls
  const profileStats = {
    profileViews: 234,
    connections: 89,
    jobsPosted: 3,
    eventsAttended: 12,
  }

  const mentorshipRequests = [
    {
      id: 1,
      student: "Rahul Sharma",
      field: "Software Engineering",
      message: "Looking for guidance in career transition",
      date: "2024-01-15",
    },
    {
      id: 2,
      student: "Priya Singh",
      field: "Data Science",
      message: "Need advice on graduate school applications",
      date: "2024-01-14",
    },
    {
      id: 3,
      student: "Amit Patel",
      field: "Product Management",
      message: "Seeking internship opportunities",
      date: "2024-01-13",
    },
  ]

  const myJobPostings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Infosys",
      applicants: 23,
      status: "Active",
      posted: "2024-01-10",
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      company: "Tata Consultancy Services",
      applicants: 45,
      status: "Active",
      posted: "2024-01-08",
    },
    { id: 3, title: "Product Manager", company: "Wipro", applicants: 12, status: "Closed", posted: "2024-01-05" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Tech Career Fair 2024", date: "2024-02-15", type: "Career", registered: true },
    { id: 2, title: "Alumni Networking Mixer", date: "2024-02-20", type: "Networking", registered: false },
    { id: 3, title: "Industry Panel: AI & Future", date: "2024-02-25", type: "Panel", registered: true },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alumni Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, connections, and contributions</p>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.profileViews}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.connections}</div>
            <p className="text-xs text-muted-foreground">Total network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.jobsPosted}</div>
            <p className="text-xs text-muted-foreground">Active postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentorship Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>Students seeking your guidance</CardDescription>
              </div>
              <Badge variant="secondary">{mentorshipRequests.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorshipRequests.map((request) => (
                <div key={request.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{request.student}</div>
                      <div className="text-sm text-muted-foreground">{request.field}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{request.date}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{request.message}</p>
                  <div className="flex space-x-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Job Postings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Job Postings</CardTitle>
                <CardDescription>Jobs and internships you've posted</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myJobPostings.map((job) => (
                <div key={job.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.company}</div>
                    </div>
                    <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{job.applicants} applicants</span>
                    <span>Posted {job.posted}</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                    View Applications
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you might be interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{event.type}</Badge>
                  <div className="text-xs text-muted-foreground">{event.date}</div>
                </div>
                <h3 className="font-medium mb-2">{event.title}</h3>
                <Button size="sm" variant={event.registered ? "secondary" : "default"} className="w-full">
                  {event.registered ? "Registered" : "Register"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col space-y-2">
              <User className="h-6 w-6" />
              <span>Update Profile</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <Briefcase className="h-6 w-6" />
              <span>Post Job</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span>Messages</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>Browse Events</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
