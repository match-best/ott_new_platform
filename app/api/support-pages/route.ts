import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const client = await getMongoClient();
  const db = client.db();
  const page = await db.collection("support_pages").findOne({ slug });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    slug: page.slug,
    title: page.title,
    content: page.content,
    updatedAt: page.updatedAt,
  });
} 