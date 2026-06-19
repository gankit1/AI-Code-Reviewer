"use client";

import {
  GitFork,
  FileSearch,
  Shield,
  Zap,
  Cpu,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data for initial render (will be replaced by API calls)
const statsCards = [
  {
    title: "Repositories",
    value: "12",
    change: "+3 this month",
    trend: "up",
    icon: GitFork,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Total Reviews",
    value: "847",
    change: "+24 this week",
    trend: "up",
    icon: FileSearch,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    title: "Security Issues",
    value: "23",
    change: "-12% vs last month",
    trend: "down",
    icon: Shield,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    title: "Performance Issues",
    value: "41",
    change: "-8% vs last month",
    trend: "down",
    icon: Zap,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "AI Tokens Used",
    value: "32.4K",
    change: "of 50K limit",
    trend: "neutral",
    icon: Cpu,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

const recentReviews = [
  {
    id: "1",
    repo: "frontend-app",
    pr: "feat: Add user dashboard",
    prNumber: 142,
    score: 87,
    findings: 3,
    severity: "medium",
    time: "2 min ago",
  },
  {
    id: "2",
    repo: "api-gateway",
    pr: "fix: Rate limiting middleware",
    prNumber: 89,
    score: 94,
    findings: 1,
    severity: "low",
    time: "15 min ago",
  },
  {
    id: "3",
    repo: "auth-service",
    pr: "chore: Update dependencies",
    prNumber: 56,
    score: 72,
    findings: 5,
    severity: "high",
    time: "1 hour ago",
  },
  {
    id: "4",
    repo: "frontend-app",
    pr: "refactor: Extract hook logic",
    prNumber: 141,
    score: 91,
    findings: 2,
    severity: "low",
    time: "3 hours ago",
  },
  {
    id: "5",
    repo: "data-pipeline",
    pr: "feat: Add batch processing",
    prNumber: 23,
    score: 65,
    findings: 8,
    severity: "critical",
    time: "5 hours ago",
  },
];

const weeklyData = [
  { day: "Mon", reviews: 12, issues: 34 },
  { day: "Tue", reviews: 18, issues: 28 },
  { day: "Wed", reviews: 15, issues: 41 },
  { day: "Thu", reviews: 22, issues: 25 },
  { day: "Fri", reviews: 20, issues: 30 },
  { day: "Sat", reviews: 8, issues: 12 },
  { day: "Sun", reviews: 5, issues: 8 },
];

function ScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90
      ? "text-green-500"
      : score >= 70
      ? "text-yellow-500"
      : score >= 50
      ? "text-orange-500"
      : "text-red-500";

  return (
    <div className="relative h-10 w-10">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-muted/30"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(color, "score-circle")}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
        {score}
      </span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { label: string; className: string }> = {
    critical: {
      label: "Critical",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    high: {
      label: "High",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    medium: {
      label: "Medium",
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    low: {
      label: "Low",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
  };

  const { label, className } = config[severity] || config.low;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", className)}>
      {label}
    </Badge>
  );
}

export default function DashboardPage() {
  const maxReviews = Math.max(...weeklyData.map((d) => d.reviews));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your code review activity
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 stagger-children">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="hover-lift border bg-card"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                {stat.trend === "up" && (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                )}
                {stat.trend === "down" && (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-2">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Review Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Review Activity
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                This Week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48 mt-4">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-xs font-medium">{d.reviews}</span>
                    <div
                      className="w-full rounded-t-md animated-gradient transition-all duration-500"
                      style={{
                        height: `${(d.reviews / maxReviews) * 140}px`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Token Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              AI Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center pt-4">
              <div className="relative inline-flex">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={314}
                    strokeDashoffset={314 * 0.35}
                    strokeLinecap="round"
                    className="score-circle"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.55 0.24 264)" />
                      <stop offset="100%" stopColor="oklch(0.65 0.18 300)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">65%</span>
                  <span className="text-[10px] text-muted-foreground">used</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tokens Used</span>
                <span className="font-medium">32,400</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Limit</span>
                <span className="font-medium">50,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Recent Reviews
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {recentReviews.length} reviews
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <ScoreCircle score={review.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {review.pr}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      #{review.prNumber}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {review.repo}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <SeverityBadge severity={review.severity} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {review.findings} issues
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {review.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
