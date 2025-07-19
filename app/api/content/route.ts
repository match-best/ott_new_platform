import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const featured = searchParams.get("featured")

    const query: any = {}

    if (type) {
      query.type = type
    }

    const content = await db
      .collection("content")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(featured ? 8 : 0)
      .toArray()

    // Map fields for frontend compatibility
    const mappedContent = content.map(item => ({
      ...item,
      thumbnailUrl: item.thumbnailUrl || item.thumbnail1,
      youtubeUrl: item.youtubeUrl || item.videoUrl,
      type: (item.type || "").toLowerCase(),
    }))

    console.log("API /api/content sending:", mappedContent)

    const response = NextResponse.json(mappedContent)
    response.headers.set('x-db-used', 'streamflix')
    return response
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const body = await request.json()

    const content = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      watchTime: 0,
    }

    const result = await db.collection("content").insertOne(content)

    return NextResponse.json({ _id: result.insertedId, ...content })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
