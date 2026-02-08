import { StudyPlannerForm } from "@/components/StudyPlannerForm";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useStudyPlanner } from "@/hooks/useStudyPlanner";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Calendar, Sparkles } from "lucide-react";

export function StudyPlanner() {
  const { plan, isLoading, error, generatePlan, reset } = useStudyPlanner();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-8">
      {/* Form or Result */}
      {!plan && !isLoading && (
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Create Your Study Plan
            </h3>
          </div>
          <StudyPlannerForm onSubmit={generatePlan} isLoading={isLoading} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/30">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <h3 className="font-display font-semibold text-foreground">
              Generating Your Study Plan...
            </h3>
          </div>
          <div className="p-6">
            <TypingIndicator />
            <p className="text-sm text-muted-foreground text-center mt-4">
              AI is creating a personalized schedule based on your subjects and available time
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {plan && !isLoading && (
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 animate-fade-in">
          <WeeklyCalendar plan={plan} onReset={reset} />
        </div>
      )}
    </div>
  );
}
