import { useState } from "react";
import { RefreshCw, Filter, AlertTriangle, AlertCircle, Info, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeCard } from "./NoticeCard";
import type { ExamNotice, ExamProfile } from "@/hooks/useExamImpact";

interface ExamImpactDashboardProps {
  notices: ExamNotice[];
  profileSummary: string;
  lastUpdated: string;
  profile: ExamProfile;
  isLoading: boolean;
  onRefresh: () => void;
  onReset: () => void;
}

type PriorityFilter = "all" | "urgent" | "important" | "info";

export function ExamImpactDashboard({
  notices,
  profileSummary,
  lastUpdated,
  profile,
  isLoading,
  onRefresh,
  onReset,
}: ExamImpactDashboardProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const filteredNotices =
    priorityFilter === "all"
      ? notices
      : notices.filter((n) => n.priority === priorityFilter);

  const urgentCount = notices.filter((n) => n.priority === "urgent").length;
  const importantCount = notices.filter((n) => n.priority === "important").length;
  const infoCount = notices.filter((n) => n.priority === "info").length;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-sm">
                  {profile.examName}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {profile.attemptYear}
                </Badge>
                {profile.state && (
                  <Badge variant="secondary" className="text-sm">
                    {profile.state}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{profileSummary}</p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {formatDate(lastUpdated)}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={onReset}>
                Change Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            priorityFilter === "urgent"
              ? "ring-2 ring-red-500"
              : "hover:border-red-500/50"
          }`}
          onClick={() =>
            setPriorityFilter(priorityFilter === "urgent" ? "all" : "urgent")
          }
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            priorityFilter === "important"
              ? "ring-2 ring-amber-500"
              : "hover:border-amber-500/50"
          }`}
          onClick={() =>
            setPriorityFilter(
              priorityFilter === "important" ? "all" : "important"
            )
          }
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{importantCount}</p>
                <p className="text-xs text-muted-foreground">Important</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            priorityFilter === "info"
              ? "ring-2 ring-blue-500"
              : "hover:border-blue-500/50"
          }`}
          onClick={() =>
            setPriorityFilter(priorityFilter === "info" ? "all" : "info")
          }
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{infoCount}</p>
                <p className="text-xs text-muted-foreground">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter indicator */}
      {priorityFilter !== "all" && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {priorityFilter} notices only
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setPriorityFilter("all")}
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Notices */}
      {filteredNotices.length > 0 ? (
        <div className="space-y-4">
          {filteredNotices
            .sort((a, b) => {
              const priorityOrder = { urgent: 0, important: 1, info: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
        </div>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="py-12 text-center">
            <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No {priorityFilter !== "all" ? priorityFilter : ""} notices found
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
