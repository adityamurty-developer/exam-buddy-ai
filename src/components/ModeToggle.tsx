import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "exam" | "simple";
  onChange: (mode: "exam" | "simple") => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("exam")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          mode === "exam"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        📝 Exam Answer
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("simple")}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          mode === "simple"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        💡 Simple Explanation
      </button>
    </div>
  );
}
