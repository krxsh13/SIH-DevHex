"use client"

import { useState } from "react"
import { NewsCard, type NewsItem } from "./news-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface NewsFeedProps {
  news: NewsItem[]
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  onBookmark: (id: string) => void
}

export function NewsFeed({ news, onLike, onComment, onShare, onBookmark }: NewsFeedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  const filteredNews = news
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      } else if (sortBy === "popular") {
        return b.likes - a.likes
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search news and updates..."
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
            <SelectItem value="Achievement">Achievements</SelectItem>
            <SelectItem value="Job Update">Job Updates</SelectItem>
            <SelectItem value="News">News</SelectItem>
            <SelectItem value="Announcement">Announcements</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No news items found matching your criteria.</p>
          </div>
        ) : (
          filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
              onBookmark={onBookmark}
            />
          ))
        )}
      </div>
    </div>
  )
}
