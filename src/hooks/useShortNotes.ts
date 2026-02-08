import { useState, useCallback } from "react";

export function useShortNotes() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (answer: string, subject: string | null) => {
    setIsGenerating(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-short-notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ answer, subject }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("No image generated");
      }
    } catch (err) {
      console.error("Short notes error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate short notes");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return { imageUrl, isGenerating, error, generate, reset };
}
