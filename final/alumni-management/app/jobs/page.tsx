"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { JobList } from "@/components/jobs/job-list"
import { PostJobForm, type JobFormData } from "@/components/jobs/post-job-form"
import type { JobPosting } from "@/components/jobs/job-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

const mockJobs: JobPosting[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TCS",
    location: "Pune, Maharashtra",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    salaryRange: "₹15L - ₹25L",
    description:
      "We're looking for a senior software engineer to join our digital transformation team. You'll be working on scalable systems for global clients.",
    requirements: ["5+ years experience", "Strong system design skills", "Experience with microservices"],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    postedBy: "Priya Sharma",
    postedDate: "2024-01-15",
    applicants: 23,
    isBookmarked: false,
    hasApplied: false,
  },
  {
    id: "2",
    title: "Product Manager Intern",
    company: "Swiggy",
    location: "Bangalore, Karnataka",
    jobType: "Internship",
    experienceLevel: "Entry Level",
    salaryRange: "₹3L - ₹5L",
    description:
      "Join our product team as an intern and help shape the future of food delivery in India. Great opportunity to learn from experienced PMs.",
    requirements: ["Currently enrolled in university", "Interest in product management", "Strong analytical skills"],
    skills: ["Product Strategy", "Data Analysis", "User Research", "Figma"],
    postedBy: "Arjun Patel",
    postedDate: "2024-01-14",
    applicants: 45,
    isBookmarked: true,
    hasApplied: false,
  },
  {
    id: "3",
    title: "UX Designer",
    company: "PhonePe",
    location: "Bangalore, Karnataka",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹12L - ₹18L",
    description:
      "We're seeking a talented UX designer to create intuitive fintech experiences for millions of Indian users.",
    requirements: [
      "3+ years UX design experience",
      "Portfolio showcasing design process",
      "Experience with mobile-first design",
    ],
    skills: ["Figma", "Sketch", "User Research", "Prototyping", "Design Systems"],
    postedBy: "Sneha Reddy",
    postedDate: "2024-01-13",
    applicants: 18,
    isBookmarked: false,
    hasApplied: true,
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Razorpay",
    location: "Bangalore, Karnataka",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹18L - ₹28L",
    description:
      "Join our data science team to build ML models for fraud detection and payment optimization in the Indian fintech ecosystem.",
    requirements: ["MS in Data Science or related field", "Experience with ML frameworks", "Strong Python skills"],
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics"],
    postedBy: "Rohit Kumar",
    postedDate: "2024-01-12",
    applicants: 31,
    isBookmarked: false,
    hasApplied: false,
  },
  {
    id: "5",
    title: "Marketing Coordinator",
    company: "Nykaa",
    location: "Mumbai, Maharashtra",
    jobType: "Full-time",
    experienceLevel: "Entry Level",
    salaryRange: "₹6L - ₹10L",
    description:
      "Support our marketing team in executing campaigns for India's leading beauty and fashion e-commerce platform.",
    requirements: [
      "Bachelor's degree in Marketing",
      "Experience with digital marketing",
      "Understanding of Indian consumer behavior",
    ],
    skills: ["Digital Marketing", "Content Creation", "Analytics", "SEO", "Social Media"],
    postedBy: "Kavya Nair",
    postedDate: "2024-01-11",
    applicants: 27,
    isBookmarked: true,
    hasApplied: false,
  },
  {
    id: "6",
    title: "Frontend Developer",
    company: "Freshworks",
    location: "Chennai, Tamil Nadu",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹10L - ₹16L",
    description:
      "We need a skilled frontend developer to help build responsive web applications for our global SaaS products.",
    requirements: ["3+ years frontend experience", "Strong React skills", "Experience with modern build tools"],
    skills: ["React", "TypeScript", "CSS", "Webpack", "Testing"],
    postedBy: "Vikram Singh",
    postedDate: "2024-01-10",
    applicants: 19,
    isBookmarked: false,
    hasApplied: false,
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs)
  const [showPostForm, setShowPostForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleApply = (id: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === id ? { ...job, hasApplied: true, applicants: job.applicants + 1 } : job)),
    )
    toast({
      title: "Application Submitted",
      description: "Your application has been sent successfully.",
    })
  }

  const handleBookmark = (id: string) => {
    setJobs((prevJobs) => prevJobs.map((job) => (job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job)))
    const job = jobs.find((j) => j.id === id)
    toast({
      title: job?.isBookmarked ? "Bookmark Removed" : "Job Bookmarked",
      description: job?.isBookmarked ? "Job removed from bookmarks." : "Job added to your bookmarks.",
    })
  }

  const handleViewDetails = (id: string) => {
    toast({
      title: "Opening Job Details",
      description: "Loading detailed job information...",
    })
  }

  const handlePostJob = async (jobData: JobFormData) => {
    // Simulate API call
    const newJob: JobPosting = {
      id: Math.random().toString(36).substr(2, 9),
      ...jobData,
      postedBy: user?.name || "Anonymous",
      postedDate: new Date().toISOString().split("T")[0],
      applicants: 0,
      isBookmarked: false,
      hasApplied: false,
    }

    setJobs((prevJobs) => [newJob, ...prevJobs])
    setShowPostForm(false)
    toast({
      title: "Job Posted Successfully",
      description: "Your job posting is now live and visible to all users.",
    })
  }

  if (showPostForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <PostJobForm onSubmit={handlePostJob} onCancel={() => setShowPostForm(false)} />
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Job Board</h1>
            <p className="text-muted-foreground">Discover career opportunities shared by our alumni community</p>
          </div>
          {user && (user.role === "alumni" || user.role === "admin") && (
            <Button onClick={() => setShowPostForm(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          )}
        </div>

        <JobList jobs={jobs} onApply={handleApply} onBookmark={handleBookmark} onViewDetails={handleViewDetails} />
      </main>
      <Footer />
    </div>
  )
}
