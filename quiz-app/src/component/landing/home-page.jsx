import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" to="/">
          <div className="bg-secondary rounded-lg p-1.5">
            <Brain className="h-6 w-6 text-secondary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuizMaster</span>
        </Link>

        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center text-center px-4">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
            Create, Share, and Master{" "}
            <span className="text-secondary">Any Subject</span>
          </h1>

          <p className="mt-6 max-w-175 text-muted-foreground md:text-xl lg:text-2xl">
            The complete platform for interactive learning. Engage your
            students, train your team, or just challenge your friends with
            beautiful quizzes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20"
            >
              <Link to="/login">Log in</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-transparent"
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>

          {/* Social Proof */}
        </section>
      </main>

      <p className="text-xs text-muted-foreground text-center">
        © 2026 QuizMaster Inc. All rights reserved.
      </p>
    </div>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}
