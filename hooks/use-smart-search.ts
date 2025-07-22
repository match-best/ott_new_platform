import { useState } from "react";

export function useSmartSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identifiedTitle, setIdentifiedTitle] = useState<string | null>(null);

  async function triggerSearch(searchTerm: string) {
    if (!searchTerm) {
      setResults([]);
      setError(null);
      setIdentifiedTitle(null);
      return;
    }
    setLoading(true);
    setError(null);
    setIdentifiedTitle(null);
    try {
      // Call Gemini API
      const geminiRes = await fetch(`/api/smart-search?q=${encodeURIComponent(searchTerm)}`);
      const geminiData = await geminiRes.json();
      
      // Log everything for debugging
      console.log("\n=== FRONTEND GEMINI RESPONSE ===");
      console.log("Search Term:", searchTerm);
      console.log("API Response:", geminiData);
      console.log("=== FRONTEND RESPONSE END ===\n");
      
      if (geminiData.success) {
        if (geminiData.title && geminiData.results) {
          setIdentifiedTitle(geminiData.title);
          setResults(geminiData.results);
          setError(null);
        } else {
          setError(geminiData.message || "No matching content found");
          setResults([]);
        }
      } else {
        setError(geminiData.error || "Failed to get response from AI");
        setResults([]);
      }
    } catch (err) {
      setError("Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, identifiedTitle, triggerSearch };
} 