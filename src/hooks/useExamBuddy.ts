import { useState, useCallback } from "react";

interface ExamBuddyState {
  answer: string;
  subject: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useExamBuddy() {
  const [state, setState] = useState<ExamBuddyState>({
    answer: "",
    subject: null,
    isLoading: false,
    error: null,
  });

  const askQuestion = useCallback(async (question: string, mode: "exam" | "simple") => {
    setState({ answer: "", subject: null, isLoading: true, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exam-buddy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ question, mode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answerSoFar = "";
      let detectedSubject: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            
            // Check for subject metadata
            if (parsed.subject && !detectedSubject) {
              detectedSubject = parsed.subject;
              setState((prev) => ({ ...prev, subject: detectedSubject }));
              continue;
            }

            // Handle content delta
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              answerSoFar += content;
              setState((prev) => ({ ...prev, answer: answerSoFar }));
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.subject && !detectedSubject) {
              detectedSubject = parsed.subject;
            }
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              answerSoFar += content;
            }
          } catch { /* ignore */ }
        }
      }

      setState((prev) => ({ ...prev, isLoading: false, answer: answerSoFar }));
    } catch (error) {
      console.error("Exam buddy error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to get answer",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ answer: "", subject: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    askQuestion,
    reset,
  };
}
