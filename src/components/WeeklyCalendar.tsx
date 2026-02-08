import { Calendar, Clock, BookOpen, RefreshCw, Lightbulb, ChevronLeft, ChevronRight, Download, Image } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { StudyPlan, Week, Session } from "@/hooks/useStudyPlanner";

interface WeeklyCalendarProps {
  plan: StudyPlan;
  onReset: () => void;
}

const SESSION_TYPE_STYLES: Record<string, string> = {
  study: "bg-primary/10 border-primary/30 text-primary",
  revision: "bg-accent/10 border-accent/30 text-accent",
  practice: "bg-secondary border-secondary-foreground/20 text-secondary-foreground",
};

const SESSION_TYPE_ICONS: Record<string, typeof BookOpen> = {
  study: BookOpen,
  revision: RefreshCw,
  practice: Calendar,
};

function SessionCard({ session }: { session: Session }) {
  const Icon = SESSION_TYPE_ICONS[session.type] || BookOpen;
  
  return (
    <div
      className={cn(
        "p-2 rounded-lg border text-xs",
        SESSION_TYPE_STYLES[session.type] || SESSION_TYPE_STYLES.study
      )}
    >
      <div className="flex items-start gap-1.5">
        <Icon className="w-3 h-3 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{session.subject}</p>
          <p className="text-[10px] opacity-80 truncate">{session.topic}</p>
          <p className="text-[10px] mt-1 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {session.duration}h
          </p>
        </div>
      </div>
    </div>
  );
}

function DayColumn({ day }: { day: { date: string; dayName: string; sessions: Session[]; totalHours: number } }) {
  const dateObj = new Date(day.date);
  const dayNum = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  
  return (
    <div className="flex-1 min-w-[120px] border-r border-border last:border-r-0">
      <div className="p-2 border-b border-border bg-muted/30 text-center">
        <p className="text-xs text-muted-foreground">{day.dayName}</p>
        <p className="font-semibold text-foreground">{dayNum} {month}</p>
        <p className="text-[10px] text-muted-foreground">{day.totalHours}h total</p>
      </div>
      <div className="p-2 space-y-2 min-h-[200px]">
        {day.sessions.map((session, idx) => (
          <SessionCard key={idx} session={session} />
        ))}
        {day.sessions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">Rest day</p>
        )}
      </div>
    </div>
  );
}

function WeekView({ week }: { week: Week }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="flex overflow-x-auto">
        {week.days.map((day, idx) => (
          <DayColumn key={idx} day={day} />
        ))}
      </div>
    </div>
  );
}

export function WeeklyCalendar({ plan, onReset }: WeeklyCalendarProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentWeek = plan.weeks[currentWeekIndex];
  const hasMultipleWeeks = plan.weeks.length > 1;

  const exportAsImage = async () => {
    if (!calendarRef.current) return;
    setIsExporting(true);
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `study-plan-week-${currentWeek.weekNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({ title: "Success", description: "Image downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export image", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!calendarRef.current) return;
    setIsExporting(true);
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`study-plan-week-${currentWeek.weekNumber}.pdf`);
      
      toast({ title: "Success", description: "PDF downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export PDF", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Your Study Plan
          </h3>
          <p className="text-sm text-muted-foreground">
            {plan.summary.totalStudyDays} study days • {plan.summary.revisionDays} revision days
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportAsImage} disabled={isExporting}>
            <Image className="w-4 h-4 mr-1" />
            Image
          </Button>
          <Button variant="outline" size="sm" onClick={exportAsPDF} disabled={isExporting}>
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-1" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      {hasMultipleWeeks && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
            disabled={currentWeekIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm font-medium text-foreground">
            Week {currentWeek.weekNumber} of {plan.weeks.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekIndex(i => Math.min(plan.weeks.length - 1, i + 1))}
            disabled={currentWeekIndex === plan.weeks.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Calendar - wrapped for export */}
      <div ref={calendarRef} className="bg-card rounded-xl">
        <WeekView week={currentWeek} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Hours */}
        <div className="p-4 rounded-xl border border-border bg-muted/30">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Hours by Subject
          </h4>
          <div className="space-y-2">
            {Object.entries(plan.summary.subjectHours).map(([subject, hours]) => (
              <div key={subject} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{subject}</span>
                <span className="font-medium text-foreground">{hours}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl border border-border bg-muted/30">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Study Tips
          </h4>
          <ul className="space-y-2">
            {plan.tips.slice(0, 4).map((tip, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary/20 border border-primary/30"></span>
          Study
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent/20 border border-accent/30"></span>
          Revision
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-secondary border border-secondary-foreground/20"></span>
          Practice
        </span>
      </div>
    </div>
  );
}
