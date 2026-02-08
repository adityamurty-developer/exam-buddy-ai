import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, GraduationCap, RefreshCw, Lightbulb, FileText, PenTool, Calendar, Newspaper, Users, Copy, Check, StickyNote } from "lucide-react";
import { QuestionInput } from "@/components/QuestionInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SubjectBadge } from "@/components/SubjectBadge";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { TypingIndicator } from "@/components/TypingIndicator";
import { StudyPlanner } from "@/components/StudyPlanner";
import { useExamBuddy } from "@/hooks/useExamBuddy";
import { useShortNotes } from "@/hooks/useShortNotes";
import { ShortNotesModal } from "@/components/ShortNotesModal";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXAMPLE_QUESTIONS = [
  "Explain Newton's laws of motion with examples",
  "What is normalization in DBMS? Explain up to 3NF",
  "Explain the difference between stack and queue",
  "Describe the process of photosynthesis",
];

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Step-by-Step Explanations",
    description: "Get clear, structured explanations for any concept across all subjects."
  },
  {
    icon: FileText,
    title: "Exam-Oriented Answers",
    description: "Answers formatted exactly how examiners expect - with proper headings and points."
  },
  {
    icon: PenTool,
    title: "Diagram Support",
    description: "ASCII diagrams and visual representations to help you understand better."
  },
  {
    icon: GraduationCap,
    title: "Multi-Subject Support",
    description: "Works across Physics, Chemistry, Maths, Computer Science, Biology & more."
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("ask");
  const [copied, setCopied] = useState(false);
  const [shortNotesOpen, setShortNotesOpen] = useState(false);
  const { answer, subject, isLoading, error, askQuestion, reset } = useExamBuddy();
  const shortNotes = useShortNotes();
  const { toast } = useToast();

  const handleSubmit = (question: string) => {
    askQuestion(question, "exam");
  };

  const handleExampleClick = (question: string) => {
    askQuestion(question, "exam");
  };

  const handleReset = () => {
    reset();
    setCopied(false);
    shortNotes.reset();
  };

  const handleShortNotes = () => {
    setShortNotesOpen(true);
    shortNotes.generate(answer, subject);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      toast({ title: "Copied!", description: "Answer copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

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
                  Your smart exam preparation partner
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/news">
                  <Newspaper className="w-4 h-4 mr-2" />
                  My Exam Impact
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/about">
                  <Users className="w-4 h-4 mr-2" />
                  About Us
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="ask" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Ask Question
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Study Planner
            </TabsTrigger>
          </TabsList>

          {/* Ask Question Tab */}
          <TabsContent value="ask" className="mt-0">
            {/* Hero Section - Only show when no answer */}
            {!answer && !isLoading && (
              <div className="text-center mb-10 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Powered by Gemini 3 Pro
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Write Perfect Exam Answers
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
                  Get structured, marks-oriented answers for any subject - Physics, Chemistry, Maths, Computer Science, and more.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  {FEATURES.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border text-left"
                    >
                      <div className="p-2 bg-secondary rounded-lg shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Input Card */}
            <div className="bg-card rounded-2xl shadow-card border border-border p-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Ask Your Question
                </h3>
                {subject && (
                  <SubjectBadge subject={subject} className="ml-auto" />
                )}
              </div>
              <QuestionInput
                onSubmit={handleSubmit}
                disabled={isLoading}
                placeholder="e.g., Explain binary search tree with insertion and deletion operations..."
              />
              
              {/* Example Questions */}
              {!answer && !isLoading && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleExampleClick(q)}
                        className="text-xs px-3 py-1.5 bg-muted hover:bg-secondary text-muted-foreground hover:text-secondary-foreground rounded-full transition-colors"
                      >
                        {q.length > 45 ? q.slice(0, 45) + "..." : q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Section */}
            {(isLoading || answer) && (
              <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-fade-in">
                {/* Answer Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="font-display font-semibold text-foreground">
                      Exam Answer
                    </h3>
                  </div>
                  {!isLoading && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={handleShortNotes}
                        disabled={shortNotes.isGenerating}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <StickyNote className="w-4 h-4" />
                        Short Notes
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        New Question
                      </button>
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <div className="p-6">
                  {isLoading && !answer && <TypingIndicator />}
                  <AnswerDisplay content={answer} isStreaming={isLoading} />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Study Planner Tab */}
          <TabsContent value="planner" className="mt-0">
            {/* Hero for Planner */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-4">
                <Calendar className="w-4 h-4" />
                AI-Powered Planning
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Smart Study Planner
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Enter your exam details and let AI create a personalized day-by-day study schedule.
              </p>
            </div>

            <StudyPlanner />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Works for all subjects: Physics, Chemistry, Maths, Computer Science, Biology & more 🎓
          </p>
        </div>
      </footer>

      {/* Short Notes Modal */}
      <ShortNotesModal
        open={shortNotesOpen}
        onClose={() => setShortNotesOpen(false)}
        imageUrl={shortNotes.imageUrl}
        isGenerating={shortNotes.isGenerating}
        error={shortNotes.error}
      />
    </div>
  );
}
