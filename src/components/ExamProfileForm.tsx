import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search, GraduationCap } from "lucide-react";
import type { ExamProfile } from "@/hooks/useExamImpact";

interface ExamProfileFormProps {
  onSubmit: (profile: ExamProfile) => void;
  isLoading: boolean;
}

const EXAM_OPTIONS = [
  "JEE Main",
  "JEE Advanced",
  "NEET",
  "CBSE Board",
  "ICSE Board",
  "State Board",
  "UPSC",
  "SSC",
  "Banking Exams",
  "CAT",
  "GATE",
  "University Exam",
  "Other",
];

const STATE_OPTIONS = [
  "All India",
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => String(CURRENT_YEAR + i));

export function ExamProfileForm({ onSubmit, isLoading }: ExamProfileFormProps) {
  const [examName, setExamName] = useState("");
  const [customExam, setCustomExam] = useState("");
  const [attemptYear, setAttemptYear] = useState(String(CURRENT_YEAR));
  const [state, setState] = useState("");
  const [board, setBoard] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalExamName = examName === "Other" ? customExam : examName;
    if (!finalExamName) return;

    onSubmit({
      examName: finalExamName,
      attemptYear,
      state: state || "All India",
      board: board || "General",
      subjects,
    });
  };

  const isValid = (examName && examName !== "Other") || (examName === "Other" && customExam.trim());

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Set Your Exam Profile</CardTitle>
            <CardDescription>
              Enter your exam details to get personalized news and updates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Name */}
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Select value={examName} onValueChange={setExamName}>
                <SelectTrigger id="examName">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_OPTIONS.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {examName === "Other" && (
                <Input
                  placeholder="Enter exam name"
                  value={customExam}
                  onChange={(e) => setCustomExam(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Attempt Year */}
            <div className="space-y-2">
              <Label htmlFor="attemptYear">Attempt Year</Label>
              <Select value={attemptYear} onValueChange={setAttemptYear}>
                <SelectTrigger id="attemptYear">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State / Region</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Board */}
            <div className="space-y-2">
              <Label htmlFor="board">Board / University</Label>
              <Input
                id="board"
                placeholder="e.g., CBSE, State Board, IIT Delhi"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <Label>Subjects / Papers (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subject (e.g., Physics, Mathematics)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddSubject}
                disabled={!newSubject.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Scanning for Updates...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Get Personalized Updates
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
