"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { EditProfileForm } from "@/components/profile/edit-profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Briefcase } from "lucide-react"

const mockUser = {
  id: "1",
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  role: "alumni" as const,
  avatar: "/professional-woman-diverse.png",
  title: "Senior Software Engineer",
  company: "Infosys Limited",
  location: "Bangalore, Karnataka",
  graduationYear: 2019,
  major: "Computer Science Engineering",
  phone: "+91 98765 43210",
  linkedin: "https://linkedin.com/in/priyasharma",
  website: "https://priyasharma.dev",
  bio: "Passionate software engineer with 6+ years of experience in full-stack development. Currently working at Infosys on digital transformation projects. Love mentoring students and contributing to open source projects.",
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Java", "Spring Boot"],
  interests: ["Machine Learning", "Open Source", "Mentoring", "Digital India"],
}

const mockActivity = [
  { id: 1, type: "job", title: "Posted Senior Developer position at TCS", date: "2 days ago" },
  { id: 2, type: "event", title: "Registered for IIT Alumni Networking Night", date: "1 week ago" },
  { id: 3, type: "connection", title: "Connected with 5 new alumni from Bangalore", date: "2 weeks ago" },
  { id: 4, type: "mentorship", title: "Started mentoring 3 students from NIT", date: "1 month ago" },
]

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedData: any) => {
    setUser(updatedData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your information and preferences</p>
        </div>

        <EditProfileForm user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <ProfileHeader user={user} isOwnProfile={true} onEdit={() => setIsEditing(true)} />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.interests?.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">234</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-gray-600">Events Attended</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-gray-600">Jobs Posted</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">18</div>
                  <div className="text-sm text-gray-600">Students Mentored</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">You have 234 connections in your network</p>
                <Button variant="outline">View All Connections</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Control who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Manage your email preferences</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Connection Requests</h4>
                      <p className="text-sm text-gray-600">Who can send you connection requests</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
