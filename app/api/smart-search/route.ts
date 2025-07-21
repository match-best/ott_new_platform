// File: app/api/smart-search/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import clientPromise from "../../../lib/mongodb"; // Import the DB connection helper

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userQuery = searchParams.get("q");

  if (!userQuery) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the following phrase. If it is a famous movie quote or a variation of one, return ONLY the official name of the movie. Otherwise, return "N/A". Phrase: "${userQuery}"`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const movieName = response.text().trim();

    console.log("AI Identified Movie:", movieName);

    if (movieName && movieName.toLowerCase() !== "n/a") {
      const client = await clientPromise;
      const db = client.db("streamflix"); // Put your DB name here

      const fullSearchResults = await db
        .collection("content")
        .find({ title: { $regex: movieName, $options: "i" } })
        .limit(10)
        .toArray();

      // --- THIS IS THE NEW CHANGE ---
      // We are extracting only the 'title' from the entire data.
      const searchResultTitles = fullSearchResults.map(doc => doc.title);

      console.log("Found in DB:", searchResultTitles);

      return NextResponse.json({
        aiIdentifiedMovie: movieName,
        searchResults: searchResultTitles, // Now only the list of titles will be sent here
      });

    } else {
      return NextResponse.json({
        aiIdentifiedMovie: null,
        message: "Could not identify a movie from the quote.",
      });
    }
  } catch (error) {
    console.error("Error in smart search:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
