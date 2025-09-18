"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Briefcase, Calendar, TrendingUp, AlertCircle, IndianRupee, BarChart3 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function AdminDashboard() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation()
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation()

  // Mock data - replace with real API calls
  const stats = {
    totalUsers: 10247,
    pendingApprovals: 23,
    activeJobs: 156,
    upcomingEvents: 8,
    monthlyGrowth: 12.5,
    totalDonations: 2850000, // ₹28.5 lakhs
    monthlyDonations: 185000, // ₹1.85 lakhs this month
  }

  const pendingApprovals = [
    { id: 1, name: "Priya Sharma", type: "Alumni", email: "priya.sharma@email.com", date: "2024-01-15" },
    { id: 2, name: "Infosys Ltd", type: "Job Posting", title: "Senior Software Engineer", date: "2024-01-14" },
    { id: 3, name: "Rahul Gupta", type: "Student", email: "rahul.gupta@email.com", date: "2024-01-13" },
  ]

  const recentActivity = [
    { action: "New alumni registration", user: "Ananya Patel", time: "2 hours ago" },
    { action: "Job posting approved", company: "Flipkart", time: "4 hours ago" },
    { action: "Event created", event: "Tech Alumni Meetup Mumbai", time: "1 day ago" },
    { action: "Donation received", user: "Vikram Singh - ₹25,000", time: "2 days ago" },
  ]

  const recentDonations = [
    { donor: "Amit Kumar", amount: 50000, purpose: "Scholarship Fund", date: "2024-01-15" },
    { donor: "Sneha Reddy", amount: 25000, purpose: "Infrastructure", date: "2024-01-14" },
    { donor: "Rajesh Agarwal", amount: 100000, purpose: "Library Development", date: "2024-01-13" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-in-left">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your alumni community and platform</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-100 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-200 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-300 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-400 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">Monthly growth</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-500 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalDonations / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">All time donations</p>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ease-out hover:scale-105 animation-delay-600 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.monthlyDonations / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card
          className={`transition-all duration-700 ease-out hover:shadow-xl ${
            cardsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-300 animation-delay-${index * 100}`}
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type === "Job Posting" ? item.title : item.email}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.type}</Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:scale-105 transition-transform bg-transparent"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent hover:scale-105 transition-transform" variant="outline">
              View All Approvals
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card
          className={`transition-all duration-700 ease-out hover:shadow-xl animation-delay-200 ${
            cardsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.user || activity.company || activity.event}
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card
          className={`transition-all duration-700 ease-out hover:shadow-xl animation-delay-400 ${
            cardsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest contributions from alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.map((donation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{donation.donor}</div>
                    <div className="text-sm text-muted-foreground">{donation.purpose}</div>
                    <div className="text-xs text-muted-foreground">{donation.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">₹{donation.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent hover:scale-105 transition-transform" variant="outline">
              View All Donations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-fade-in-up animation-delay-800">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button className="h-20 flex flex-col space-y-2 hover:scale-105 transition-transform">
              <UserCheck className="h-6 w-6" />
              <span>Approve Users</span>
            </Button>
            <Button
              className="h-20 flex flex-col space-y-2 bg-transparent hover:scale-105 transition-transform"
              variant="outline"
            >
              <Calendar className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
            <Button
              className="h-20 flex flex-col space-y-2 bg-transparent hover:scale-105 transition-transform"
              variant="outline"
            >
              <Briefcase className="h-6 w-6" />
              <span>Manage Jobs</span>
            </Button>
            <Button
              className="h-20 flex flex-col space-y-2 bg-transparent hover:scale-105 transition-transform"
              variant="outline"
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button
              className="h-20 flex flex-col space-y-2 bg-transparent hover:scale-105 transition-transform"
              variant="outline"
            >
              <IndianRupee className="h-6 w-6" />
              <span>Donations</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
