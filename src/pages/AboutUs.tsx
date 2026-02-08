import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, Rocket, Users, Code, Palette, Brain, ClipboardCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const TEAM_MEMBERS = [
  {
    name: "R Aditya Murty",
    role: "Idea Management & Frontend",
    icon: Rocket,
    description: "Conceptualized the product vision and shaped the user-facing experience.",
  },
  {
    name: "Piyush Mishra",
    role: "Frontend & UI",
    icon: Palette,
    description: "Crafted the interface design and ensured a polished, responsive layout.",
  },
  {
    name: "Samyak Agrawal",
    role: "AI Integration",
    icon: Brain,
    description: "Engineered the AI pipeline powering exam answers and smart study plans.",
  },
  {
    name: "Piyush Dwivedi",
    role: "Project Management & Testing",
    icon: ClipboardCheck,
    description: "Coordinated development milestones and ensured quality at every stage.",
  },
];

export default function AboutUs() {
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
                  About Our Team
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to App
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Meet the Team
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            The Minds Behind Exam Buddy AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            A passionate team of builders turning exam prep into a smarter, stress-free experience.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 animate-slide-up">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 gradient-primary rounded-xl shrink-0">
                  <member.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Future Vision */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Our Vision
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Where We're Headed
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We envision Exam Buddy AI as the go-to companion for every student — democratizing access to structured, high-quality exam preparation regardless of background or resources. Our goal is to harness AI to reduce exam anxiety, personalize learning at scale, and empower millions of students to perform at their very best.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with ❤️ by Team Exam Buddy AI 🎓
          </p>
        </div>
      </footer>
    </div>
  );
}
