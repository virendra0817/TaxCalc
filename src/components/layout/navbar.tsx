"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, User, Calculator, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-4 w-4" />
          </div>
          <span className="font-space text-lg tracking-tight">TaxCalc</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/calculators/income-tax" className="text-muted-foreground hover:text-foreground transition-colors">Income Tax</Link>
          <Link href="/calculators/sip" className="text-muted-foreground hover:text-foreground transition-colors">SIP</Link>
          <Link href="/calculators/gst" className="text-muted-foreground hover:text-foreground transition-colors">GST</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {session.user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:flex gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="hidden md:flex">Sign in</Button>
            </Link>
          )}

          {/* Mobile toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
          {[
            { href: "/", label: "Home" },
            { href: "/calculators/income-tax", label: "Income Tax" },
            { href: "/calculators/tax-regime-comparator", label: "Old vs New Regime" },
            { href: "/calculators/sip", label: "SIP Calculator" },
            { href: "/calculators/gst", label: "GST Calculator" },
            { href: "/calculators/home-loan-emi", label: "Home Loan EMI" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => { signOut(); setMobileOpen(false); }}
              className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="mt-2 w-full">Sign in</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
