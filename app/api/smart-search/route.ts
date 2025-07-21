// File: app/api/smart-search/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Environment variable ka naam theek kiya gaya hai
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

// Initialize the Google Generative AI client from the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Function to handle GET requests
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

    // Thoda behtar prompt
    const prompt = `Analyze the following phrase. If it is a famous movie quote or a variation of one, return ONLY the official name of the movie. Otherwise, return "N/A".

    Phrase: "${userQuery}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const movieName = response.text().trim();

    console.log("AI Identified Movie:", movieName);

    if (movieName && movieName.toLowerCase() !== "n/a") {
      return NextResponse.json({
        aiIdentifiedMovie: movieName,
        searchResults: [], // Placeholder for search results
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