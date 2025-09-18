"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Briefcase, Calendar, MessageSquare, Search, BookOpen } from "lucide-react"

export function StudentDashboard() {
  // Mock data - replace with real API calls
  const profileCompletion = 75

  const stats = {
    applications: 8,
    interviews: 3,
    mentorConnections: 2,
    eventsRegistered: 5,
  }

  const jobApplications = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Tata Consultancy Services",
      status: "Interview Scheduled",
      applied: "2025-01-12",
    },
    { id: 2, title: "Data Analyst", company: "Infosys", status: "Under Review", applied: "2025-01-10" },
    { id: 3, title: "Product Manager Intern", company: "Flipkart", status: "Applied", applied: "2025-01-08" },
  ]

  const mentorConnections = [
    {
      id: 1,
      name: "Priya Sharma",
      field: "Software Engineering",
      company: "Google India",
      status: "Active",
      lastContact: "2 days ago",
    },
    {
      id: 2,
      name: "Arjun Patel",
      field: "Data Science",
      company: "Microsoft India",
      status: "Pending",
      lastContact: "1 week ago",
    },
  ]

  const recommendedJobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Zomato",
      location: "Bangalore",
      type: "Internship",
      match: 95,
      salary: "₹25,000/month",
    },
    {
      id: 2,
      title: "UX Design Intern",
      company: "Paytm",
      location: "Noida",
      type: "Internship",
      match: 88,
      salary: "₹30,000/month",
    },
    {
      id: 3,
      title: "Marketing Assistant",
      company: "Swiggy",
      location: "Mumbai",
      type: "Part-time",
      match: 82,
      salary: "₹20,000/month",
    },
  ]

  const upcomingEvents = [
    { id: 1, title: "Career Workshop: Resume Building", date: "2025-02-18", type: "Workshop", registered: true },
    { id: 2, title: "Tech Industry Panel", date: "2025-02-22", type: "Panel", registered: false },
    { id: 3, title: "Networking Night", date: "2025-02-25", type: "Networking", registered: true },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your career journey and connect with opportunities</p>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>A complete profile helps you get noticed by alumni and employers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={profileCompletion} className="flex-1" />
            <span className="text-sm font-medium">{profileCompletion}%</span>
          </div>
          <Button className="mt-4 bg-transparent" variant="outline">
            Complete Profile
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">Jobs applied to</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mentorConnections}</div>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsRegistered}</div>
            <p className="text-xs text-muted-foreground">Registered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Applications */}
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>Track your job and internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobApplications.map((app) => (
                <div key={app.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{app.title}</div>
                      <div className="text-sm text-muted-foreground">{app.company}</div>
                    </div>
                    <Badge variant={app.status === "Interview Scheduled" ? "default" : "secondary"}>{app.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Applied {app.applied}</div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View All Applications
            </Button>
          </CardContent>
        </Card>

        {/* Mentor Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Mentor Connections</CardTitle>
            <CardDescription>Alumni mentors helping guide your career</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorConnections.map((mentor) => (
                <div key={mentor.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{mentor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {mentor.field} at {mentor.company}
                      </div>
                    </div>
                    <Badge variant={mentor.status === "Active" ? "default" : "secondary"}>{mentor.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Last contact: {mentor.lastContact}</div>
                  <Button size="sm" variant="outline">
                    Send Message
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Find More Mentors
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Job opportunities that match your profile and interests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{job.type}</Badge>
                  <div className="text-xs text-primary font-medium">{job.match}% match</div>
                </div>
                <h3 className="font-medium mb-1">{job.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{job.company}</div>
                <div className="text-xs text-muted-foreground mb-1">{job.location}</div>
                <div className="text-xs font-medium text-primary mb-3">{job.salary}</div>
                <Button size="sm" className="w-full">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Career development and networking opportunities</CardDescription>
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
          <CardDescription>Get started with your career journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col space-y-2">
              <Search className="h-6 w-6" />
              <span>Find Alumni</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <Briefcase className="h-6 w-6" />
              <span>Browse Jobs</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <BookOpen className="h-6 w-6" />
              <span>Career Resources</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-transparent" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>Upcoming Events</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
