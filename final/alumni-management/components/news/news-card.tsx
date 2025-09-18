"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

export interface NewsItem {
  id: string
  title: string
  content: string
  author: string
  authorRole: string
  authorImage?: string
  publishedDate: string
  category: "Achievement" | "News" | "Job Update" | "Announcement"
  likes: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
  tags: string[]
}

interface NewsCardProps {
  news: NewsItem
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  onBookmark: (id: string) => void
}

export function NewsCard({ news, onLike, onComment, onShare, onBookmark }: NewsCardProps) {
  const getCategoryColor = (category: NewsItem["category"]) => {
    switch (category) {
      case "Achievement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Job Update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "News":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Announcement":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={news.authorImage || "/placeholder.svg"} alt={news.author} />
              <AvatarFallback>
                {news.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{news.author}</p>
              <p className="text-xs text-muted-foreground">{news.authorRole}</p>
              <p className="text-xs text-muted-foreground">{news.publishedDate}</p>
            </div>
          </div>
          <Badge className={getCategoryColor(news.category)}>{news.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-balance">{news.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{news.content}</p>
        </div>

        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {news.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(news.id)}
              className={`flex items-center space-x-1 ${news.isLiked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-4 w-4 ${news.isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{news.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(news.id)}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{news.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onShare(news.id)} className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(news.id)}
            className={news.isBookmarked ? "text-blue-500" : ""}
          >
            <Bookmark className={`h-4 w-4 ${news.isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
