import { ExternalLink, AlertTriangle, AlertCircle, Info, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExamNotice } from "@/hooks/useExamImpact";

interface NoticeCardProps {
  notice: ExamNotice;
}

const priorityConfig = {
  urgent: {
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-l-red-500",
    badgeVariant: "destructive" as const,
    label: "Urgent",
  },
  important: {
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-l-amber-500",
    badgeVariant: "default" as const,
    label: "Important",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-l-blue-500",
    badgeVariant: "secondary" as const,
    label: "Info",
  },
};

const categoryLabels: Record<string, string> = {
  syllabus: "Syllabus",
  schedule: "Schedule",
  pattern: "Pattern Change",
  eligibility: "Eligibility",
  result: "Results",
  general: "General",
};

export function NoticeCard({ notice }: NoticeCardProps) {
  const config = priorityConfig[notice.priority];
  const PriorityIcon = config.icon;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover:shadow-md",
        config.borderColor
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
              <PriorityIcon className={cn("w-4 h-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight mb-1">
                {notice.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{notice.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(notice.date)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant={config.badgeVariant} className="text-xs">
              {config.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {categoryLabels[notice.category] || notice.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <p className="text-sm text-muted-foreground">{notice.summary}</p>

        {/* Impact Analysis */}
        <div className={cn("p-3 rounded-lg", config.bgColor)}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Impact on You
            </span>
            <Badge variant="outline" className="text-xs">
              Score: {notice.impactScore}/10
            </Badge>
          </div>
          <p className="text-sm">{notice.impactAnalysis}</p>
        </div>

        {/* Affected Subjects */}
        {notice.affectedSubjects.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground mr-1">
              Affects:
            </span>
            {notice.affectedSubjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Items */}
        {notice.actionItems.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Action Items
            </span>
            <ul className="space-y-1">
              {notice.actionItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <ArrowRight className="w-3 h-3 mt-1 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Source Link */}
        {notice.sourceUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            asChild
          >
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              View Official Notice
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
