import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExamProfileForm } from "@/components/ExamProfileForm";
import { ExamImpactDashboard } from "@/components/ExamImpactDashboard";
import { useExamImpact } from "@/hooks/useExamImpact";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function ExamImpact() {
  const {
    notices,
    profileSummary,
    lastUpdated,
    isLoading,
    error,
    profile,
    fetchExamUpdates,
    refreshUpdates,
    reset,
  } = useExamImpact();
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
    <div className="min-h-screen bg-background gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 gradient-primary rounded-xl shadow-soft">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Exam Buddy AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  My Exam Impact
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        {!profile && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-4">
              <Newspaper className="w-4 h-4" />
              Personalized News Engine
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              My Exam Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Get exam-specific news filtered and analyzed for your profile.
              Never miss an important update again.
            </p>
          </div>
        )}

        {/* Content */}
        {!profile ? (
          <div className="animate-slide-up">
            <ExamProfileForm onSubmit={fetchExamUpdates} isLoading={isLoading} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <ExamImpactDashboard
              notices={notices}
              profileSummary={profileSummary}
              lastUpdated={lastUpdated}
              profile={profile}
              isLoading={isLoading}
              onRefresh={refreshUpdates}
              onReset={reset}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Stay updated with personalized exam news and notifications 📰
          </p>
        </div>
      </footer>
    </div>
  );
}
