import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const body = await request.json()
    const { contentId, action, timestamp, watchTime } = body

    // Log the analytics event
    await db.collection("analytics").insertOne({
      contentId: new ObjectId(contentId),
      action,
      timestamp: new Date(timestamp),
      watchTime: watchTime || 0,
    })

    // Update content watch time if provided
    if (watchTime && action === "pause") {
      await db.collection("content").updateOne({ _id: new ObjectId(contentId) }, { $inc: { watchTime: watchTime } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to log analytics" }, { status: 500 })
  }
}
