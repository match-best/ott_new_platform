import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"

const sampleContent = [
  // Movies
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    thumbnailUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1250,
    watchTime: 18500,
    published: true,
  },
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    thumbnailUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 980,
    watchTime: 15200,
    published: true,
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    thumbnailUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1100,
    watchTime: 16800,
    published: true,
  },
  {
    title: "The Matrix",
    description:
      "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    genre: ["Action", "Sci-Fi"],
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1450,
    watchTime: 19200,
    published: true,
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    genre: ["Crime", "Drama"],
    thumbnailUrl: "https://images.unsplash.com/photo-1489599162810-1e666c2c4c5b?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 890,
    watchTime: 14500,
    published: true,
  },
  {
    title: "Avatar",
    description:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    genre: ["Action", "Adventure", "Fantasy"],
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1350,
    watchTime: 17800,
    published: true,
  },
  {
    title: "Avengers: Endgame",
    description:
      "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre: ["Action", "Adventure", "Drama"],
    thumbnailUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 2100,
    watchTime: 28500,
    published: true,
  },
  {
    title: "Joker",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.",
    genre: ["Crime", "Drama", "Thriller"],
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1680,
    watchTime: 21200,
    published: true,
  },
  {
    title: "Spider-Man: No Way Home",
    description:
      "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    genre: ["Action", "Adventure", "Fantasy"],
    thumbnailUrl: "https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1920,
    watchTime: 24800,
    published: true,
  },
  {
    title: "Top Gun: Maverick",
    description:
      "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.",
    genre: ["Action", "Drama"],
    thumbnailUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=qSqVVswa420",
    type: "movie",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1540,
    watchTime: 19800,
    published: true,
  },

  // Series
  {
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    genre: ["Crime", "Drama", "Thriller"],
    thumbnailUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    type: "series",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 2850,
    watchTime: 45600,
    published: true,
  },
  {
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    genre: ["Drama", "Fantasy", "Horror"],
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    type: "series",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 3200,
    watchTime: 52800,
    published: true,
  },
  {
    title: "The Crown",
    description:
      "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    genre: ["Biography", "Drama", "History"],
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=JWtnJjn6ng0",
    type: "series",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 1890,
    watchTime: 31200,
    published: true,
  },
  {
    title: "Game of Thrones",
    description:
      "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    genre: ["Action", "Adventure", "Drama"],
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
    type: "series",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 4200,
    watchTime: 68400,
    published: true,
  },
  {
    title: "The Mandalorian",
    description:
      "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    genre: ["Action", "Adventure", "Fantasy"],
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=750&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=aOC8E8z_ifw",
    type: "series",
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 2650,
    watchTime: 42800,
    published: true,
  },
]

async function seed() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("streamflix")

    // Clear existing content
    await db.collection("content").deleteMany({})
    console.log("Cleared existing content")

    // Insert sample content
    const result = await db.collection("content").insertMany(sampleContent)
    console.log(`Inserted ${result.insertedCount} content items`)

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seed()
