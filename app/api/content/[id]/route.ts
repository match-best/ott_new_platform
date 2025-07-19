import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const content = await db.collection("content").findOne({
      _id: new ObjectId(params.id),
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Increment view count
    await db.collection("content").updateOne({ _id: new ObjectId(params.id) }, { $inc: { views: 1 } })

    return NextResponse.json({ ...content, views: content.views + 1 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const body = await request.json()

    const result = await db.collection("content").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("streamflix")

    const result = await db.collection("content").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
