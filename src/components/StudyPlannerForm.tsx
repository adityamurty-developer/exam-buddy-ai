import { useState } from "react";
import { Plus, Trash2, Calendar, Clock, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Subject, PlannerInput } from "@/hooks/useStudyPlanner";

interface StudyPlannerFormProps {
  onSubmit: (input: PlannerInput) => void;
  isLoading: boolean;
}

export function StudyPlannerForm({ onSubmit, isLoading }: StudyPlannerFormProps) {
  const [examName, setExamName] = useState("");
  const [daysLeft, setDaysLeft] = useState<number>(14);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", topics: [] },
  ]);
  const [topicInputs, setTopicInputs] = useState<Record<string, string>>({});

  const addSubject = () => {
    const newId = Date.now().toString();
    setSubjects([...subjects, { id: newId, name: "", topics: [] }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
      const newTopicInputs = { ...topicInputs };
      delete newTopicInputs[id];
      setTopicInputs(newTopicInputs);
    }
  };

  const updateSubjectName = (id: string, name: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, name } : s));
  };

  const addTopic = (subjectId: string) => {
    const topic = topicInputs[subjectId]?.trim();
    if (topic) {
      setSubjects(subjects.map(s => 
        s.id === subjectId 
          ? { ...s, topics: [...s.topics, topic] }
          : s
      ));
      setTopicInputs({ ...topicInputs, [subjectId]: "" });
    }
  };

  const removeTopic = (subjectId: string, topicIndex: number) => {
    setSubjects(subjects.map(s => 
      s.id === subjectId 
        ? { ...s, topics: s.topics.filter((_, i) => i !== topicIndex) }
        : s
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSubjects = subjects.filter(s => s.name.trim());
    if (!examName.trim() || validSubjects.length === 0) return;

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];

    onSubmit({
      examName: examName.trim(),
      subjects: validSubjects,
      daysLeft,
      dailyHours,
      startDate,
    });
  };

  const isValid = examName.trim() && subjects.some(s => s.name.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Exam Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <GraduationCap className="w-4 h-4 text-primary" />
          Exam Name
        </label>
        <Input
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="e.g., Final Semester Exams, JEE Main, GATE..."
          disabled={isLoading}
        />
      </div>

      {/* Days and Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Days Left
          </label>
          <Input
            type="number"
            min={1}
            max={365}
            value={daysLeft}
            onChange={(e) => setDaysLeft(parseInt(e.target.value) || 1)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            Daily Study Hours
          </label>
          <Input
            type="number"
            min={1}
            max={16}
            value={dailyHours}
            onChange={(e) => setDailyHours(parseInt(e.target.value) || 1)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Subjects */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <BookOpen className="w-4 h-4 text-primary" />
          Subjects & Topics
        </label>

        {subjects.map((subject, idx) => (
          <div
            key={subject.id}
            className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
          >
            <div className="flex gap-2">
              <Input
                value={subject.name}
                onChange={(e) => updateSubjectName(subject.id, e.target.value)}
                placeholder={`Subject ${idx + 1} (e.g., Physics, Data Structures...)`}
                disabled={isLoading}
                className="flex-1"
              />
              {subjects.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(subject.id)}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Topics */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {subject.topics.map((topic, topicIdx) => (
                  <span
                    key={topicIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(subject.id, topicIdx)}
                      className="hover:text-destructive transition-colors"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={topicInputs[subject.id] || ""}
                  onChange={(e) => setTopicInputs({ ...topicInputs, [subject.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTopic(subject.id);
                    }
                  }}
                  placeholder="Add topic (press Enter)"
                  disabled={isLoading}
                  className="flex-1 text-sm h-9"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addTopic(subject.id)}
                  disabled={isLoading || !topicInputs[subject.id]?.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: Add specific topics/chapters to focus on
              </p>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addSubject}
          disabled={isLoading}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Subject
        </Button>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !isValid}
        className={cn(
          "w-full gradient-primary text-primary-foreground",
          "hover:shadow-glow transition-all duration-200"
        )}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Generating Plan...
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 mr-2" />
            Generate Study Plan
          </>
        )}
      </Button>
    </form>
  );
}
