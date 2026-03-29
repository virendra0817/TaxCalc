import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface CalculatorLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumb?: string;
}

export function CalculatorLayout({ children, title, description, breadcrumb }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{breadcrumb || title}</span>
          </nav>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-space tracking-tight mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-base max-w-2xl">{description}</p>
            )}
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
