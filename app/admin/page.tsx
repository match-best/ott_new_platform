"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { StreamplayNavbar } from "@/components/netflix-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, BarChart3, Eye, Clock, Users } from "lucide-react"
import { redirect } from "next/navigation"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const [content, setContent] = useState<any[]>([])
  const [isAddingContent, setIsAddingContent] = useState(false)
  const [editingContent, setEditingContent] = useState<any>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    thumbnailUrl: "",
    youtubeUrl: "",
    type: "movie" as "movie" | "series",
  })

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/login")
    }
  }, [user, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const genres = formData.genre
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g)

    const newContent = {
      _id: Date.now().toString(),
      ...formData,
      genre: genres,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      watchTime: 0,
      published: true,
    }

    if (editingContent) {
      setContent((prev) =>
        prev.map((item) => (item._id === editingContent._id ? { ...newContent, _id: editingContent._id } : item)),
      )
      toast({ title: "Content updated successfully!" })
    } else {
      setContent((prev) => [...prev, newContent])
      toast({ title: "Content added successfully!" })
    }

    setFormData({
      title: "",
      description: "",
      genre: "",
      thumbnailUrl: "",
      youtubeUrl: "",
      type: "movie",
    })
    setIsAddingContent(false)
    setEditingContent(null)
  }

  const handleEdit = (item: any) => {
    setEditingContent(item)
    setFormData({
      title: item.title,
      description: item.description,
      genre: item.genre.join(", "),
      thumbnailUrl: item.thumbnailUrl,
      youtubeUrl: item.youtubeUrl,
      type: item.type,
    })
    setIsAddingContent(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      setContent((prev) => prev.filter((item) => item._id !== id))
      toast({ title: "Content deleted successfully!" })
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  const totalViews = content.reduce((sum, item) => sum + item.views, 0)
  const totalWatchTime = content.reduce((sum, item) => sum + item.watchTime, 0)

  return (
    <div className="min-h-screen bg-black">
      <StreamplayNavbar />

      <div className="pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">{content.length}</p>
                    <p className="text-sm text-gray-400">Total Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">{Math.floor(totalWatchTime / 60)}</p>
                    <p className="text-sm text-gray-400">Hours Watched</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">1,234</p>
                    <p className="text-sm text-gray-400">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Content Button */}
          <div className="mb-6">
            <Button onClick={() => setIsAddingContent(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </div>

          {/* Add/Edit Content Form */}
          {isAddingContent && (
            <Card className="mb-8 bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{editingContent ? "Edit Content" : "Add New Content"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-white">
                        Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "movie" | "series") => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre" className="text-white">
                      Genres (comma-separated)
                    </Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="Action, Drama, Thriller"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnailUrl" className="text-white">
                      Thumbnail URL
                    </Label>
                    <Input
                      id="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtubeUrl" className="text-white">
                      YouTube URL
                    </Label>
                    <Input
                      id="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      {editingContent ? "Update Content" : "Add Content"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingContent(false)
                        setEditingContent(null)
                        setFormData({
                          title: "",
                          description: "",
                          genre: "",
                          thumbnailUrl: "",
                          youtubeUrl: "",
                          type: "movie",
                        })
                      }}
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Content List */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Manage Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{item.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize border-gray-600 text-white">
                          {item.type}
                        </Badge>
                        {item.genre.map((g: string) => (
                          <Badge key={g} variant="secondary" className="bg-gray-800 text-white">
                            {g}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(item.watchTime / 60)} min
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item._id)}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
