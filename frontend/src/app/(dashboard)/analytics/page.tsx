"use client";

import {
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Bug,
  Sparkles,
  Paintbrush,
  FileCode,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jul", reviews: 42 },
  { month: "Aug", reviews: 58 },
  { month: "Sep", reviews: 73 },
  { month: "Oct", reviews: 89 },
  { month: "Nov", reviews: 112 },
  { month: "Dec", reviews: 98 },
  { month: "Jan", reviews: 134 },
];

const issueTrends = [
  { label: "Critical", count: 12, change: -23, color: "bg-red-500" },
  { label: "High", count: 45, change: -8, color: "bg-orange-500" },
  { label: "Medium", count: 89, change: +5, color: "bg-amber-500" },
  { label: "Low", count: 134, change: +12, color: "bg-blue-500" },
];

const repoHealth = [
  { name: "design-system", score: 95, language: "TypeScript", reviews: 34 },
  { name: "api-gateway", score: 92, language: "TypeScript", reviews: 89 },
  { name: "frontend-app", score: 87, language: "TypeScript", reviews: 142 },
  { name: "mobile-app", score: 84, language: "TypeScript", reviews: 98 },
  { name: "auth-service", score: 78, language: "Go", reviews: 56 },
  { name: "data-pipeline", score: 65, language: "Python", reviews: 23 },
];

const issueCategories = [
  { category: "Bug", icon: Bug, count: 89, percentage: 25 },
  { category: "Security", icon: Shield, count: 67, percentage: 19 },
  { category: "Performance", icon: Zap, count: 54, percentage: 15 },
  { category: "Best Practice", icon: Sparkles, count: 98, percentage: 28 },
  { category: "Style", icon: Paintbrush, count: 23, percentage: 6 },
  { category: "TypeScript", icon: FileCode, count: 25, percentage: 7 },
];

export default function AnalyticsPage() {
  const maxReviews = Math.max(...monthlyData.map((d) => d.reviews));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights into your code review activity and trends
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Reviews Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Monthly Reviews
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Last 7 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-56 mt-4">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-bold">{d.reviews}</span>
                  <div
                    className="w-full rounded-t-lg animated-gradient transition-all duration-700 relative group"
                    style={{ height: `${(d.reviews / maxReviews) * 180}px` }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-t-lg transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issue Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Issue Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {issueTrends.map((issue) => (
              <div key={issue.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", issue.color)} />
                    <span className="text-sm font-medium">{issue.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{issue.count}</span>
                    <span
                      className={cn(
                        "text-xs",
                        issue.change < 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {issue.change > 0 ? "+" : ""}
                      {issue.change}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={(issue.count / 150) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Issue Categories */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Issues by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {issueCategories.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <cat.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-xs text-muted-foreground">{cat.count} issues</span>
                  </div>
                  <Progress value={cat.percentage} className="h-1.5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground w-8 text-right">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Repository Health */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Repository Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 pt-2">
            {repoHealth.map((repo, index) => {
              const color =
                repo.score >= 90
                  ? "bg-green-500"
                  : repo.score >= 70
                  ? "bg-yellow-500"
                  : repo.score >= 50
                  ? "bg-orange-500"
                  : "bg-red-500";

              return (
                <div
                  key={repo.name}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{repo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {repo.language} · {repo.reviews} reviews
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-48">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", color)}
                        style={{ width: `${repo.score}%` }}
                      />
                    </div>
                    <span className={cn("text-sm font-bold w-10 text-right", 
                      repo.score >= 90 ? "text-green-500" :
                      repo.score >= 70 ? "text-yellow-500" :
                      "text-orange-500"
                    )}>
                      {repo.score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
