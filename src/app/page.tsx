import Link from "next/link";
import { Calculator, TrendingUp, Shield, Zap, Scale, Receipt, Home, Wallet, LineChart, PiggyBank, Building2, GitCompare, House, Stamp, Award, Target, Laptop, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/index";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { categories, calculators } from "@/lib/calculators-meta";

const iconMap: Record<string, React.ElementType> = {
  Scale, Receipt, Home, Wallet, TrendingUp, Calendar, Target, Laptop,
  LineChart, PiggyBank, Building2, GitCompare, House, Stamp, Award, Calculator,
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background">
          <div className="container py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <Zap className="h-3 w-3 text-primary" />
              Free · signup required · FY 2025-26 updated
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-space tracking-tight mb-4">
              Navigate Your{" "}
              <span className="text-primary">Finances</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              16 free calculators for Indian income tax, investments, loans, and more. Accurate, fast, no ads.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/calculators/income-tax"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Receipt className="h-4 w-4" />
                Income Tax Calculator
              </Link>
              <Link
                href="/calculators/tax-regime-comparator"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <Scale className="h-4 w-4" />
                Compare Tax Regimes
              </Link>
            </div>
          </div>

          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-2xl" />
        </section>

        {/* Stats bar */}
        <section className="border-b bg-muted/30">
          <div className="container py-4 flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: "Calculators", value: "16" },
              { label: "Categories", value: "7" },
              { label: "FY Updated", value: "2025-26" },
              { label: "Always", value: "Free" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold font-space text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator grid by category */}
        <section className="container py-12 space-y-12">
          {categories.map((cat) => {
            const catCalcs = calculators.filter((c) => c.category === cat.id);
            if (catCalcs.length === 0) return null;
            return (
              <div key={cat.id}>
                <h2 className="text-xl font-semibold font-space mb-4 flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-primary inline-block" />
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catCalcs.map((calc) => {
                    const Icon = iconMap[calc.icon] || Calculator;
                    return (
                      <Link
                        key={calc.slug}
                        href={calc.href}
                        className="group relative flex items-start gap-4 rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 animate-fade-in"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {calc.title}
                            </h3>
                            {calc.badge && (
                              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                                {calc.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{calc.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* Features */}
        <section className="border-t bg-muted/20">
          <div className="container py-12">
            <h2 className="text-2xl font-bold font-space text-center mb-8">Why TaxCalc?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Instant Results", desc: "All calculations happen in real-time in your browser. No server calls, no delays." },
                { icon: Shield, title: "Always Accurate", desc: "Updated for FY 2025-26 tax slabs, 87A rebate, and latest LTCG/STCG rules." },
                { icon: Calculator, title: "Comprehensive", desc: "From basic income tax to advance tax schedules, stamp duty, and freelancer taxation." },
              ].map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
