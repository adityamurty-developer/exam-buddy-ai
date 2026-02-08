import { useState } from "react";

export interface Subject {
  id: string;
  name: string;
  topics: string[];
}

export interface Session {
  subject: string;
  topic: string;
  duration: number;
  type: "study" | "revision" | "practice";
}

export interface Day {
  date: string;
  dayName: string;
  sessions: Session[];
  totalHours: number;
}

export interface Week {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: Day[];
}

export interface StudyPlan {
  weeks: Week[];
  summary: {
    totalStudyDays: number;
    revisionDays: number;
    subjectHours: Record<string, number>;
  };
  tips: string[];
}

export interface PlannerInput {
  examName: string;
  subjects: Subject[];
  daysLeft: number;
  dailyHours: number;
  startDate: string;
}

export function useStudyPlanner() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (input: PlannerInput) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-planner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            examName: input.examName,
            subjects: input.subjects.map(s => ({
              name: s.name,
              topics: s.topics,
            })),
            daysLeft: input.daysLeft,
            dailyHours: input.dailyHours,
            startDate: input.startDate,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate study plan");
      }

      const data: StudyPlan = await response.json();
      setPlan(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate study plan");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setError(null);
  };

  return {
    plan,
    isLoading,
    error,
    generatePlan,
    reset,
  };
}
