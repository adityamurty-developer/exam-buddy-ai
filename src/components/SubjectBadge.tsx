import { cn } from "@/lib/utils";

interface SubjectBadgeProps {
  subject: string;
  className?: string;
}

const subjectConfig: Record<string, { badge: string; icon: string }> = {
  "Data Structures": { badge: "badge-ds", icon: "🌳" },
  "C/C++": { badge: "badge-cpp", icon: "💻" },
  "DBMS": { badge: "badge-dbms", icon: "🗃️" },
  "Operating Systems": { badge: "badge-os", icon: "⚙️" },
  "Discrete Mathematics": { badge: "badge-maths", icon: "📐" },
  "Physics": { badge: "badge-physics", icon: "⚛️" },
  "Chemistry": { badge: "badge-chemistry", icon: "🧪" },
  "Mathematics": { badge: "badge-maths", icon: "📊" },
  "Biology": { badge: "badge-biology", icon: "🧬" },
  "Computer Networks": { badge: "badge-networks", icon: "🌐" },
  "General": { badge: "bg-muted text-muted-foreground border-border", icon: "📚" },
};

export function SubjectBadge({ subject, className }: SubjectBadgeProps) {
  const config = subjectConfig[subject] || subjectConfig["General"];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-all",
        config.badge,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{subject}</span>
    </span>
  );
}
