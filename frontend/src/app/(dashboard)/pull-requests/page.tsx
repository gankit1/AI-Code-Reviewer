"use client";

import Link from "next/link";
import {
  GitPullRequest,
  Search,
  GitBranch,
  Clock,
  FileCode,
  Plus,
  Minus,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockPRs = [
  {
    _id: "1",
    title: "feat: Add user dashboard with analytics",
    githubPrNumber: 142,
    repo: "frontend-app",
    branch: "feature/user-dashboard",
    baseBranch: "main",
    author: "johndoe",
    authorAvatar: "",
    status: "open",
    reviewStatus: "completed",
    filesChanged: 12,
    additions: 847,
    deletions: 123,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "fix: Rate limiting middleware regression",
    githubPrNumber: 89,
    repo: "api-gateway",
    branch: "fix/rate-limit",
    baseBranch: "main",
    author: "janedoe",
    authorAvatar: "",
    status: "open",
    reviewStatus: "in_progress",
    filesChanged: 3,
    additions: 45,
    deletions: 12,
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    _id: "3",
    title: "chore: Update dependencies and security patches",
    githubPrNumber: 56,
    repo: "auth-service",
    branch: "chore/deps-update",
    baseBranch: "develop",
    author: "devops-bot",
    authorAvatar: "",
    status: "open",
    reviewStatus: "pending",
    filesChanged: 2,
    additions: 156,
    deletions: 148,
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    _id: "4",
    title: "refactor: Extract shared hook logic into custom hooks",
    githubPrNumber: 141,
    repo: "frontend-app",
    branch: "refactor/hooks",
    baseBranch: "main",
    author: "johndoe",
    authorAvatar: "",
    status: "merged",
    reviewStatus: "completed",
    filesChanged: 8,
    additions: 234,
    deletions: 189,
    createdAt: "2024-01-12T14:00:00Z",
  },
  {
    _id: "5",
    title: "feat: Add batch processing for data pipeline",
    githubPrNumber: 23,
    repo: "data-pipeline",
    branch: "feature/batch",
    baseBranch: "main",
    author: "alice",
    authorAvatar: "",
    status: "open",
    reviewStatus: "failed",
    filesChanged: 15,
    additions: 1203,
    deletions: 87,
    createdAt: "2024-01-11T11:45:00Z",
  },
];

const statusConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  open: { icon: GitPullRequest, label: "Open", className: "text-green-500" },
  merged: { icon: CheckCircle, label: "Merged", className: "text-purple-500" },
  closed: { icon: XCircle, label: "Closed", className: "text-red-500" },
};

const reviewStatusConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  in_progress: { icon: Loader2, label: "Analyzing", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { icon: CheckCircle, label: "Reviewed", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  failed: { icon: AlertTriangle, label: "Failed", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export default function PullRequestsPage() {
  const [search, setSearch] = useState("");

  const filteredPRs = mockPRs.filter(
    (pr) =>
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.repo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pull Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and analyze pull requests across your repositories
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pull requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3 stagger-children">
        {filteredPRs.map((pr) => {
          const status = statusConfig[pr.status];
          const rStatus = reviewStatusConfig[pr.reviewStatus];
          const StatusIcon = status.icon;
          const ReviewIcon = rStatus.icon;

          return (
            <Card key={pr._id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <StatusIcon className={cn("h-5 w-5 shrink-0", status.className)} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/reviews/${pr._id}`}
                        className="text-sm font-semibold hover:text-primary transition-colors truncate"
                      >
                        {pr.title}
                      </Link>
                      <span className="text-xs text-muted-foreground shrink-0">
                        #{pr.githubPrNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium">{pr.repo}</span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {pr.branch} → {pr.baseBranch}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        {pr.filesChanged} files
                      </span>
                      <span className="flex items-center gap-1 text-green-500">
                        <Plus className="h-3 w-3" />
                        {pr.additions}
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <Minus className="h-3 w-3" />
                        {pr.deletions}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pr.authorAvatar} />
                      <AvatarFallback className="text-[10px]">
                        {pr.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <Badge variant="outline" className={cn("text-xs gap-1", rStatus.className)}>
                      <ReviewIcon className={cn("h-3 w-3", pr.reviewStatus === "in_progress" && "animate-spin")} />
                      {rStatus.label}
                    </Badge>

                    {pr.reviewStatus === "pending" && (
                      <Button size="sm" className="animated-gradient text-white border-0 h-8 text-xs">
                        <Play className="mr-1 h-3 w-3" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
