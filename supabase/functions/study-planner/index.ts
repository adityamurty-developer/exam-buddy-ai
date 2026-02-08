import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Subject {
  name: string;
  topics: string[];
}

interface PlannerInput {
  examName: string;
  subjects: Subject[];
  daysLeft: number;
  dailyHours: number;
  startDate: string;
}

function getSystemPrompt(): string {
  return `You are an expert academic planner with 20+ years of experience helping students prepare for exams. Create effective, realistic study schedules.

CRITICAL RULES:
1. Distribute subjects evenly across available days
2. Allocate more time to complex/difficult topics
3. Include revision days (at least 20% of total time)
4. Never schedule more than the daily hours limit
5. Consider topic dependencies - basics before advanced
6. Include short breaks between subjects
7. Leave the last 1-2 days purely for revision
8. Mix heavy and light subjects each day
9. Prioritize topics the student listed first (assume higher importance)

OUTPUT FORMAT (STRICT JSON):
Return ONLY valid JSON with this exact structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "days": [
        {
          "date": "YYYY-MM-DD",
          "dayName": "Monday",
          "sessions": [
            {
              "subject": "Subject Name",
              "topic": "Specific Topic",
              "duration": 2,
              "type": "study" | "revision" | "practice"
            }
          ],
          "totalHours": 4
        }
      ]
    }
  ],
  "summary": {
    "totalStudyDays": 14,
    "revisionDays": 3,
    "subjectHours": { "Subject1": 20, "Subject2": 15 }
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Do NOT include any text before or after the JSON. Return ONLY the JSON object.`;
}

function buildUserPrompt(input: PlannerInput): string {
  const subjectList = input.subjects
    .map(s => `- ${s.name}: ${s.topics.length > 0 ? s.topics.join(", ") : "All topics"}`  )
    .join("\n");

  return `Create a study plan with these details:

EXAM: ${input.examName}
DAYS LEFT: ${input.daysLeft} days
DAILY STUDY HOURS: ${input.dailyHours} hours
START DATE: ${input.startDate}

SUBJECTS AND TOPICS:
${subjectList}

Generate a complete day-by-day study schedule organized by weeks. Make it realistic and effective.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PlannerInput = await req.json();

    if (!input.examName || !input.subjects || input.subjects.length === 0 || !input.daysLeft || !input.dailyHours) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: examName, subjects, daysLeft, dailyHours" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: getSystemPrompt() },
          { role: "user", content: buildUserPrompt(input) },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate study plan. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response
    try {
      // Remove markdown code blocks if present
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const plan = JSON.parse(jsonStr);
      return new Response(
        JSON.stringify(plan),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse study plan. Please try again.", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (e) {
    console.error("study-planner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
