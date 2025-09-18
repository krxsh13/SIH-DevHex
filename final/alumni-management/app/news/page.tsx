"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { NewsFeed } from "@/components/news/news-feed"
import type { NewsItem } from "@/components/news/news-card"
import { useToast } from "@/hooks/use-toast"

// Mock news data with Indian context
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Priya Sharma Promoted to VP Engineering at Flipkart",
    content:
      "Congratulations to our alumna Priya Sharma on her promotion to Vice President of Engineering at Flipkart! She will be leading the platform engineering team responsible for scaling Flipkart's infrastructure to serve over 400 million users across India.",
    author: "Priya Sharma",
    authorRole: "VP Engineering, Flipkart",
    publishedDate: "2024-01-20",
    category: "Achievement",
    likes: 156,
    comments: 23,
    isLiked: false,
    isBookmarked: false,
    tags: ["promotion", "engineering", "flipkart", "leadership"],
  },
  {
    id: "2",
    title: "Arjun Patel's Fintech Startup Raises ₹50 Crores in Series A",
    content:
      "Alumni entrepreneur Arjun Patel's fintech startup 'PayEasy' has successfully raised ₹50 crores in Series A funding led by Sequoia Capital India. The startup focuses on digital payments for small businesses in tier-2 and tier-3 cities across India.",
    author: "Arjun Patel",
    authorRole: "Founder & CEO, PayEasy",
    publishedDate: "2024-01-18",
    category: "Achievement",
    likes: 234,
    comments: 45,
    isLiked: true,
    isBookmarked: true,
    tags: ["startup", "funding", "fintech", "entrepreneur"],
  },
  {
    id: "3",
    title: "New Job Openings at Zomato - Multiple Positions",
    content:
      "Zomato is hiring for multiple positions including Product Managers, Software Engineers, and Data Scientists. Great opportunity to join India's leading food-tech company. Competitive packages ranging from ₹15L to ₹45L based on experience.",
    author: "Rohit Kumar",
    authorRole: "UX Designer, Zomato",
    publishedDate: "2024-01-17",
    category: "Job Update",
    likes: 89,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    tags: ["jobs", "zomato", "hiring", "multiple-roles"],
  },
  {
    id: "4",
    title: "Alumni Mentorship Program 2024 Registration Open",
    content:
      "We're excited to announce the launch of our Alumni Mentorship Program 2024! This program connects current students with successful alumni across various industries. Registration is now open for both mentors and mentees. Over 500 alumni have already signed up as mentors.",
    author: "Alumni Association",
    authorRole: "Official Announcement",
    publishedDate: "2024-01-15",
    category: "Announcement",
    likes: 178,
    comments: 34,
    isLiked: false,
    isBookmarked: true,
    tags: ["mentorship", "program", "students", "registration"],
  },
  {
    id: "5",
    title: "Sneha Reddy Featured in Forbes 30 Under 30 India",
    content:
      "Congratulations to Sneha Reddy for being featured in Forbes 30 Under 30 India list in the Finance category! Her innovative work in sustainable finance and ESG investing at ICICI Bank has been recognized nationally. She's also been invited to speak at the upcoming India Economic Summit.",
    author: "Sneha Reddy",
    authorRole: "Investment Banking Analyst, ICICI Bank",
    publishedDate: "2024-01-14",
    category: "Achievement",
    likes: 267,
    comments: 56,
    isLiked: true,
    isBookmarked: false,
    tags: ["forbes", "recognition", "finance", "sustainability"],
  },
  {
    id: "6",
    title: "Tech Talk: AI in Indian Healthcare - Virtual Event",
    content:
      "Join us for an insightful tech talk on 'AI Applications in Indian Healthcare' featuring alumni working at leading healthtech companies. The virtual event will cover case studies from Practo, 1mg, and Cure.fit. Free registration for all alumni and students.",
    author: "Vikram Singh",
    authorRole: "Data Scientist, Ola",
    publishedDate: "2024-01-12",
    category: "News",
    likes: 145,
    comments: 28,
    isLiked: false,
    isBookmarked: false,
    tags: ["tech-talk", "ai", "healthcare", "virtual-event"],
  },
  {
    id: "7",
    title: "Kavya Nair Joins Shark Tank India as Guest Investor",
    content:
      "Our alumna Kavya Nair has been invited as a guest investor on Shark Tank India Season 3! As the Marketing Director at Byju's, she brings valuable expertise in EdTech and consumer marketing. She'll be evaluating startups in the education and consumer goods space.",
    author: "Kavya Nair",
    authorRole: "Marketing Director, Byju's",
    publishedDate: "2024-01-10",
    category: "Achievement",
    likes: 312,
    comments: 67,
    isLiked: false,
    isBookmarked: true,
    tags: ["shark-tank", "investor", "edtech", "television"],
  },
  {
    id: "8",
    title: "Campus Placement Drive 2024 - Record Breaking Results",
    content:
      "Our 2024 campus placement drive has concluded with record-breaking results! 95% placement rate with average package of ₹12.5L and highest package of ₹65L from Google India. Top recruiters included TCS, Infosys, Flipkart, Amazon, Microsoft, and Goldman Sachs. Special thanks to all alumni who participated as interviewers and mentors.",
    author: "Placement Cell",
    authorRole: "Official Update",
    publishedDate: "2024-01-08",
    category: "News",
    likes: 445,
    comments: 89,
    isLiked: true,
    isBookmarked: false,
    tags: ["placements", "campus", "results", "packages"],
  },
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(mockNews)
  const { toast } = useToast()

  const handleLike = (id: string) => {
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.id === id
          ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
          : item,
      ),
    )
  }

  const handleComment = (id: string) => {
    toast({
      title: "Comments",
      description: "Comment feature coming soon!",
    })
  }

  const handleShare = (id: string) => {
    toast({
      title: "Shared",
      description: "News item shared successfully!",
    })
  }

  const handleBookmark = (id: string) => {
    setNews((prevNews) =>
      prevNews.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item)),
    )
    const newsItem = news.find((item) => item.id === id)
    toast({
      title: newsItem?.isBookmarked ? "Bookmark Removed" : "Bookmarked",
      description: newsItem?.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">News & Updates</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest achievements, announcements, and news from our alumni community
          </p>
        </div>

        <NewsFeed
          news={news}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onBookmark={handleBookmark}
        />
      </main>
      <Footer />
    </div>
  )
}
