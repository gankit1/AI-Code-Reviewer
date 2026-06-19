"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GitFork,
  Search,
  Plus,
  Star,
  Lock,
  Globe,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  GitPullRequest,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LANGUAGE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const mockRepos = [
  {
    _id: "1",
    name: "frontend-app",
    fullName: "acme/frontend-app",
    description: "Next.js frontend application with TypeScript and Tailwind CSS",
    visibility: "private",
    language: "TypeScript",
    stars: 45,
    forks: 12,
    reviewCount: 142,
    healthScore: 87,
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "api-gateway",
    fullName: "acme/api-gateway",
    description: "Express.js API gateway with authentication and rate limiting",
    visibility: "private",
    language: "TypeScript",
    stars: 32,
    forks: 8,
    reviewCount: 89,
    healthScore: 92,
    updatedAt: "2024-01-14T15:20:00Z",
  },
  {
    _id: "3",
    name: "auth-service",
    fullName: "acme/auth-service",
    description: "Authentication microservice with OAuth2 and JWT",
    visibility: "public",
    language: "Go",
    stars: 128,
    forks: 34,
    reviewCount: 56,
    healthScore: 78,
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    _id: "4",
    name: "data-pipeline",
    fullName: "acme/data-pipeline",
    description: "Real-time data processing pipeline with Apache Kafka",
    visibility: "private",
    language: "Python",
    stars: 18,
    forks: 5,
    reviewCount: 23,
    healthScore: 65,
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    _id: "5",
    name: "mobile-app",
    fullName: "acme/mobile-app",
    description: "React Native mobile application for iOS and Android",
    visibility: "private",
    language: "TypeScript",
    stars: 67,
    forks: 15,
    reviewCount: 98,
    healthScore: 84,
    updatedAt: "2024-01-11T11:45:00Z",
  },
  {
    _id: "6",
    name: "design-system",
    fullName: "acme/design-system",
    description: "Shared component library and design tokens",
    visibility: "public",
    language: "TypeScript",
    stars: 256,
    forks: 42,
    reviewCount: 34,
    healthScore: 95,
    updatedAt: "2024-01-10T08:30:00Z",
  },
];

function HealthBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-500"
      : score >= 70
      ? "bg-yellow-500"
      : score >= 50
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{score}%</span>
    </div>
  );
}

export default function RepositoriesPage() {
  const [search, setSearch] = useState("");

  const filteredRepos = mockRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your connected GitHub repositories
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Import Repository
            </Button>
          } />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Import from GitHub</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search repositories..." className="pl-9" />
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {["new-project", "experiment-v2", "docs-site"].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <GitFork className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">acme/{name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated 2 days ago
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Import
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Repository grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 stagger-children">
        {filteredRepos.map((repo) => (
          <Card key={repo._id} className="hover-lift group">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <GitFork className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <Link
                      href={`/repositories/${repo._id}`}
                      className="text-sm font-semibold hover:text-primary transition-colors truncate block"
                    >
                      {repo.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{repo.fullName}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on GitHub
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {repo.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Unknown,
                    }}
                  />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  {repo.visibility === "private" ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  {repo.visibility}
                </span>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Health Score
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3" />
                    {repo.reviewCount} reviews
                  </span>
                </div>
                <HealthBar score={repo.healthScore} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
