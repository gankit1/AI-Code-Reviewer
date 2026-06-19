"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GitPullRequest,
  GitBranch,
  Clock,
  FileCode,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  BookOpen,
  Code2,
  Lightbulb,
  TestTube,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SEVERITY_CONFIG, CATEGORY_CONFIG } from "@/lib/constants";
import { useState } from "react";

// Mock review data
const mockReview = {
  _id: "1",
  repo: { name: "frontend-app", fullName: "acme/frontend-app" },
  pr: { title: "feat: Add user dashboard with analytics", number: 142, branch: "feature/user-dashboard", baseBranch: "main", author: "johndoe" },
  status: "completed" as const,
  score: 87,
  scores: { security: 92, performance: 85, maintainability: 88, readability: 83, overall: 87 },
  summary: "Overall solid implementation of the user dashboard feature. The code follows React best practices well with good component decomposition. Minor security concern with unvalidated user input in the search component, and a performance optimization opportunity with memoization in the chart component. TypeScript types are well-defined throughout.",
  filesAnalyzed: 12,
  totalFindings: 5,
  tokensUsed: 2847,
  processingTime: 12400,
  findings: [
    {
      id: "f1",
      severity: "high" as const,
      category: "security" as const,
      file: "src/components/SearchBar.tsx",
      line: 24,
      issue: "User input is not sanitized before being used in a dynamic query. This could allow XSS attacks if the search value is reflected in the DOM.",
      suggestion: "Use DOMPurify or a similar library to sanitize user input before using it in queries or rendering it in the DOM.",
      codeSnippet: 'const results = await fetch(`/api/search?q=${searchValue}`);',
      fixedCode: "const sanitized = DOMPurify.sanitize(searchValue);\nconst results = await fetch(`/api/search?q=${encodeURIComponent(sanitized)}`);",
    },
    {
      id: "f2",
      severity: "medium" as const,
      category: "performance" as const,
      file: "src/components/AnalyticsChart.tsx",
      line: 42,
      issue: "Expensive computation inside render without memoization. The chart data transformation runs on every render, even when the source data hasn't changed.",
      suggestion: "Wrap the data transformation in useMemo to prevent unnecessary recalculations.",
      codeSnippet: "const chartData = transformData(rawData, filters);",
      fixedCode: "const chartData = useMemo(\n  () => transformData(rawData, filters),\n  [rawData, filters]\n);",
    },
    {
      id: "f3",
      severity: "medium" as const,
      category: "best-practice" as const,
      file: "src/hooks/useDashboard.ts",
      line: 15,
      issue: "Missing error boundary for the async data fetching. If the API call fails, the component will show an unhandled error.",
      suggestion: "Add proper error handling with try/catch and expose error state from the hook.",
      codeSnippet: "const data = await fetchDashboardData();",
      fixedCode: "try {\n  const data = await fetchDashboardData();\n  setData(data);\n} catch (error) {\n  setError(error instanceof Error ? error.message : 'Failed to load');\n}",
    },
    {
      id: "f4",
      severity: "low" as const,
      category: "typescript" as const,
      file: "src/types/dashboard.ts",
      line: 8,
      issue: "Using 'any' type for the chart configuration object. This bypasses TypeScript's type checking.",
      suggestion: "Define a proper interface for the chart configuration.",
      codeSnippet: "chartConfig: any;",
      fixedCode: "chartConfig: ChartConfiguration;",
    },
    {
      id: "f5",
      severity: "low" as const,
      category: "style" as const,
      file: "src/components/StatsCard.tsx",
      line: 31,
      issue: "Magic numbers used for animation timing. Consider extracting these into named constants for better readability.",
      suggestion: "Extract animation timing values into constants or a configuration object.",
      codeSnippet: "transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fixedCode: "const ANIMATION_CONFIG = {\n  duration: '0.3s',\n  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',\n};",
    },
  ],
};

function ScoreGauge({ label, score, size = "sm" }: { label: string; score: number; size?: "sm" | "lg" }) {
  const r = size === "lg" ? 54 : 32;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const viewBox = size === "lg" ? "0 0 120 120" : "0 0 72 72";
  const cx = size === "lg" ? 60 : 36;
  const sw = size === "lg" ? 7 : 5;
  const dim = size === "lg" ? "h-[120px] w-[120px]" : "h-[72px] w-[72px]";

  const color =
    score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : score >= 50 ? "text-orange-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("relative", dim)}>
        <svg className={cn(dim, "-rotate-90")} viewBox={viewBox}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-muted/20" />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="currentColor" strokeWidth={sw} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className={cn(color, "score-circle")} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", size === "lg" ? "text-2xl" : "text-sm")}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function FindingCard({ finding, index }: { finding: typeof mockReview.findings[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const severity = SEVERITY_CONFIG[finding.severity as keyof typeof SEVERITY_CONFIG];
  const category = CATEGORY_CONFIG[finding.category as keyof typeof CATEGORY_CONFIG];

  return (
    <div className={cn("rounded-lg border overflow-hidden transition-all", severity.border, expanded && "shadow-sm")}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn("w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors", severity.bg)}
      >
        <div className={cn("h-2 w-2 rounded-full shrink-0", severity.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", severity.bg, severity.color, severity.border)}>
              {severity.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {category?.icon} {category?.label}
            </Badge>
          </div>
          <p className="text-sm font-medium mt-1 truncate">{finding.issue}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {finding.file}
            {finding.line && `:${finding.line}`}
          </p>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      </button>

      {expanded && (
        <div className="p-4 border-t space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{finding.issue}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              💡 Suggestion
            </p>
            <p className="text-sm">{finding.suggestion}</p>
          </div>

          {finding.codeSnippet && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Before</p>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-mono">{finding.codeSnippet}</code>
              </pre>
            </div>
          )}

          {finding.fixedCode && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">After</p>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-green-500/5 border border-green-500/10 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-mono">{finding.fixedCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const review = mockReview;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/reviews">
          <Button variant="ghost" size="icon" className="shrink-0 mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{review.pr.title}</h1>
            <Badge variant="outline" className="text-xs">#{review.pr.number}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <GitPullRequest className="h-4 w-4" />
              {review.repo.fullName}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {review.pr.branch} → {review.pr.baseBranch}
            </span>
            <span className="flex items-center gap-1">
              <FileCode className="h-4 w-4" />
              {review.filesAnalyzed} files analyzed
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {(review.processingTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* Scores */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <ScoreGauge label="Overall" score={review.scores.overall} size="lg" />
            <Separator orientation="vertical" className="h-20 hidden sm:block" />
            <ScoreGauge label="Security" score={review.scores.security} />
            <ScoreGauge label="Performance" score={review.scores.performance} />
            <ScoreGauge label="Maintainability" score={review.scores.maintainability} />
            <ScoreGauge label="Readability" score={review.scores.readability} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Findings ({review.totalFindings})
            </h2>
            <div className="flex items-center gap-1.5">
              {review.findings.filter(f => f.severity === 'high').length > 0 && (
                <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20">
                  {review.findings.filter(f => f.severity === 'high').length} High
                </Badge>
              )}
              {review.findings.filter(f => f.severity === 'medium').length > 0 && (
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                  {review.findings.filter(f => f.severity === 'medium').length} Medium
                </Badge>
              )}
              {review.findings.filter(f => f.severity === 'low').length > 0 && (
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {review.findings.filter(f => f.severity === 'low').length} Low
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3 stagger-children">
            {review.findings.map((finding, i) => (
              <FindingCard key={finding.id} finding={finding} index={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.summary}
              </p>
            </CardContent>
          </Card>

          {/* AI Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">AI Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-10 text-sm">
                <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                Explain Code
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 text-sm">
                <Code2 className="mr-2 h-4 w-4 text-blue-500" />
                Suggest Refactoring
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 text-sm">
                <TestTube className="mr-2 h-4 w-4 text-green-500" />
                Generate Tests
              </Button>
            </CardContent>
          </Card>

          {/* Review Meta */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Provider</span>
                <span className="font-medium">OpenAI GPT-4o</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tokens Used</span>
                <span className="font-medium">{review.tokensUsed.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time</span>
                <span className="font-medium">{(review.processingTime / 1000).toFixed(1)}s</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
