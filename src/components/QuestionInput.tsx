import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function QuestionInput({ onSubmit, disabled, placeholder }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setQuestion("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || "Enter your question here... (Press Enter to submit)"}
        rows={3}
        className={cn(
          "w-full px-4 py-4 pr-14 rounded-xl border border-input bg-card text-foreground",
          "placeholder:text-muted-foreground resize-none",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-all duration-200",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !question.trim()}
        className={cn(
          "absolute right-3 bottom-3 p-2.5 rounded-lg",
          "gradient-primary text-primary-foreground",
          "transition-all duration-200",
          "hover:shadow-glow hover:scale-105",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
