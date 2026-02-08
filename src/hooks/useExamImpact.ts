import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ExamProfile {
  examName: string;
  attemptYear: string;
  state: string;
  board: string;
  subjects: string[];
}

export interface ExamNotice {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  date: string;
  priority: "urgent" | "important" | "info";
  impactScore: number;
  impactAnalysis: string;
  actionItems: string[];
  affectedSubjects: string[];
  category: "syllabus" | "schedule" | "pattern" | "eligibility" | "result" | "general";
}

export interface ExamImpactResult {
  notices: ExamNotice[];
  lastUpdated: string;
  profileSummary: string;
}

export function useExamImpact() {
  const [notices, setNotices] = useState<ExamNotice[]>([]);
  const [profileSummary, setProfileSummary] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ExamProfile | null>(null);

  const fetchExamUpdates = useCallback(async (examProfile: ExamProfile) => {
    setIsLoading(true);
    setError(null);
    setProfile(examProfile);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("exam-impact", {
        body: { profile: examProfile },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to fetch exam updates");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result = data as ExamImpactResult;
      setNotices(result.notices || []);
      setProfileSummary(result.profileSummary || "");
      setLastUpdated(result.lastUpdated || new Date().toISOString());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch exam updates";
      setError(message);
      console.error("Error fetching exam updates:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUpdates = useCallback(() => {
    if (profile) {
      fetchExamUpdates(profile);
    }
  }, [profile, fetchExamUpdates]);

  const reset = useCallback(() => {
    setNotices([]);
    setProfileSummary("");
    setLastUpdated("");
    setError(null);
    setProfile(null);
  }, []);

  return {
    notices,
    profileSummary,
    lastUpdated,
    isLoading,
    error,
    profile,
    fetchExamUpdates,
    refreshUpdates,
    reset,
  };
}
