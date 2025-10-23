import { Link } from "react-router-dom";
import { CheckCircle, Calendar, Filter, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
// import tidyListLogo from "@/assets/tidy-list-logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* <img src={tidyListLogo} alt="Tidy List" className="h-8" /> */}
            <Logo />
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Organize your life with{" "}
            <span className="text-primary">simplicity</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The clearest and most productive way to manage your daily tasks. Minimalist, powerful, and easy to use.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl" asChild>
              <Link to="/register">
                <Zap className="h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to be productive
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Simple Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, and complete tasks in seconds
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Due Dates</h3>
              <p className="text-sm text-muted-foreground">
                Never miss an important date
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Powerful Filters</h3>
              <p className="text-sm text-muted-foreground">
                Find what you need instantly
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Super Fast</h3>
              <p className="text-sm text-muted-foreground">
                Clean, distraction-free design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-card rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold">
            Ready to be more productive?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of users already organizing their life with Tidy List
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/register">
              Create Account
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Tidy List. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
