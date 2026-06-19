import Link from "next/link";
import {
  GitPullRequest,
  Shield,
  Zap,
  BarChart3,
  Code2,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Github } from "@/components/icons";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: GitPullRequest,
    title: "PR Analysis",
    description:
      "Automatically analyze pull requests with AI-powered code review. Get actionable feedback in seconds.",
  },
  {
    icon: Shield,
    title: "Security Detection",
    description:
      "Identify security vulnerabilities, XSS, SQL injection, and hardcoded secrets before they reach production.",
  },
  {
    icon: Zap,
    title: "Performance Insights",
    description:
      "Detect N+1 queries, memory leaks, unnecessary re-renders, and optimization opportunities.",
  },
  {
    icon: Code2,
    title: "Code Quality Scores",
    description:
      "Get comprehensive quality scores across security, performance, maintainability, and readability.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track review trends, issue severity over time, and repository health scores at a glance.",
  },
  {
    icon: Star,
    title: "AI Explanations",
    description:
      "Let AI explain complex code, suggest refactoring, and generate unit tests automatically.",
  },
];

const stats = [
  { value: "10K+", label: "Reviews Completed" },
  { value: "500+", label: "Repos Connected" },
  { value: "98%", label: "Issues Caught" },
  { value: "<30s", label: "Review Time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg animated-gradient flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              CodeLens <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#stats"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Stats
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="animated-gradient text-white border-0">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-chart-2/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-4 py-1.5 text-sm mb-8 fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Powered by GPT-4o & Claude
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 fade-in">
            AI-Powered
            <br />
            <span className="gradient-text">Code Review</span>
            <br />
            Platform
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 fade-in">
            Detect bugs, security vulnerabilities, and performance issues before
            they reach production. Connect your GitHub repos and get instant AI
            reviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in">
            <Link href="/signup">
              <Button
                size="lg"
                className="animated-gradient text-white border-0 h-12 px-8 text-base"
              >
                <Github className="mr-2 h-5 w-5" />
                Start with GitHub
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Hero Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="glass-card rounded-2xl p-1 glow">
              <div className="bg-card rounded-xl overflow-hidden border">
                {/* Mock dashboard header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-muted-foreground font-mono">
                      app.codelens.ai/dashboard
                    </span>
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6 grid grid-cols-4 gap-4">
                  {[
                    { label: "Repositories", value: "12", change: "+3" },
                    { label: "Total Reviews", value: "847", change: "+24" },
                    { label: "Issues Found", value: "2,341", change: "-12%" },
                    { label: "Avg Score", value: "87/100", change: "+5" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border bg-card/50 p-4"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-500 mt-1">
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mock chart area */}
                <div className="px-6 pb-6">
                  <div className="rounded-lg border bg-muted/20 h-48 flex items-end p-4 gap-2">
                    {[40, 65, 55, 80, 70, 90, 75, 85, 95, 60, 78, 88].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t animated-gradient opacity-70"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for
              <br />
              <span className="gradient-text">better code reviews</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From security scanning to performance optimization, CodeLens AI
              covers every aspect of modern code review.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group glass-card rounded-xl p-6 hover-lift cursor-default"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative rounded-2xl animated-gradient p-px overflow-hidden">
            <div className="relative rounded-2xl bg-card p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to ship better code?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of developers who use CodeLens AI to catch bugs,
                fix security issues, and ship with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="animated-gradient text-white border-0 h-12 px-8"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Free forever for open source
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md animated-gradient flex items-center justify-center">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">CodeLens AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeLens AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
