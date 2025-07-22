const TMDB_API_KEY = process.env.TMDB_API_KEY || 'your_tmdb_api_key_here'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface ProcessedContent {
  tmdbId: number
  title: string
  description: string
  thumbnailUrl: string
  backdropUrl: string
  type: 'movie' | 'series'
  releaseDate: string
  genres: string[]
  rating: number
  popularity: number
  embedUrl: string
  // Category flags
  featured?: boolean
  trending?: boolean
  popular?: boolean
  topSeries?: boolean
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB(`/movie/popular?page=${page}`)
    return data.results
  }

  async getTrendingMovies(): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week')
    return data.results
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB(`/tv/popular?page=${page}`)
    return data.results
  }

  async getTrendingTVShows(): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB('/trending/tv/week')
    return data.results
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB(`/movie/top_rated?page=${page}`)
    return data.results
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB(`/tv/top_rated?page=${page}`)
    return data.results
  }

  async getMovieGenres(): Promise<TMDBGenre[]> {
    const data = await this.fetchFromTMDB('/genre/movie/list')
    return data.genres
  }

  async getTVGenres(): Promise<TMDBGenre[]> {
    const data = await this.fetchFromTMDB('/genre/tv/list')
    return data.genres
  }

  private getGenreNames(genreIds: number[], allGenres: TMDBGenre[]): string[] {
    return genreIds
      .map(id => allGenres.find(genre => genre.id === id)?.name)
      .filter(Boolean) as string[]
  }

  async processMoviesData(movies: TMDBMovie[], genres: TMDBGenre[]): Promise<ProcessedContent[]> {
    return movies.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      description: movie.overview,
      thumbnailUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
      backdropUrl: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : '',
      type: 'movie' as const,
      releaseDate: movie.release_date,
      genres: this.getGenreNames(movie.genre_ids, genres),
      rating: movie.vote_average,
      popularity: movie.popularity,
      embedUrl: `https://player.embed-api.stream/?id=${movie.id}&type=movie`
    }))
  }

  async processTVShowsData(tvShows: TMDBTVShow[], genres: TMDBGenre[]): Promise<ProcessedContent[]> {
    return tvShows.map(show => ({
      tmdbId: show.id,
      title: show.name,
      description: show.overview,
      thumbnailUrl: show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : '',
      backdropUrl: show.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${show.backdrop_path}` : '',
      type: 'series' as const,
      releaseDate: show.first_air_date,
      genres: this.getGenreNames(show.genre_ids, genres),
      rating: show.vote_average,
      popularity: show.popularity,
      embedUrl: `https://player.embed-api.stream/?id=${show.id}&type=tv`
    }))
  }

  async getAllContent(): Promise<ProcessedContent[]> {
    try {
      // Fetch all data in parallel
      const [
        popularMovies,
        trendingMovies,
        topRatedMovies,
        popularTVShows,
        trendingTVShows,
        topRatedTVShows,
        movieGenres,
        tvGenres
      ] = await Promise.all([
        this.getPopularMovies(),
        this.getTrendingMovies(),
        this.getTopRatedMovies(),
        this.getPopularTVShows(),
        this.getTrendingTVShows(),
        this.getTopRatedTVShows(),
        this.getMovieGenres(),
        this.getTVGenres()
      ])

      // Combine all genres
      const allGenres = [...movieGenres, ...tvGenres]

      // Process all content
      const [
        processedPopularMovies,
        processedTrendingMovies,
        processedTopRatedMovies,
        processedPopularTVShows,
        processedTrendingTVShows,
        processedTopRatedTVShows
      ] = await Promise.all([
        this.processMoviesData(popularMovies, allGenres),
        this.processMoviesData(trendingMovies, allGenres),
        this.processMoviesData(topRatedMovies, allGenres),
        this.processTVShowsData(popularTVShows, allGenres),
        this.processTVShowsData(trendingTVShows, allGenres),
        this.processTVShowsData(topRatedTVShows, allGenres)
      ])

      // Combine all content and add category flags
      const allContent: ProcessedContent[] = []

      // Add popular movies
      processedPopularMovies.forEach(movie => {
        allContent.push({ ...movie, popular: true })
      })

      // Add trending content
      processedTrendingMovies.forEach(movie => {
        allContent.push({ ...movie, trending: true })
      })
      processedTrendingTVShows.forEach(show => {
        allContent.push({ ...show, trending: true })
      })

      // Add top rated content
      processedTopRatedMovies.forEach(movie => {
        allContent.push({ ...movie, featured: true })
      })
      processedTopRatedTVShows.forEach(show => {
        allContent.push({ ...show, topSeries: true })
      })

      // Add popular TV shows
      processedPopularTVShows.forEach(show => {
        allContent.push({ ...show, popular: true })
      })

      return allContent
    } catch (error) {
      console.error('Error fetching TMDB data:', error)
      throw error
    }
  }
}

export const tmdbService = new TMDBService()
