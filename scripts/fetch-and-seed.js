require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const OMDB_API_KEY = process.env.OMDB_API_KEY || "thewdb"; // Demo key, replace with your own for more results

const MOVIE_TITLES = [
  // Movies (Blockbusters, Classics, Recent Hits)
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
  "Titanic",
  "The Shawshank Redemption",
  "Forrest Gump",
  "The Godfather",
  "Star Wars: Episode IV – A New Hope",
  "Jurassic Park",
  "The Lord of the Rings: The Fellowship of the Ring",
  "Gladiator",
  "Dune: Part Two",
  "Oppenheimer",
  "Barbie",
  "The Batman",
  "Deadpool & Wolverine",
  "Everything Everywhere All At Once",
  "Mad Max: Fury Road",
  "La La Land",
  "Parasite",
  "The Avengers",
  "Fight Club",
  "The Wolf of Wall Street",
  "Schindler's List",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "The Grand Budapest Hotel",
  "Knives Out",
  "Black Panther",
  "Inglourious Basterds",
  // TV Shows (Popular Series, Classics, Recent Hits)
  "Breaking Bad",
  "Stranger Things",
  "The Crown",
  "Game of Thrones",
  "The Mandalorian",
  "The Sopranos",
  "The Office",
  "Friends",
  "Better Call Saul",
  "The Witcher",
  "Westworld",
  "Succession",
  "The Last of Us",
  "Chernobyl",
  "Fargo",
  "The Boys",
  "House of the Dragon",
  "Ted Lasso",
  "Yellowstone",
  "Squid Game",
  // Sports-Related Content (Movies, Documentaries, Event Highlights)
  "Rocky",
  "Raging Bull",
  "The Last Dance",
  "Ford v Ferrari",
  "Moneyball",
  "Remember the Titans",
  "The Fighter",
  "I, Tonya",
  "King Richard",
  "Hoop Dreams",
  "Creed",
  "Free Solo",
  "Senna",
  "The Blind Side",
  "Super Bowl LVIII Highlights",
  "2024 Paris Olympics Opening Ceremony",
  "Rush",
  "Miracle",
  "Field of Dreams",
  "Chariots of Fire"
];

// Hardcoded YouTube trailer links for accuracy (official trailers where possible)
const TRAILER_LINKS = {
  // Movies
  "The Dark Knight": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
  "Inception": "https://www.youtube.com/watch?v=YoHD9XEInc0",
  "Interstellar": "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  "The Matrix": "https://www.youtube.com/watch?v=m8e-FF8MsWU",
  "Pulp Fiction": "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
  "Avatar": "https://www.youtube.com/watch?v=5PSNL1qE6VY",
  "Avengers: Endgame": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
  "Joker": "https://www.youtube.com/watch?v=t433PEQGErc",
  "Spider-Man: No Way Home": "https://www.youtube.com/watch?v=JfVOs4VSpmA",
  "Top Gun: Maverick": "https://www.youtube.com/watch?v=giXco2jaZ_4",
  "Titanic": "https://www.youtube.com/watch?v=2e-eXJ6HgkQ",
  "The Shawshank Redemption": "https://www.youtube.com/watch?v=6hB3S9bIaco",
  "Forrest Gump": "https://www.youtube.com/watch?v=bLvqoHBptjg",
  "The Godfather": "https://www.youtube.com/watch?v=sY1S34973zA",
  "Star Wars: Episode IV – A New Hope": "https://www.youtube.com/watch?v=vZ734NWnAHA",
  "Jurassic Park": "https://www.youtube.com/watch?v=lc0UehYemQA",
  "The Lord of the Rings: The Fellowship of the Ring": "https://www.youtube.com/watch?v=V75dMMIW2B4",
  "Gladiator": "https://www.youtube.com/watch?v=owK1qxDselE",
  "Dune: Part Two": "https://www.youtube.com/watch?v=Way9Dexny3w",
  "Oppenheimer": "https://www.youtube.com/watch?v=bK6ldnjE3Y0",
  "Barbie": "https://www.youtube.com/watch?v=pBk4NYhWNMM",
  "The Batman": "https://www.youtube.com/watch?v=mqqft2x_Aa4",
  "Deadpool & Wolverine": "https://www.youtube.com/watch?v=73_1biulkYk",
  "Everything Everywhere All At Once": "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
  "Mad Max: Fury Road": "https://www.youtube.com/watch?v=hEJnMQG9ev8",
  "La La Land": "https://www.youtube.com/watch?v=0pdqf4P9MB8",
  "Parasite": "https://www.youtube.com/watch?v=5xH0HfJHsaY",
  "The Avengers": "https://www.youtube.com/watch?v=eOrNdBpGMv8",
  "Fight Club": "https://www.youtube.com/watch?v=SUXWAEX2jlg",
  "The Wolf of Wall Street": "https://www.youtube.com/watch?v=iszwuX1AK6A",
  "Schindler's List": "https://www.youtube.com/watch?v=gG22XNht7QU",
  "Pirates of the Caribbean: The Curse of the Black Pearl": "https://www.youtube.com/watch?v=naQr0uTrH_s",
  "The Grand Budapest Hotel": "https://www.youtube.com/watch?v=1Fg5iWmQjwk",
  "Knives Out": "https://www.youtube.com/watch?v=qGqiHJTsRkQ",
  "Black Panther": "https://www.youtube.com/watch?v=xjDjIWPwcPU",
  "Inglourious Basterds": "https://www.youtube.com/watch?v=KnrRy6kSFF0",
  // TV Shows
  "Breaking Bad": "https://www.youtube.com/watch?v=HhesaQXLuRY",
  "Stranger Things": "https://www.youtube.com/watch?v=sj9J2ecsSpo",
  "The Crown": "https://www.youtube.com/watch?v=JWtnJjn6ng0",
  "Game of Thrones": "https://www.youtube.com/watch?v=rlR4PJn8b8I",
  "The Mandalorian": "https://www.youtube.com/watch?v=aOC8E8z_ifw",
  "The Sopranos": "https://www.youtube.com/watch?v=2U4G_1sc6VA",
  "The Office": "https://www.youtube.com/watch?v=tNa1G-pHfr4",
  "Friends": "https://www.youtube.com/watch?v=SM6zJ_ozp58",
  "Better Call Saul": "https://www.youtube.com/watch?v=HN4oydykJFc",
  "The Witcher": "https://www.youtube.com/watch?v=ndl1W4ltcmg",
  "Westworld": "https://www.youtube.com/watch?v=9BPJy3lckmQ",
  "Succession": "https://www.youtube.com/watch?v=OzYxJV_rmE8",
  "The Last of Us": "https://www.youtube.com/watch?v=uLtkt8BonwM",
  "Chernobyl": "https://www.youtube.com/watch?v=s9APLXM9Ei8",
  "Fargo": "https://www.youtube.com/watch?v=3Xs3T_5r2jQ",
  "The Boys": "https://www.youtube.com/watch?v=M1bhOaLV4FU",
  "House of the Dragon": "https://www.youtube.com/watch?v=DotnJ7tTA34",
  "Ted Lasso": "https://www.youtube.com/watch?v=3u7EIiohs6U",
  "Yellowstone": "https://www.youtube.com/watch?v=ZvC_33Z4ZNY",
  "Squid Game": "https://www.youtube.com/watch?v=oqxAJKy0ii4",
  // Sports-Related Content
  "Rocky": "https://www.youtube.com/watch?v=7RYpJAUMo2M",
  "Raging Bull": "https://www.youtube.com/watch?v=3SwFXg5oslc",
  "The Last Dance": "https://www.youtube.com/watch?v=PDjsk1sJYN8",
  "Ford v Ferrari": "https://www.youtube.com/watch?v=zyYgDtIk7tI",
  "Moneyball": "https://www.youtube.com/watch?v=-4QPVo0UIzc",
  "Remember the Titans": "https://www.youtube.com/watch?v=nPhu9XsRl4M",
  "The Fighter": "https://www.youtube.com/watch?v=72vYJroLxa4",
  "I, Tonya": "https://www.youtube.com/watch?v=OXZQ5hKBQKI",
  "King Richard": "https://www.youtube.com/watch?v=BKP_0z52ZAw",
  "Hoop Dreams": "https://www.youtube.com/watch?v=lyW2NcaFAYc",
  "Creed": "https://www.youtube.com/watch?v=Uv554B7f7SQ",
  "Free Solo": "https://www.youtube.com/watch?v=urRVZ4SW7WY",
  "Senna": "https://www.youtube.com/watch?v=8kN4_9qTs4M",
  "The Blind Side": "https://www.youtube.com/watch?v=g0N-7XMe3uk",
  "Super Bowl LVIII Highlights": "https://www.youtube.com/watch?v=unj-3tEVK0E",
  "2024 Paris Olympics Opening Ceremony": "https://www.youtube.com/watch?v=0F5zWCVYZ6Q",
  "Rush": "https://www.youtube.com/watch?v=8x6vJ2rOkUc",
  "Miracle": "https://www.youtube.com/watch?v=WyR3M-5t0uw",
  "Field of Dreams": "https://www.youtube.com/watch?v=7SB16il97yw",
  "Chariots of Fire": "https://www.youtube.com/watch?v=CSav51fVlKU"
};

// Section assignment for demo (index based)
const featuredIdx = 0; // The Dark Knight
const trendingIdxs = [1, 2, 3, 18, 19, 20]; // Inception, Interstellar, The Matrix, Dune: Part Two, Oppenheimer, Barbie
const popularIdxs = [4, 5, 6, 7, 8, 9, 21, 22, 23]; // Pulp Fiction, Avatar, Avengers: Endgame, Joker, Spider-Man: No Way Home, Top Gun: Maverick, The Batman, Deadpool & Wolverine, Everything Everywhere All At Once
const topSeriesIdxs = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]; // All TV shows

async function fetchMovieData(title) {
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") return null;
  return data;
}

async function fetchYouTubeTrailer(title) {
  // Return hardcoded trailer link if available
  if (TRAILER_LINKS[title]) {
    return TRAILER_LINKS[title];
  }
  // Fallback: generate a YouTube search URL
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " official trailer")}`;
}

function mapToContentSchema(movie, idx) {
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
    featured: idx === featuredIdx,
    trending: trendingIdxs.includes(idx),
    popular: popularIdxs.includes(idx),
    topSeries: topSeriesIdxs.includes(idx),
  };
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("streamflix");
    const collection = db.collection("content");
    await collection.deleteMany({});
    console.log("Cleared existing content");

    const contentDocs = [];
    for (let idx = 0; idx < MOVIE_TITLES.length; idx++) {
      const title = MOVIE_TITLES[idx];
      const movie = await fetchMovieData(title);
      if (!movie) {
        console.log(`Not found: ${title}`);
        continue;
      }
      const youtubeUrl = await fetchYouTubeTrailer(title);
      const doc = mapToContentSchema({ ...movie, youtubeUrl }, idx);
      contentDocs.push(doc);
      console.log(`Prepared: ${title}`);
    }
    if (contentDocs.length) {
      await collection.insertMany(contentDocs);
      console.log(`Inserted ${contentDocs.length} content items!`);
    } else {
      console.log("No content to insert.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();