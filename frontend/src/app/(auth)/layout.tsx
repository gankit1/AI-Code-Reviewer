import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — CodeLens AI",
  description: "Sign in to your CodeLens AI account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative animated-gradient items-center justify-center p-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Ship Better Code,
            <br />
            Faster.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            AI-powered code reviews that catch bugs, security vulnerabilities,
            and performance issues before they reach production.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "10K+", label: "Reviews" },
              { value: "98%", label: "Accuracy" },
              { value: "<30s", label: "Speed" },
              { value: "500+", label: "Teams" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
