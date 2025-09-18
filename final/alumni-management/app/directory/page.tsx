"use client"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { AlumniList } from "@/components/directory/alumni-list"
import type { AlumniProfile } from "@/components/directory/alumni-card"
import { useToast } from "@/hooks/use-toast"

// Mock data - Indian Alumni Directory
const mockAlumni: AlumniProfile[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    title: "Senior Software Engineer",
    company: "TCS",
    location: "New Delhi, Delhi",
    graduationYear: "2018",
    industry: "Technology",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    bio: "Software Engineer with 5 years of experience in web development. Passionate about building scalable platforms and mentoring junior developers.",
    isConnected: false,
    isAvailableForMentorship: true,
  },
  {
    id: "2",
    name: "Kavya Patel",
    title: "Product Manager",
    company: "Reliance Industries",
    location: "Ahmedabad, Gujarat",
    graduationYear: "2016",
    industry: "Technology",
    skills: ["Product Strategy", "Data Analysis", "Agile", "User Research"],
    bio: "Marketing Manager with expertise in digital marketing and brand management. Leading fintech product initiatives across India.",
    isConnected: true,
    isAvailableForMentorship: true,
  },
  {
    id: "3",
    name: "Rajesh Singh",
    title: "Professor",
    company: "PEC University",
    location: "Chandigarh, Punjab",
    graduationYear: "2005",
    industry: "Education",
    skills: ["Data Structures", "Algorithms", "Research", "Teaching", "Mentoring"],
    bio: "Professor of Computer Science with expertise in Data Structures and Algorithms. Passionate about educating the next generation of engineers.",
    isConnected: false,
    isAvailableForMentorship: true,
  },
  {
    id: "4",
    name: "Priya Reddy",
    title: "Marketing Manager",
    company: "Reliance Industries",
    location: "Ahmedabad, Gujarat",
    graduationYear: "2016",
    industry: "Marketing",
    skills: ["Digital Marketing", "Brand Management", "Strategy", "Analytics"],
    bio: "Marketing Manager with expertise in digital marketing and brand management. Leading growth initiatives for retail products.",
    isConnected: false,
    isAvailableForMentorship: false,
  },
  {
    id: "5",
    name: "Suresh Kumar",
    title: "Data Scientist",
    company: "Infosys",
    location: "Bangalore, Karnataka",
    graduationYear: "2019",
    industry: "Technology",
    skills: ["Machine Learning", "Python", "SQL", "Statistics", "Deep Learning"],
    bio: "Data Scientist specializing in Machine Learning and AI applications. Building ML models for enterprise solutions.",
    isConnected: true,
    isAvailableForMentorship: true,
  },
  {
    id: "6",
    name: "Ananya Nair",
    title: "Electronics Engineer",
    company: "NIT Calicut",
    location: "Kochi, Kerala",
    graduationYear: "2025",
    industry: "Education",
    skills: ["IoT", "Embedded Systems", "Electronics", "Programming"],
    bio: "Third year Electronics Engineering student interested in IoT and embedded systems. Passionate about technology innovation.",
    isConnected: false,
    isAvailableForMentorship: true,
  },
  {
    id: "7",
    name: "Vikram Verma",
    title: "System Administrator",
    company: "Government of India",
    location: "New Delhi, Delhi",
    graduationYear: "2012",
    industry: "Government",
    skills: ["Network Security", "Database Management", "System Administration", "IT Infrastructure"],
    bio: "System Administrator with expertise in network security and database management. Serving in government IT infrastructure.",
    isConnected: false,
    isAvailableForMentorship: true,
  },
  {
    id: "8",
    name: "Deepika Sharma",
    title: "Software Engineering Manager",
    company: "Infosys",
    location: "Chennai, Tamil Nadu",
    graduationYear: "2016",
    industry: "Technology",
    skills: ["Team Leadership", "System Design", "Java", "Kubernetes", "Microservices"],
    bio: "Leading engineering teams building enterprise software solutions. Passionate about mentoring engineers and building diverse teams.",
    isConnected: false,
    isAvailableForMentorship: true,
  },
]

export default function DirectoryPage() {
  const { toast } = useToast()

  const handleConnect = (id: string) => {
    // Simulate API call
    toast({
      title: "Connection Request Sent",
      description: "Your connection request has been sent successfully.",
    })
  }

  const handleMessage = (id: string) => {
    // Simulate navigation to messaging
    toast({
      title: "Opening Messages",
      description: "Redirecting to your conversation...",
    })
  }

  const handleViewProfile = (id: string) => {
    // Simulate navigation to profile
    toast({
      title: "Opening Profile",
      description: "Loading detailed profile...",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alumni Directory</h1>
          <p className="text-muted-foreground">
            Connect with our global network of alumni across industries and locations
          </p>
        </div>

        <AlumniList
          alumni={mockAlumni}
          onConnect={handleConnect}
          onMessage={handleMessage}
          onViewProfile={handleViewProfile}
        />
      </main>
      <Footer />
    </div>
  )
}
