import { MongoClient } from "mongodb"
// @ts-ignore
import fetch from "node-fetch"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const OMDB_API_KEY = process.env.OMDB_API_KEY || "thewdb" // Demo key, replace with your own for more results
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY // Optional, for more accurate trailer search

const MOVIE_TITLES = [
  "The Dark Knight",
  "Inception",
  "Interstellar",
  "The Matrix",
  "Pulp Fiction",
  "Avatar",
  "Avengers: Endgame",
  "Joker",
  "Spider-Man: No Way Home",
  "Top Gun: Maverick",
  "Breaking Bad",
  "Stranger Things",
  "The Crown",
  "Game of Thrones",
  "The Mandalorian"
]

async function fetchMovieData(title: string) {
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.Response === "False") return null
  return data
}

async function fetchYouTubeTrailer(title: string) {
  // Fallback: just use a YouTube search URL
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`
}

function mapToContentSchema(movie: any): any {
  return {
    title: movie.Title,
    description: movie.Plot,
    genre: movie.Genre ? movie.Genre.split(", ") : [],
    thumbnailUrl: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/500x750?text=No+Image",
    youtubeUrl: movie.youtubeUrl,
    type: movie.Type === "series" ? "series" : "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: Math.floor(Math.random() * 5000),
    watchTime: Math.floor(Math.random() * 100000),
    published: true,
  }
}

async function main() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db("streamflix")
    const collection = db.collection("content")
    await collection.deleteMany({})
    console.log("Cleared existing content")

    const contentDocs = []
    for (const title of MOVIE_TITLES) {
      const movie = await fetchMovieData(title)
      if (!movie) {
        console.log(`Not found: ${title}`)
        continue
      }
      const youtubeUrl = await fetchYouTubeTrailer(title)
      const doc = mapToContentSchema({ ...movie, youtubeUrl })
      contentDocs.push(doc)
      console.log(`Prepared: ${title}`)
    }
    if (contentDocs.length) {
      await collection.insertMany(contentDocs)
      console.log(`Inserted ${contentDocs.length} content items!`)
    } else {
      console.log("No content to insert.")
    }
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

main() 