import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const content = await db.collection("content").find({}).toArray()

    const totalViews = content.reduce((sum, item) => sum + (item.views || 0), 0)
    const totalWatchTime = content.reduce((sum, item) => sum + (item.watchTime || 0), 0)

    const analytics = {
      totalViews,
      totalWatchTime,
      totalContent: content.length,
      movieCount: content.filter((item) => item.type === "movie").length,
      seriesCount: content.filter((item) => item.type === "series").length,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
