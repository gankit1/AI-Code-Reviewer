"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Star, Eye } from "lucide-react";
import { Github } from "@/components/icons";
import { Button } from "@/components/ui/button";
import PullRequestsPage from "../../pull-requests/page";

interface RepositoryDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RepositoryDetailsPage({ params }: RepositoryDetailsProps) {
  // Use React.use to unwrap the Promise
  const resolvedParams = use(params);
  
  // In a real app, you would fetch the repository details using the ID
  // For now, we'll display a generic header with the ID
  const repoId = resolvedParams.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/repositories" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Repository {repoId}</h1>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Public
            </span>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              github-repo-{repoId}
            </span>
            <span className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5" />
              128
            </span>
            <span className="flex items-center gap-1 text-blue-500">
              <Eye className="h-3.5 w-3.5" />
              42
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-3.5 w-3.5" />
              main
            </span>
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-border my-6" />

      {/* Render the PRs list (reusing the existing page for now) */}
      <PullRequestsPage />
    </div>
  );
}
