"use client";

import Link from "next/link";
import {
  FileSearch,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  GitPullRequest,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SEVERITY_CONFIG } from "@/lib/constants";

const mockReviews = [
  {
    _id: "1",
    repo: "frontend-app",
    pr: "feat: Add user dashboard",
    prNumber: 142,
    status: "completed",
    score: 87,
    totalFindings: 3,
    criticalCount: 0,
    highCount: 1,
    mediumCount: 1,
    lowCount: 1,
    filesAnalyzed: 12,
    tokensUsed: 2847,
    processingTime: 12400,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    repo: "api-gateway",
    pr: "fix: Rate limiting middleware",
    prNumber: 89,
    status: "completed",
    score: 94,
    totalFindings: 1,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 1,
    filesAnalyzed: 3,
    tokensUsed: 1245,
    processingTime: 8200,
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    _id: "3",
    repo: "auth-service",
    pr: "chore: Update dependencies",
    prNumber: 56,
    status: "completed",
    score: 72,
    totalFindings: 5,
    criticalCount: 1,
    highCount: 2,
    mediumCount: 1,
    lowCount: 1,
    filesAnalyzed: 8,
    tokensUsed: 3456,
    processingTime: 18700,
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    _id: "4",
    repo: "data-pipeline",
    pr: "feat: Add batch processing",
    prNumber: 23,
    status: "analyzing",
    score: 0,
    totalFindings: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    filesAnalyzed: 0,
    tokensUsed: 0,
    processingTime: 0,
    createdAt: "2024-01-11T11:45:00Z",
  },
];

function ReviewScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : score >= 70
      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      : score >= 50
      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
      : "bg-red-500/10 text-red-500 border-red-500/20";

  return (
    <Badge variant="outline" className={cn("text-sm font-bold px-3", color)}>
      {score}/100
    </Badge>
  );
}

export default function ReviewsPage() {
  const [search, setSearch] = useState("");

  const filteredReviews = mockReviews.filter(
    (r) =>
      r.pr.toLowerCase().includes(search.toLowerCase()) ||
      r.repo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1">
          Browse your AI code review history
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: "847", icon: FileSearch, color: "text-primary" },
          { label: "Avg Score", value: "84/100", icon: CheckCircle, color: "text-green-500" },
          { label: "Issues Found", value: "2,341", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Avg Time", value: "12s", icon: Clock, color: "text-blue-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl bg-accent flex items-center justify-center")}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="space-y-3 stagger-children">
        {filteredReviews.map((review) => (
          <Link href={`/reviews/${review._id}`} key={review._id}>
            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold truncate">
                        {review.pr}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        #{review.prNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GitPullRequest className="h-3 w-3" />
                        {review.repo}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileSearch className="h-3 w-3" />
                        {review.filesAnalyzed} files
                      </span>
                      {review.totalFindings > 0 && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {review.totalFindings} findings
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {review.status === "completed" && (
                      <>
                        {/* Severity counts */}
                        <div className="hidden sm:flex items-center gap-1.5">
                          {review.criticalCount > 0 && (
                            <Badge variant="outline" className={cn("text-xs", SEVERITY_CONFIG.critical.bg, SEVERITY_CONFIG.critical.color, SEVERITY_CONFIG.critical.border)}>
                              {review.criticalCount}
                            </Badge>
                          )}
                          {review.highCount > 0 && (
                            <Badge variant="outline" className={cn("text-xs", SEVERITY_CONFIG.high.bg, SEVERITY_CONFIG.high.color, SEVERITY_CONFIG.high.border)}>
                              {review.highCount}
                            </Badge>
                          )}
                          {review.mediumCount > 0 && (
                            <Badge variant="outline" className={cn("text-xs", SEVERITY_CONFIG.medium.bg, SEVERITY_CONFIG.medium.color, SEVERITY_CONFIG.medium.border)}>
                              {review.mediumCount}
                            </Badge>
                          )}
                        </div>
                        <ReviewScoreBadge score={review.score} />
                      </>
                    )}

                    {review.status === "analyzing" && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        Analyzing
                      </Badge>
                    )}

                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
