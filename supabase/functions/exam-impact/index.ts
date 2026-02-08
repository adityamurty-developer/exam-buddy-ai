import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ExamProfile {
  examName: string;
  attemptYear: string;
  state: string;
  board: string;
  subjects: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json() as { profile: ExamProfile };

    if (!profile || !profile.examName) {
      return new Response(
        JSON.stringify({ error: "Profile with exam name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build search context from profile
    const searchContext = `${profile.examName} ${profile.attemptYear} ${profile.state} ${profile.board} exam news updates notifications syllabus pattern changes dates schedule`;
    const subjectsContext = profile.subjects.length > 0 ? profile.subjects.join(", ") : "all subjects";

    const systemPrompt = `You are an expert exam news analyst for Indian competitive exams and board exams. Your task is to:

1. Search for the latest news, updates, and official notifications related to the candidate's exam
2. Analyze each news item and determine its impact on the specific candidate
3. Categorize news by priority (urgent, important, info)
4. Provide actionable insights

Candidate Profile:
- Exam: ${profile.examName}
- Attempt Year: ${profile.attemptYear}
- State/Region: ${profile.state}
- Board/University: ${profile.board}
- Subjects: ${subjectsContext}

Return a JSON object with the following structure:
{
  "notices": [
    {
      "id": "unique-id",
      "title": "Notice title",
      "summary": "Brief summary of the notice (2-3 sentences)",
      "source": "Source name (e.g., NTA, CBSE, State Board)",
      "sourceUrl": "https://example.com/notice",
      "date": "2025-02-01",
      "priority": "urgent" | "important" | "info",
      "impactScore": 1-10,
      "impactAnalysis": "How this specifically affects the candidate",
      "actionItems": ["Action 1", "Action 2"],
      "affectedSubjects": ["Subject1", "Subject2"] or [],
      "category": "syllabus" | "schedule" | "pattern" | "eligibility" | "result" | "general"
    }
  ],
  "lastUpdated": "ISO date string",
  "profileSummary": "Brief summary of the candidate's exam situation"
}

Generate 4-8 realistic and relevant notices based on current exam trends and typical announcements for this exam type. Make them realistic and helpful for exam preparation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Find the latest exam news and updates for: ${searchContext}. Analyze the impact on my profile and return the structured JSON response.` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to fetch exam updates");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the response
    let result;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse exam updates");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in exam-impact function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
