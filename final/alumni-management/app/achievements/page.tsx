"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { AchievementCard, type Achievement } from "@/components/achievements/achievement-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock achievements data with Indian context
const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Padma Shri Award for Contribution to Technology",
    description:
      "Recognized by the Government of India with the Padma Shri award for outstanding contributions to the field of artificial intelligence and machine learning, particularly in developing AI solutions for rural healthcare in India.",
    alumniName: "Dr. Rajesh Iyer",
    alumniRole: "Chief Technology Officer, Infosys",
    achievementDate: "2024-01-26",
    category: "Award",
    organization: "Government of India",
    impact: "AI healthcare solutions deployed in 500+ rural clinics across 15 states",
    tags: ["padma-shri", "ai", "healthcare", "government-recognition"],
  },
  {
    id: "2",
    title: "Promoted to Managing Director at Goldman Sachs India",
    description:
      "Achieved the prestigious position of Managing Director at Goldman Sachs India, becoming one of the youngest professionals to reach this level. Leading the India investment banking division with focus on technology and healthcare sectors.",
    alumniName: "Sneha Reddy",
    alumniRole: "Managing Director, Goldman Sachs India",
    achievementDate: "2024-01-15",
    category: "Promotion",
    organization: "Goldman Sachs",
    impact: "Led deals worth over ₹10,000 crores in the past year",
    tags: ["promotion", "investment-banking", "leadership", "finance"],
  },
  {
    id: "3",
    title: "Forbes 30 Under 30 Asia - Technology Category",
    description:
      "Featured in Forbes 30 Under 30 Asia list for revolutionary work in fintech and digital payments. Recognized for building payment infrastructure that serves over 100 million users across Southeast Asia.",
    alumniName: "Arjun Patel",
    alumniRole: "Founder & CEO, PayEasy",
    achievementDate: "2024-01-10",
    category: "Recognition",
    organization: "Forbes Asia",
    impact: "Payment platform processing ₹50,000 crores annually",
    tags: ["forbes", "fintech", "entrepreneur", "asia"],
  },
  {
    id: "4",
    title: "Published Research in Nature - AI for Climate Change",
    description:
      "Co-authored groundbreaking research paper published in Nature journal on using artificial intelligence for climate change prediction and mitigation strategies specific to the Indian subcontinent.",
    alumniName: "Dr. Priya Sharma",
    alumniRole: "Senior Research Scientist, Google AI",
    achievementDate: "2023-12-20",
    category: "Publication",
    organization: "Nature Journal",
    impact: "Research cited by IPCC in latest climate assessment report",
    tags: ["research", "climate-change", "ai", "publication"],
  },
  {
    id: "5",
    title: "Unicorn Status Achievement - Zomato IPO Success",
    description:
      "Led the product team that took Zomato public, achieving a successful IPO and unicorn status. The IPO raised ₹9,375 crores, making it one of India's largest tech IPOs.",
    alumniName: "Rohit Kumar",
    alumniRole: "VP Product, Zomato",
    achievementDate: "2023-11-15",
    category: "Milestone",
    organization: "Zomato",
    impact: "IPO valued company at ₹65,000 crores",
    tags: ["ipo", "unicorn", "product", "foodtech"],
  },
  {
    id: "6",
    title: "National Startup Award - Best Women Entrepreneur",
    description:
      "Received the National Startup Award in the 'Best Women Entrepreneur' category for building India's largest EdTech platform for vernacular languages, serving over 10 million students.",
    alumniName: "Kavya Nair",
    alumniRole: "Founder & CEO, LearnIndia",
    achievementDate: "2023-10-30",
    category: "Award",
    organization: "Department for Promotion of Industry and Internal Trade",
    impact: "Platform available in 12 Indian languages, 10M+ students",
    tags: ["startup-award", "edtech", "women-entrepreneur", "vernacular"],
  },
  {
    id: "7",
    title: "TED Talk - Future of Work in India",
    description:
      "Delivered a highly acclaimed TED Talk on 'The Future of Work in Post-Pandemic India' which has garnered over 2 million views. Discussed the transformation of Indian workforce and remote work culture.",
    alumniName: "Vikram Singh",
    alumniRole: "Chief People Officer, Flipkart",
    achievementDate: "2023-09-25",
    category: "Recognition",
    organization: "TED",
    impact: "2M+ views, featured in Harvard Business Review",
    tags: ["ted-talk", "future-of-work", "hr", "pandemic"],
  },
  {
    id: "8",
    title: "Economic Times Startup Awards - Startup of the Year",
    description:
      "Co-founded startup won the prestigious ET Startup Awards 'Startup of the Year' for developing India's first AI-powered agricultural advisory platform serving 5 million farmers.",
    alumniName: "Ananya Gupta",
    alumniRole: "Co-founder & CTO, AgriTech Solutions",
    achievementDate: "2023-08-15",
    category: "Award",
    organization: "Economic Times",
    impact: "Serving 5M farmers across 20 states, 30% yield improvement",
    tags: ["startup-award", "agritech", "ai", "farmers"],
  },
]

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const { toast } = useToast()

  const filteredAchievements = achievements
    .filter((achievement) => {
      const matchesSearch =
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.alumniName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || achievement.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.achievementDate).getTime() - new Date(a.achievementDate).getTime()
      }
      return 0
    })

  const handleViewDetails = (id: string) => {
    toast({
      title: "Achievement Details",
      description: "Loading detailed achievement information...",
    })
  }

  const handleShare = (id: string) => {
    toast({
      title: "Shared",
      description: "Achievement shared successfully!",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alumni Achievements</h1>
          <p className="text-muted-foreground">
            Celebrating the remarkable accomplishments and milestones of our alumni community
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Award">Awards</SelectItem>
              <SelectItem value="Promotion">Promotions</SelectItem>
              <SelectItem value="Recognition">Recognition</SelectItem>
              <SelectItem value="Milestone">Milestones</SelectItem>
              <SelectItem value="Publication">Publications</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAchievements.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No achievements found matching your criteria.</p>
            </div>
          ) : (
            filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onViewDetails={handleViewDetails}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
