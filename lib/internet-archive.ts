import axios from "axios";

export interface ArchiveMovie {
  identifier: string;
  title: string;
  description?: string;
  thumbnail?: string;
  streamingUrl?: string;
  genre: string[];
}

// Fetches a list of feature films from the Internet Archive
export async function fetchArchiveMovies(page = 1, rows = 20): Promise<ArchiveMovie[]> {
  const searchUrl = `https://archive.org/advancedsearch.php`;
  const params = {
    q: 'mediatype:(movies) AND collection:(feature_films)',
    fl: 'identifier,title,description,subject',
    sort: 'downloads desc',
    rows: rows.toString(),
    page: page.toString(),
    output: 'json',
  };

  const { data } = await axios.get(searchUrl, { params });
  const docs = data.response.docs;

  // Map to ArchiveMovie objects
  return docs.map((doc: any) => {
    const identifier = doc.identifier;
    // subject can be string, array, or undefined
    let genre: string[] = [];
    if (Array.isArray(doc.subject)) {
      genre = doc.subject.flatMap((s: string) => s.split(",").map((g: string) => g.trim())).filter(Boolean);
    } else if (typeof doc.subject === "string") {
      genre = doc.subject.split(",").map((g: string) => g.trim()).filter(Boolean);
    }
    return {
      identifier,
      title: doc.title,
      description: doc.description,
      thumbnail: `https://archive.org/services/img/${identifier}`,
      streamingUrl: `https://archive.org/download/${identifier}/${identifier}.mp4`,
      genre,
    };
  });
} 